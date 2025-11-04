import { jsPDF } from 'jspdf';

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const slice = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(slice));
  }
  return btoa(binary);
}

async function loadCustomFont(
  doc: jsPDF,
  url: string,
  fontFileName: string,
  fontName: string,
  weight = 'normal'
) {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const base64 = arrayBufferToBase64(buffer);

  doc.addFileToVFS(fontFileName, base64);
  doc.addFont(fontFileName, fontName, weight, 'Identity-H');
}

export async function generateInvoicePdf() {
  const doc = new jsPDF();
  await loadCustomFont(doc, '/fonts/Satoshi-Bold.ttf', 'Satoshi-Bold.ttf', 'Satoshi', 'bold');
  await loadCustomFont(doc, '/fonts/Satoshi-Medium.ttf', 'Satoshi-Medium.ttf', 'Satoshi', 'medium');
  await loadCustomFont(
    doc,
    '/fonts/NotoSans-Regular.ttf',
    'NotoSans-Regular.ttf',
    'Noto Sans',
    'normal'
  );
  await loadCustomFont(doc, '/fonts/NotoSans-Bold.ttf', 'NotoSans-Bold.ttf', 'Noto Sans', 'bold');

  const logoBase64 =
    'data:image/png;base64,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'; // <-- Replace with actual base64
  doc.addImage(logoBase64, 'PNG', 20, 10, 30, 12);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(22);
  doc.setFont('Satoshi', 'bold');
  doc.text('INVOICE', 160, 20, { align: 'right' });

  doc.setFontSize(12);
  doc.setFont('Satoshi', 'medium');
  doc.setTextColor(0, 0, 0);
  doc.text('Athlitics Company,', 20, 30);
  doc.text('Akshay Nagar 1st Block 1st', 20, 35, { maxWidth: 170 });
  doc.text('Cross,Ramamurthy nagar,', 20, 40);
  doc.text('Bangalore-560016', 20, 45);
  doc.text('GSTIN: ', 20, 50);
  doc.setFont('Satoshi', 'bold');
  doc.text('23245325252242', 35, 50);
  doc.setFont('Satoshi', 'medium');

  doc.text('Invoice No: ', 128, 30, { align: 'left' });
  doc.setFont('Satoshi', 'bold');
  doc.text('AL32423425', 152, 30, { align: 'left' });
  doc.setFont('Satoshi', 'medium');
  doc.text('Invoice Date: ', 128, 35, { align: 'left' });
  doc.setFont('Satoshi', 'bold');
  doc.text('Jul 05, 2025', 156, 35, { align: 'left' });
  doc.setFont('Satoshi', 'medium');
  doc.text('Invoice Amount: ', 128, 40, { align: 'left' });
  doc.setTextColor(0, 0, 0);
  doc.setFont('Noto Sans', 'bold');
  doc.setFontSize(14);
  doc.text('₹', 162, 40);
  doc.setFont('Satoshi', 'bold');
  doc.setFontSize(12);
  doc.text('14,999', 165, 40, { align: 'left' });
  doc.setFont('Satoshi', 'bold');
  doc.setFontSize(12);
  doc.setTextColor('#00C314');
  doc.text('PAID', 128, 45, { align: 'left' });
  doc.setDrawColor("#C0C0C0");
  doc.setLineWidth(0.5);
  doc.line(20, 56, 190, 56);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont('Satoshi', 'bold');
  doc.text('BILLED TO', 20, 66);
  doc.setFontSize(12);
  doc.setFont('Satoshi', 'medium');
  doc.setTextColor(0, 0, 0);
  doc.text('Athlitics Company,', 20, 74);
  doc.text('Akshay Nagar 1st Block 1st', 20, 79, { maxWidth: 170 });
  doc.text('Cross,Ramamurthy nagar,', 20, 84);
  doc.text('Bangalore-560016', 20, 89);
  doc.setFont('Satoshi', 'medium');
  doc.setTextColor(0, 0, 0);
  doc.text('GSTIN: ', 20, 94);
  doc.setFont('Satoshi', 'bold');
  doc.text('23245325252242', 35, 94);
  doc.setFont('Satoshi', 'medium');

  doc.line(20, 102, 190, 102);

  doc.setFontSize(12);
  doc.setFont('Satoshi', 'medium');
  doc.setTextColor(0, 0, 0);
  doc.text('DESCRIPTION', 20, 112);
  doc.text('UNITS', 100, 112);
  doc.text('PRICE', 130, 112);
  doc.text('AMOUNT (INR)', 160, 112);

  doc.line(20, 119, 190, 119);

  doc.setFontSize(12);
  doc.setFont('Satoshi', 'bold');
  doc.text('Athlitics Pro Tire Yearly', 20, 130, { maxWidth: 70 });
  doc.setFont('Satoshi', 'medium');
  doc.setFontSize(10);
  doc.text('Jul 05, 2025 - Jul 05,2026', 20, 135);
  doc.setFont('Satoshi', 'bold');
  doc.setFontSize(12);
  doc.text('1', 100, 130);
  doc.setFont('Noto Sans', 'bold');
  doc.setFontSize(14);
  doc.text('₹', 130, 130);
  doc.setFont('Satoshi', 'bold');
  doc.setFontSize(12);
  doc.text('14,999', 133, 130);
  doc.setFont('Noto Sans', 'bold');
  doc.setFontSize(14);
  doc.text('₹', 173, 130);
  doc.setFont('Satoshi', 'bold');
  doc.setFontSize(12);
  doc.text('14,999', 176, 130);
  doc.line(20, 142, 190, 142);
  doc.setFontSize(12);
  doc.setFont('Satoshi', 'medium');
  doc.text('Total', 20, 152);
  doc.setFont('Noto Sans', 'bold');
  doc.setFontSize(14);
  doc.text('₹', 173, 152);
  doc.setFont('Satoshi', 'bold');
  doc.setFontSize(12);
  doc.text('14,999', 176, 152);

  doc.setFontSize(12);
  doc.setFont('Satoshi', 'medium');
  doc.text('PAYMENTS', 20, 186);
  doc.line(20, 192, 190, 192);
  doc.setFont('Noto Sans', 'normal');
  doc.setFontSize(13);
  doc.text('₹', 20, 202);
  doc.setFont('Satoshi', 'medium');
  doc.setFontSize(12);
  doc.text('14,999 was paid on Jul 05,2025 12:46 UTC by Master Card ending 2423', 23, 202, {
    maxWidth: 170,
  });

  doc.setFontSize(16);
  doc.setFont('Satoshi', 'bold');
  doc.text('Thank you for trusting us', 105, 265, { align: 'center' });

  doc.save('invoice.pdf');
}
