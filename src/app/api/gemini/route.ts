import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize the Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { prompt, documentContent, currentData, analysisType } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Get the generative model - using gemini-2.0-flash-exp or fallback to gemini-1.5-flash
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.1, // Lower temperature for more consistent JSON output
        topK: 32,
        topP: 1,
        maxOutputTokens: 4096,
      },
    });

    let fullPrompt;

    // Enhanced document processing for smart navigation
    if (analysisType === 'document-smart-analysis' && documentContent) {
      // Check if this is an image/PDF document (contains base64 data)
      const isFileUpload = documentContent.includes('Base64 Data:');
      
      if (isFileUpload) {
        fullPrompt = `
You are an AI system specialized in analyzing business documents from images and PDFs. Extract business information from the provided document.

CRITICAL REQUIREMENTS:
1. You MUST respond with ONLY a JSON object - no other text, explanations, or formatting
2. The JSON must have exactly two keys: "dataType" and "extractedData"
3. Do not use markdown code blocks, do not add explanations

${documentContent}

Current merchant data structure for reference:
${JSON.stringify(currentData, null, 2)}

ANALYSIS INSTRUCTIONS:
- Carefully examine the image/PDF for any visible text containing business information
- Look for business registration documents, licenses, certificates, or business cards
- Extract information such as: business name, registration numbers, addresses, owner details, contact information
- Match extracted field names exactly to the current merchant data structure
- Only extract information that is clearly visible and readable



Identify the document category:
- "Business Information" (business registration, SSM documents, licenses, certificates)
- "Personal Information" (ID cards, personal documents)
- "Bank Information" (bank statements, account details)
- "Company Contact" (business cards, contact information)
- "Unknown" (if no clear business information is visible)

Required response format (respond with ONLY this JSON structure):
{
  "dataType": "Business Information",
  "extractedData": {
    "businessName": "extracted business name from document",
    "ssmNumber": "extracted registration number",
    "outletAddress": "extracted business address",
    "ownerName": "extracted owner name",
    "outletName": "extracted business ownership/nature",
    "companyEmail": "extracted email",
    "companyPhone": "extracted phone"
  }
}



If no readable business information is found, respond with:
{
  "dataType": "Unknown",
  "extractedData": {}
}
`;
      } else {
        fullPrompt = `
You are a document analysis system. Analyze the provided text and extract merchant profile information.

CRITICAL REQUIREMENTS:
1. You MUST respond with ONLY a JSON object - no other text, explanations, or formatting
2. The JSON must have exactly two keys: "dataType" and "extractedData"
3. Do not use markdown code blocks, do not add explanations

Document/Request to analyze:
${documentContent}

Current merchant data for reference:
${JSON.stringify(currentData, null, 2)}

If this is a user text request (not a document), extract the field changes they want to make.
For example: "update business name to X" -> extract businessName: "X"

Identify the data category from these options:
- "Business Information" (business name, SSM number, address, outlet info)
- "Personal Information" (owner name, ID, email, phone, personal details)
- "Bank Information" (bank name, account number, account holder)
- "Company Contact" (company email, phone, support contact)
- "Unknown" (if no clear category matches)

Extract data that matches field names in the current merchant data structure.

Required response format (respond with ONLY this JSON structure):
{
  "dataType": "Business Information",
  "extractedData": {
    "businessName": "extracted business name",
    "ssmNumber": "extracted SSM number",
    "outletAddress": "extracted address"
  }
}

If no relevant data found, respond with:
{
  "dataType": "Unknown",
  "extractedData": {}
}
`;
      }
    } else {
      // Regular prompt for other requests
      fullPrompt = `
You are an AI assistant helping merchants manage their profile data. You have access to their current data and can suggest updates.

${prompt}

Current merchant data:
${JSON.stringify(currentData, null, 2)}

${documentContent ? `\nDocument content to analyze:\n${documentContent}` : ''}

Please respond in a helpful and professional manner. If suggesting data changes, use the exact JSON format specified in the instructions.
    `;
    }

    // Generate content (support vision if image upload)
    let result;
    if (analysisType === 'document-smart-analysis' && documentContent && documentContent.includes('Base64 Data:')) {
      // Extract base64 and mimeType
      const base64Match = documentContent.match(/Base64 Data:\s*([A-Za-z0-9+/=]+)/);
      const mimeMatch = documentContent.match(/File: .*\((.*)\)/);
      const base64Data = base64Match ? base64Match[1] : null;
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';

      // Remove the Base64 line from prompt text
      const promptWithoutImage = fullPrompt.replace(/Base64 Data:[\s\S]*?\n/, '').replace(/File: .*\n/, '');

      if (base64Data) {
        result = await model.generateContent([
          { text: promptWithoutImage },
          { inlineData: { data: base64Data, mimeType } }
        ]);
      } else {
        result = await model.generateContent(fullPrompt);
      }
    } else {
      result = await model.generateContent(fullPrompt);
    }

    const response = await result.response;
    const text = response.text();

    // For smart document analysis, try to parse and validate JSON
    if (analysisType === 'document-smart-analysis') {
      try {
        // Clean the response text to extract just the JSON
        let cleanedText = text.trim();
        
        // Remove any markdown formatting if present
        if (cleanedText.startsWith('```json')) {
          cleanedText = cleanedText.replace(/```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanedText.startsWith('```')) {
          cleanedText = cleanedText.replace(/```\s*/, '').replace(/\s*```$/, '');
        }
        
        const parsedResponse = JSON.parse(cleanedText);
        if (parsedResponse.dataType && parsedResponse.extractedData) {
          return NextResponse.json({ 
            response: cleanedText,
            parsed: parsedResponse,
            isValidJson: true 
          });
        } else {
          return NextResponse.json({ 
            response: text,
            isValidJson: false,
            error: 'AI response missing required fields (dataType, extractedData)'
          });
        }
      } catch (parseError) {
        console.warn('Failed to parse AI response as JSON:', parseError);
        console.warn('Raw AI response:', text);
        // Return with indication that parsing failed
        return NextResponse.json({ 
          response: text,
          isValidJson: false,
          error: 'AI did not return valid JSON format'
        });
      }
    }

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to process AI request', details: errorMessage },
      { status: 500 }
    );
  }
} 