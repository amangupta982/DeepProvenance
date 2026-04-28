"""
DeepProvenance — Model Evaluation Pipeline.
Computes F1, AUC-ROC, Precision, Recall on held-out test set.
"""
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import transforms
from sklearn.metrics import f1_score, roc_auc_score, precision_score, recall_score, confusion_matrix
import numpy as np
import json
import argparse
from pathlib import Path
from train import SportsForensicsDataset, create_model


def evaluate(args):
    """Evaluate model on test set."""
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    # Load model
    model = create_model(num_classes=2, pretrained=False)
    model.load_state_dict(torch.load(args.model_path, map_location=device))
    model.to(device)
    model.eval()

    # Test data
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    test_dataset = SportsForensicsDataset(args.data_dir, "test", transform)
    test_loader = DataLoader(test_dataset, batch_size=32, shuffle=False, num_workers=4)

    all_labels, all_preds, all_probs = [], [], []

    with torch.no_grad():
        for images, labels in test_loader:
            images = images.to(device)
            outputs = model(images)
            probs = torch.softmax(outputs, dim=1)[:, 1]
            _, predicted = outputs.max(1)

            all_labels.extend(labels.numpy())
            all_preds.extend(predicted.cpu().numpy())
            all_probs.extend(probs.cpu().numpy())

    labels = np.array(all_labels)
    preds = np.array(all_preds)
    probs = np.array(all_probs)

    # Metrics
    metrics = {
        "f1_score": float(f1_score(labels, preds)),
        "auc_roc": float(roc_auc_score(labels, probs)),
        "precision": float(precision_score(labels, preds)),
        "recall": float(recall_score(labels, preds)),
        "accuracy": float((preds == labels).mean()),
        "confusion_matrix": confusion_matrix(labels, preds).tolist(),
        "total_samples": len(labels),
    }

    print("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("  DeepProvenance Model Evaluation")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print(f"  F1 Score:   {metrics['f1_score']:.4f}")
    print(f"  AUC-ROC:    {metrics['auc_roc']:.4f}")
    print(f"  Precision:  {metrics['precision']:.4f}")
    print(f"  Recall:     {metrics['recall']:.4f}")
    print(f"  Accuracy:   {metrics['accuracy']:.4f}")
    print(f"  Samples:    {metrics['total_samples']}")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")

    # Assertions for CI
    assert metrics["f1_score"] > 0.90, f"F1 score {metrics['f1_score']:.4f} below threshold 0.90"
    assert metrics["auc_roc"] > 0.93, f"AUC-ROC {metrics['auc_roc']:.4f} below threshold 0.93"
    assert metrics["precision"] > 0.88, f"Precision {metrics['precision']:.4f} below threshold 0.88"
    assert metrics["recall"] > 0.91, f"Recall {metrics['recall']:.4f} below threshold 0.91"

    print("✅ All metric thresholds passed!")

    # Save results
    output_path = Path(args.output_dir) / "evaluation_results.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(metrics, f, indent=2)
    print(f"📊 Results saved to {output_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate forgery detection model")
    parser.add_argument("--model-path", type=str, default="./checkpoints/vit_forgery_detector.pth")
    parser.add_argument("--data-dir", type=str, default="./data")
    parser.add_argument("--output-dir", type=str, default="./results")
    args = parser.parse_args()
    evaluate(args)
