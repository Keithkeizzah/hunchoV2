import qrcode from 'qrcode';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import config from '../../config.cjs';

const toqr = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const prefix = config.PREFIX;
const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
const text = m.body.slice(prefix.length + cmd.length).trim();

    const validCommands = ['toqr'];

    if (!validCommands.includes(cmd)) return;

    if (!text) {
      return m.reply('Please include link or text!');
    }

    let qyuer = await qrcode.toDataURL(text, { scale: 8 });
    let data = Buffer.from(qyuer.replace('data:image/png;base64,', ''), 'base64');

    // Create a PDF document
    const pdfPath = path.join('./', `${Date.now()}.pdf`);
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    // Draw the QR code on the PDF
    doc.image(data, {
      fit: [500, 500],
      align: 'center',
      valign: 'center',
    });

    doc.end();

    writeStream.on('finish', async () => {
      const medi = fs.readFileSync(pdfPath);

      await gss.sendMessage(m.from, {
        document: medi,
        mimetype: 'application/pdf',
        fileName: 'QRCode.pdf',
      }, {
        quoted: m
      });

      fs.unlinkSync(pdfPath);
    });
  } catch (error) {
    console.error('Error:', error);
    m.reply('An error occurred while generating the QR code.');
  }
};

export default toqr;
