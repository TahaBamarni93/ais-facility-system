import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Export a single DOM element as a PDF page
export async function exportElementAsPDF(el, filename = 'label.pdf') {
  const canvas = await html2canvas(el, {
    scale: 3,
    useCORS: true,
    backgroundColor: '#ffffff',
  });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width/3, canvas.height/3] });
  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width/3, canvas.height/3);
  pdf.save(filename);
}

// Export multiple label elements as one multi-page PDF
export async function exportLabelsBulk(elements, filename = 'door_labels.pdf') {
  if (!elements.length) return;

  // Render first element to get dimensions
  const first = await html2canvas(elements[0], { scale: 3, useCORS: true, backgroundColor: '#ffffff' });
  const pageW = first.width / 3;
  const pageH = first.height / 3;

  const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [pageW, pageH] });

  for (let i = 0; i < elements.length; i++) {
    if (i > 0) pdf.addPage([pageW, pageH], 'landscape');
    const canvas = await html2canvas(elements[i], { scale: 3, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, pageW, pageH);
  }

  pdf.save(filename);
}

// Print helper — opens browser print dialog with labels only
export function printLabels(containerEl) {
  const content = containerEl.innerHTML;
  const win = window.open('', '_blank');
  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>AIS Door Labels</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: white; }
        .label-page {
          width: 560px; height: 210px;
          page-break-after: always;
          page-break-inside: avoid;
        }
        @page { size: A5 landscape; margin: 8mm; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
      </style>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&display=swap" rel="stylesheet">
    </head>
    <body>${content}</body>
    </html>
  `);
  win.document.close();
  win.onload = () => { win.focus(); win.print(); };
}
