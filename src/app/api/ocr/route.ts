// src/app/api/ocr/route.ts

import { NextRequest, NextResponse } from 'next/server';
// Use the standard import. The Webpack config will handle the rest.
import { createWorker } from 'tesseract.js';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Use the simplest createWorker call.
    // Tesseract will download and cache the language data automatically.
    const worker = await createWorker('eng');

    const { data: { text } } = await worker.recognize(buffer);
    await worker.terminate();
    
    // --- Parsing Logic (same as before) ---
    const lines = text.split('\n');
    const extractedData: { [key: string]: string } = {};
    const findValue = (line: string) => line.split(':').slice(1).join(':').trim();

    let addressLines: string[] = [];
    let addressStarted = false;

    lines.forEach(line => {
      const upperLine = line.toUpperCase();
      if (upperLine.includes('NAME') && !extractedData.businessName) {
        extractedData.businessName = findValue(line);
        addressStarted = false;
        return;
      }
      if (upperLine.includes('REGISTRATION NO.') && !extractedData.ssmNumber) {
        extractedData.ssmNumber = findValue(line);
        addressStarted = false;
        return;
      }
      if (upperLine.includes('PRINCIPLE PLACE OF BUSINESS')) {
        addressStarted = true;
        const firstLine = findValue(line);
        if (firstLine) addressLines.push(firstLine);
        return;
      }

      if (addressStarted && !line.includes(':') && line.trim().length > 0) {
        addressLines.push(line.trim());
      } else if (addressStarted) {
        addressStarted = false;
      }
    });
    
    if (addressLines.length > 0) {
      extractedData.outletAddress = addressLines.join(', ');
    }

    return NextResponse.json(extractedData);

  } catch (error) {
    console.error('OCR Error:', error);
    return NextResponse.json({ error: 'Failed to process image with OCR.' }, { status: 500 });
  }
}