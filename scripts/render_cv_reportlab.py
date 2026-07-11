#!/usr/bin/env python3

"""
Rendering a *curriculum vitae* IR (JSON) to a vector PDF using ReportLab

Using the Platypus layer (`SimpleDocTemplate`, `Paragraph`, `Frame`), a text flow engine with real word wrapping and pagination
"""

import argparse
import json
import sys
from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem
from reportlab.lib.styles import ParagraphStyle

# Adding the `assets/engines/python `directory to the import path, so the W3C-DTCG-generated token constants can be imported directly rather than duplicated here
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "assets" / "engines" / "python"))
from tokens_clean import (  # noqa: E402
  COLOR_SEMANTIC_TEXT_PRIMARY,
  COLOR_SEMANTIC_TEXT_SECONDARY,
  COLOR_SEMANTIC_TEXT_MUTED,
)

FONT_FAMILY_NAME = "GoogleSans"

def register_fonts(regular_path: str, bold_path: str, italic_path: str, bold_italic_path: str) -> None:
  pdfmetrics.registerFont(TTFont(FONT_FAMILY_NAME, regular_path))
  pdfmetrics.registerFont(TTFont(f"{FONT_FAMILY_NAME}-Bold", bold_path))
  pdfmetrics.registerFont(TTFont(f"{FONT_FAMILY_NAME}-Italic", italic_path))
  pdfmetrics.registerFont(TTFont(f"{FONT_FAMILY_NAME}-BoldItalic", bold_italic_path))
  pdfmetrics.registerFontFamily(
    FONT_FAMILY_NAME,
    normal=FONT_FAMILY_NAME,
    bold=f"{FONT_FAMILY_NAME}-Bold",
    italic=f"{FONT_FAMILY_NAME}-Italic",
    boldItalic=f"{FONT_FAMILY_NAME}-BoldItalic",
  )

def build_styles() -> dict[str, ParagraphStyle]:
  return {
    "name": ParagraphStyle(
      "name", fontName=f"{FONT_FAMILY_NAME}-Bold", fontSize=20,
      textColor=COLOR_SEMANTIC_TEXT_PRIMARY, spaceAfter=2,
    ),
    "headline": ParagraphStyle(
      "headline", fontName=f"{FONT_FAMILY_NAME}-Italic", fontSize=11,
      textColor=COLOR_SEMANTIC_TEXT_SECONDARY, spaceAfter=2,
    ),
    "contact": ParagraphStyle(
      "contact", fontName=FONT_FAMILY_NAME, fontSize=9.5,
      textColor=COLOR_SEMANTIC_TEXT_MUTED, spaceAfter=12,
    ),
    "heading": ParagraphStyle(
      "heading", fontName=f"{FONT_FAMILY_NAME}-Bold", fontSize=13,
      textColor=COLOR_SEMANTIC_TEXT_PRIMARY, spaceBefore=10, spaceAfter=6,
    ),
    "body": ParagraphStyle(
      "body", fontName=FONT_FAMILY_NAME, fontSize=10.5,
      textColor=COLOR_SEMANTIC_TEXT_PRIMARY, leading=14, spaceAfter=4,
    ),
    "entryTitle": ParagraphStyle(
      "entryTitle", fontName=f"{FONT_FAMILY_NAME}-Bold", fontSize=11,
      textColor=COLOR_SEMANTIC_TEXT_PRIMARY, spaceAfter=1,
    ),
    "entryMeta": ParagraphStyle(
      "entryMeta", fontName=f"{FONT_FAMILY_NAME}-Italic", fontSize=9.5,
      textColor=COLOR_SEMANTIC_TEXT_MUTED, spaceAfter=4,
    ),
    "bullet": ParagraphStyle(
      "bullet", fontName=FONT_FAMILY_NAME, fontSize=10, leading=13,
      textColor=COLOR_SEMANTIC_TEXT_PRIMARY,
    ),
  }

def build_story(ir: dict, styles: dict[str, ParagraphStyle]) -> list:
  story = []
  story.append(Paragraph(ir["fullName"], styles["name"]))

  if ir.get("headline"):
    story.append(Paragraph(ir["headline"], styles["headline"]))

  contact = ir.get("contact", {})
  contact_bits = [ir.get("location", "")]

  if contact.get("email"):
    contact_bits.append(contact["email"])
  if contact.get("website"):
    contact_bits.append(contact["website"])

  story.append(Paragraph(" &middot; ".join(b for b in contact_bits if b), styles["contact"]))

  if ir.get("summary"):
    story.append(Paragraph("Summary", styles["heading"]))
    story.append(Paragraph(ir["summary"], styles["body"]))

  if ir.get("experience"):
    story.append(Paragraph("Experience", styles["heading"]))

    for entry in ir["experience"]:
      end = "Present" if entry.get("current") else entry.get("endDate", "")
      story.append(Paragraph(f"{entry['title']} &mdash; {entry['company']}", styles["entryTitle"]))
      story.append(Paragraph(f"{entry['startDate']} &ndash; {end}", styles["entryMeta"]))

      if entry.get("highlights"):
        items = [ListItem(Paragraph(h, styles["bullet"])) for h in entry["highlights"]]
        story.append(ListFlowable(items, bulletType="bullet", leftIndent=14))
      story.append(Spacer(1, 6))

  if ir.get("education"):
    story.append(Paragraph("Education", styles["heading"]))

    for entry in ir["education"]:
      end = "Present" if entry.get("current") else entry.get("endDate", "")
      story.append(Paragraph(f"{entry['degree']} &mdash; {entry['institution']}", styles["entryTitle"]))
      story.append(Paragraph(f"{entry['startDate']} &ndash; {end}", styles["entryMeta"]))

  skills = ir.get("skills", {})

  if any(skills.get(k) for k in ("technical", "tools", "soft")):
    story.append(Paragraph("Skills", styles["heading"]))

    for label, key in (("Technical", "technical"), ("Tools", "tools"), ("Soft skills", "soft")):
      items = skills.get(key, [])

      if items:
        story.append(Paragraph(f"<b>{label}:</b> {', '.join(items)}", styles["body"]))

  return story

def render(ir: dict, output_path: str) -> None:
  doc = SimpleDocTemplate(
    output_path, pagesize=A4,
    leftMargin=20 * mm, rightMargin=20 * mm, topMargin=18 * mm, bottomMargin=18 * mm,
    title=ir["fullName"],
  )

  styles = build_styles()
  doc.build(build_story(ir, styles))

def main() -> None:
  parser = argparse.ArgumentParser(description="Rendering a CV IR JSON file to PDF via ReportLab")
  parser.add_argument("--input", required=True)
  parser.add_argument("--output", required=True)
  parser.add_argument("--font-regular", required=True)
  parser.add_argument("--font-bold", required=True)
  parser.add_argument("--font-italic", required=True)
  parser.add_argument("--font-bold-italic", required=True)
  args = parser.parse_args()

  register_fonts(args.font_regular, args.font_bold, args.font_italic, args.font_bold_italic)

  with open(args.input, "r", encoding="utf-8") as handle:
    ir = json.load(handle)

  render(ir, args.output)

if __name__ == "__main__":
    main()
