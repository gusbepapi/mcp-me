#!/usr/bin/env python3
"""
Drawing the bounding boxes directly onto a rasterised PDF page image

Baking the highlight boxes into the image itself, rather than layering them as an HTML overlay, so the resulting file is a portable and standalone artefact
"""

import argparse
import json

from PIL import Image, ImageDraw

BOX_OUTLINE = (201, 162, 39, 230)
BOX_FILL = (201, 162, 39, 60)

def annotate(image_path: str, boxes_points: list[dict], dpi: int, output_path: str) -> None:
  base = Image.open(image_path).convert("RGBA")
  overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
  draw = ImageDraw.Draw(overlay)

  scale = dpi / 72.0
  for box in boxes_points:
    x0 = box["xMin"] * scale
    y0 = box["yMin"] * scale
    x1 = box["xMax"] * scale
    y1 = box["yMax"] * scale
    draw.rectangle([x0, y0, x1, y1], outline=BOX_OUTLINE, fill=BOX_FILL, width=1)

  composited = Image.alpha_composite(base, overlay)
  composited.convert("RGB").save(output_path)

def main() -> None:
  parser = argparse.ArgumentParser(description="Annotating a page image with word bounding boxes")
  parser.add_argument("--image", required=True, help="Path to the source PNG")
  parser.add_argument("--boxes", required=True, help="Path to a JSON file of {xMin,yMin,xMax,yMax} in points")
  parser.add_argument("--dpi", type=int, required=True, help="DPI the image was rasterised at")
  parser.add_argument("--output", required=True, help="Path to write the annotated PNG")
  args = parser.parse_args()

  with open(args.boxes, "r", encoding="utf-8") as handle:
      boxes = json.load(handle)

  annotate(args.image, boxes, args.dpi, args.output)

if __name__ == "__main__":
  main()
