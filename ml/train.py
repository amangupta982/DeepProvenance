"""
DeepProvenance — ViT Fine-tuning for Sports AI Forgery Detection.

Model: google/vit-base-patch16-224
Task: Binary classification (Real=0, AI-Generated=1)
Dataset: Real sports images vs AI-generated sports images
"""
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, Dataset
from torchvision import transforms
import timm
from pathlib import Path
import argparse
import json
from datetime import datetime


class SportsForensicsDataset(Dataset):
    """Dataset of real vs AI-generated sports images."""

    def __init__(self, root_dir: str, split: str = "train", transform=None):
        self.root = Path(root_dir) / split
        self.transform = transform or transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.RandomHorizontalFlip(),
            transforms.ColorJitter(brightness=0.2, contrast=0.2),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])
        self.samples = []
        for label, class_name in enumerate(["real", "ai_generated"]):
            class_dir = self.root / class_name
            if class_dir.exists():
                for img_path in class_dir.glob("*.*"):
                    if img_path.suffix.lower() in [".jpg", ".jpeg", ".png", ".webp"]:
                        self.samples.append((str(img_path), label))

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        from PIL import Image
        path, label = self.samples[idx]
        image = Image.open(path).convert("RGB")
        if self.transform:
            image = self.transform(image)
        return image, label


def create_model(num_classes: int = 2, pretrained: bool = True) -> nn.Module:
    """Create ViT-base model for binary classification."""
    model = timm.create_model(
        "vit_base_patch16_224",
        pretrained=pretrained,
        num_classes=num_classes,
    )
    return model


def train(args):
    """Fine-tune ViT on sports forgery dataset."""
    device = torch.device("cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu")
    print(f"Using device: {device}")

    # Model
    model = create_model(num_classes=2, pretrained=True).to(device)

    # Data
    train_transform = transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.RandomCrop(224),
        transforms.RandomHorizontalFlip(),
        transforms.ColorJitter(brightness=0.3, contrast=0.3, saturation=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    val_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

    train_dataset = SportsForensicsDataset(args.data_dir, "train", train_transform)
    val_dataset = SportsForensicsDataset(args.data_dir, "val", val_transform)

    train_loader = DataLoader(train_dataset, batch_size=args.batch_size, shuffle=True, num_workers=4, pin_memory=True)
    val_loader = DataLoader(val_dataset, batch_size=args.batch_size, shuffle=False, num_workers=4, pin_memory=True)

    # Training
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.AdamW(model.parameters(), lr=args.lr, weight_decay=0.01)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=args.epochs)

    best_val_acc = 0.0
    history = []

    for epoch in range(args.epochs):
        # Train
        model.train()
        train_loss, train_correct, train_total = 0, 0, 0
        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            train_loss += loss.item()
            _, predicted = outputs.max(1)
            train_total += labels.size(0)
            train_correct += predicted.eq(labels).sum().item()

        # Validate
        model.eval()
        val_loss, val_correct, val_total = 0, 0, 0
        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                loss = criterion(outputs, labels)
                val_loss += loss.item()
                _, predicted = outputs.max(1)
                val_total += labels.size(0)
                val_correct += predicted.eq(labels).sum().item()

        train_acc = 100. * train_correct / max(train_total, 1)
        val_acc = 100. * val_correct / max(val_total, 1)
        scheduler.step()

        print(f"Epoch {epoch+1}/{args.epochs} | Train Acc: {train_acc:.2f}% | Val Acc: {val_acc:.2f}%")
        history.append({"epoch": epoch+1, "train_acc": train_acc, "val_acc": val_acc})

        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), args.output_path)
            print(f"  → Saved best model (val_acc={val_acc:.2f}%)")

    # Save training history
    with open(Path(args.output_path).parent / "training_history.json", "w") as f:
        json.dump({"history": history, "best_val_acc": best_val_acc, "timestamp": datetime.utcnow().isoformat()}, f, indent=2)

    print(f"\n✅ Training complete. Best validation accuracy: {best_val_acc:.2f}%")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train ViT forgery detector")
    parser.add_argument("--data-dir", type=str, default="./data", help="Dataset directory")
    parser.add_argument("--output-path", type=str, default="./checkpoints/vit_forgery_detector.pth")
    parser.add_argument("--epochs", type=int, default=20)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--lr", type=float, default=1e-4)
    args = parser.parse_args()

    Path(args.output_path).parent.mkdir(parents=True, exist_ok=True)
    train(args)
