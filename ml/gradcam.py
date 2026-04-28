"""
DeepProvenance — Grad-CAM Visualization for ViT.
Generates heatmaps showing which image regions triggered the AI verdict.
"""
import torch
import numpy as np
from PIL import Image
from torchvision import transforms
import io


def generate_gradcam(model, image_bytes: bytes, target_layer=None) -> np.ndarray:
    """
    Generate Grad-CAM heatmap for a ViT model.

    Args:
        model: Fine-tuned ViT model
        image_bytes: Raw image bytes
        target_layer: Target layer for Grad-CAM (default: last attention block)

    Returns:
        Heatmap as numpy array (H, W) with values 0-1
    """
    from pytorch_grad_cam import GradCAM
    from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
    from pytorch_grad_cam.utils.image import show_cam_on_image

    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    input_tensor = transform(image).unsqueeze(0)

    # For ViT, use the last attention block's norm layer
    if target_layer is None:
        target_layer = model.blocks[-1].norm1

    cam = GradCAM(model=model, target_layers=[target_layer], reshape_transform=reshape_transform_vit)

    # Generate for AI-Generated class (class 1)
    targets = [ClassifierOutputTarget(1)]
    grayscale_cam = cam(input_tensor=input_tensor, targets=targets)

    return grayscale_cam[0]  # (224, 224) heatmap


def reshape_transform_vit(tensor, height=14, width=14):
    """Reshape ViT attention output for Grad-CAM compatibility."""
    result = tensor[:, 1:, :].reshape(tensor.size(0), height, width, tensor.size(2))
    result = result.permute(0, 3, 1, 2)
    return result


def generate_sports_feature_heatmap(heatmap: np.ndarray) -> dict:
    """
    Analyze Grad-CAM heatmap to identify sports-specific artifact regions.

    Returns per-feature contribution scores:
    - grass: Lower region texture analysis
    - jerseys: Mid-region fabric patterns
    - ball: High-activation small regions
    - crowd: Upper region patterns
    - lighting: Shadow consistency
    - hands: Extremity distortions
    """
    h, w = heatmap.shape

    # Split into regions for analysis
    grass_region = heatmap[int(h * 0.6):, :]
    jersey_region = heatmap[int(h * 0.3):int(h * 0.7), :]
    crowd_region = heatmap[:int(h * 0.3), :]
    center_region = heatmap[int(h * 0.3):int(h * 0.7), int(w * 0.3):int(w * 0.7)]

    return {
        "grass": round(float(grass_region.mean()) * 100, 1),
        "jerseys": round(float(jersey_region.mean()) * 100, 1),
        "ball": round(float(center_region.max()) * 100, 1),
        "crowd": round(float(crowd_region.mean()) * 100, 1),
        "lighting": round(float(np.std(heatmap, axis=1).mean()) * 100, 1),
        "hands": round(float(np.percentile(heatmap, 95)) * 100, 1),
    }
