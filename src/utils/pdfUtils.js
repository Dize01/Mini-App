import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

function hexToRgb(hex) {
  const c = hex.replace('#', '');
  return rgb(
    parseInt(c.slice(0, 2), 16) / 255,
    parseInt(c.slice(2, 4), 16) / 255,
    parseInt(c.slice(4, 6), 16) / 255,
  );
}

export async function downloadPDF(file, textBoxes = [], shapes = []) {
  const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
  const pages  = pdfDoc.getPages();

  const helvetica     = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // ── Draw shapes ──────────────────────────────────────────────
  for (const shape of shapes) {
    const page = pages[(shape.page ?? 1) - 1];
    if (!page) continue;
    const { height: pH } = page.getSize();

    // Convert top-left origin → pdf-lib bottom-left origin
    const x = shape.x;
    const y = pH - shape.y - shape.height;
    const hasFill   = shape.fillColor && shape.fillColor !== 'none';
    const hasBorder = shape.borderWidth > 0;

    const common = {
      ...(hasFill   ? { color: hexToRgb(shape.fillColor) } : {}),
      ...(hasBorder ? { borderColor: hexToRgb(shape.borderColor), borderWidth: shape.borderWidth } : {}),
    };

    if (shape.shapeType === 'circle') {
      page.drawEllipse({
        x: x + shape.width / 2,
        y: y + shape.height / 2,
        xScale: shape.width  / 2,
        yScale: shape.height / 2,
        ...common,
      });
    } else {
      page.drawRectangle({ x, y, width: shape.width, height: shape.height, ...common });
    }
  }

  // ── Draw text boxes ───────────────────────────────────────────
  for (const box of textBoxes) {
    if (!box.text.trim()) continue;
    const page = pages[(box.page ?? 1) - 1];
    if (!page) continue;
    const { height: pH } = page.getSize();
    const font = box.bold ? helveticaBold : helvetica;

    box.text.split('\n').forEach((line, i) => {
      if (!line && i === box.text.split('\n').length - 1) return;
      page.drawText(line || ' ', {
        x: Math.max(0, box.x),
        y: Math.max(0, pH - box.y - box.fontSize - i * box.fontSize * 1.2),
        size: box.fontSize,
        font,
        color: hexToRgb(box.color),
      });
    });
  }

  const bytes = await pdfDoc.save();
  const url   = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
  const link  = Object.assign(document.createElement('a'), { href: url, download: 'edited.pdf' });
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
