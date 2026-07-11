#!/usr/bin/env python3

"""
Cropping a small thumbnail around one matched string bounding box

Taking the union of the strings’ own word boxes, in PDF points, converting to pixels at the page’s rasterisation DPI, adding a fixed padding, and saving the result as its own small image file, so a comparison table can embed the highlighted region itself rather than merely linking to the full page
"""

import argparse
import json

from PIL import Image

def crop(image_path: str, boxes_points: list[dict], dpi: int, padding_px: int, output_path: str) -> None:
  image = Image.open(image_path)
  scale = dpi / 72.0

  x0 = min(box["xMin"] for box in boxes_points) * scale - padding_px
  y0 = min(box["yMin"] for box in boxes_points) * scale - padding_px
  x1 = max(box["xMax"] for box in boxes_points) * scale + padding_px
  y1 = max(box["yMax"] for box in boxes_points) * scale + padding_px

  x0 = max(0, x0)
  y0 = max(0, y0)
  x1 = min(image.width, x1)
  y1 = min(image.height, y1)

  cropped = image.crop((x0, y0, x1, y1))
  cropped.save(output_path)

def main() -> None:
  parser = argparse.ArgumentParser(description="Cropping a thumbnail around a matched phrase")
  parser.add_argument("--image", required=True, help="Path to the source (already annotated) page PNG")
  parser.add_argument("--boxes", required=True, help="Path to a JSON file of {xMin,yMin,xMax,yMax} in points")
  parser.add_argument("--dpi", type=int, required=True, help="DPI the source image was rasterised at")
  parser.add_argument("--padding", type=int, default=6, help="Padding in pixels around the cropped region")
  parser.add_argument("--output", required=True, help="Path to write the cropped thumbnail PNG")
  args = parser.parse_args()

  with open(args.boxes, "r", encoding="utf-8") as handle:
    boxes = json.load(handle)

  crop(args.image, boxes, args.dpi, args.padding, args.output)

if __name__ == "__main__":
  main()
