import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  return rgb(r, g, b);
}

export async function downloadPDF(file, textBoxes, pageInfo) {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { height: pdfHeight } = firstPage.getSize();

  for (const box of textBoxes) {
    if (!box.text.trim()) continue;
    const page = pages[(box.page ?? 1) - 1];
    if (!page) continue;

    // box.x, box.y are in PDF points from top-left.
    // pdf-lib uses bottom-left origin, so flip y.
    // Subtract fontSize to place the top of the glyph at box.y.
    const x = box.x;
    const y = pdfHeight - box.y - box.fontSize;

    // Handle multi-line text
    const lines = box.text.split('\n');
    lines.forEach((line, i) => {
      if (!line.trim() && i === lines.length - 1) return;
      page.drawText(line || ' ', {
        x: Math.max(0, x),
        y: Math.max(0, y - i * box.fontSize * 1.2),
        size: box.fontSize,
        font: box.bold ? helveticaBold : helvetica,
        color: hexToRgb(box.color),
      });
    });
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'edited.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
