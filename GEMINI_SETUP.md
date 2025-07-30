# Gemini AI Setup Instructions

To enable the AI chatbot functionality, you need to set up your Gemini API key.

## Steps:

1. **Get your Gemini API key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated API key

2. **Configure the environment variable:**
   - Create a `.env.local` file in your project root
   - Add the following line:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```
   - Replace `your_actual_api_key_here` with your actual API key

3. **Restart your development server:**
   ```bash
   npm run dev
   ```

4. **Test the chatbot:**
   - The AI chatbot button should appear in the bottom-left corner
   - Click it and try asking it to update some merchant data
   - You can also upload text documents for analysis

## Features:

- **Data Updates**: Ask the AI to change specific fields in your merchant profile
- **Document Analysis**: Upload documents (TXT, PDF, DOC) for automatic data extraction
- **Change Preview**: Review proposed changes before applying them
- **Multi-page Support**: The chatbot is available on all pages

## Example Prompts:

- "Change my business phone number to +60123456789"
- "Update my opening hours to 9 AM"
- "Change the owner email to newowner@example.com"
- Upload a business registration document for automatic data extraction

## Troubleshooting:

- If you see "Gemini API key not configured", make sure your `.env.local` file is in the project root
- Restart the development server after adding the API key
- Check the browser console for any error messages 