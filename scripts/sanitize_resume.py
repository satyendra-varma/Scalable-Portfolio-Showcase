"""Generate a public-safe resume, removing phone text and document metadata."""

from pathlib import Path
import re
import pymupdf

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "attached_assets/Satyendra_Varma_Resume_1793845881888.pdf"
OUTPUT = ROOT / "artifacts/portfolio/public/resume.pdf"
PHONE = re.compile(r"(?<!\d)(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}(?!\d)")


def main():
    document = pymupdf.open(SOURCE)
    removed = 0
    for page in document:
        for match in PHONE.finditer(page.get_text()):
            for rectangle in page.search_for(match.group()):
                page.add_redact_annot(rectangle, fill=(1, 1, 1))
                removed += 1
        page.apply_redactions()
        for link in page.get_links():
            if str(link.get("uri", "")).lower().startswith("tel:"):
                page.delete_link(link)
    if not removed:
        raise RuntimeError("No phone match was removed; public PDF needs manual review.")
    document.set_metadata({})
    document.del_xml_metadata()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    document.save(OUTPUT, garbage=4, deflate=True, clean=True)
    document.close()

    public = pymupdf.open(OUTPUT)
    text = "\n".join(page.get_text() for page in public)
    if PHONE.search(text):
        raise RuntimeError("Public PDF still contains phone data.")
    required = ["SATYENDRA", "Professional Summary", "Crescenza", "Nanomindz", "Education"]
    if any(value not in text for value in required):
        raise RuntimeError("Public PDF is missing required resume content.")
    if any(public.metadata.get(key) for key in ("author", "subject", "keywords")):
        raise RuntimeError("Unexpected public PDF metadata.")
    # Keep verification rendering outside deployable assets and Git.
    preview = ROOT / "generated-artifacts/resume-review"
    preview.mkdir(parents=True, exist_ok=True)
    public[0].get_pixmap(matrix=pymupdf.Matrix(1.2, 1.2)).save(preview / "page-1.png")
    print(f"Public resume generated: {len(public)} pages; phone removed; metadata cleared.")
    public.close()


if __name__ == "__main__":
    main()
