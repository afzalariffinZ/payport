# Merchant Profile Dashboard

A responsive merchant profile dashboard built with Next.js, Tailwind CSS, and ShadCN UI. Designed for both desktop and mobile viewing with a clean, professional interface and AI-powered data management.

## Features

- **Professional Header**: Dashboard navigation with user avatar and edit profile button
- **Welcome Section**: Personalized greeting for Aisyah Binti Ramli with subtitle
- **Quick Actions Grid**: 6 beautifully designed action cards with hover effects:
  - Business Information
  - Personal Information
  - Company Contact
  - Bank Information
  - Documents
  - Food Menu
- **Sidebar Tools**: Quick access to QR code generator and profile stats
- **Profile Statistics**: Real-time status indicators and account information
- **QR Code Generator**: Professional QR code modal with download, share, and copy functionality
- **Responsive Design**: Seamlessly adapts from desktop to mobile devices
- **Modern UI**: Clean cards, smooth animations, and professional styling
- **🤖 AI Chatbot**: Intelligent assistant for data management and document analysis

## 🤖 AI Assistant Features

The dashboard includes a powerful AI chatbot powered by Google's Gemini API:

- **Smart Data Updates**: Ask the AI to change specific fields in natural language
- **Document Analysis**: Upload documents (TXT, PDF, DOC) for automatic data extraction
- **Change Preview**: Review all proposed changes before applying them
- **Multi-page Support**: Available on all pages with floating chat button
- **Intelligent Parsing**: Extracts relevant business information from uploaded documents
- **Secure Processing**: All data processing is done securely with user confirmation

### AI Setup Required

To use the AI chatbot, you need to configure your Gemini API key. See [GEMINI_SETUP.md](./GEMINI_SETUP.md) for detailed instructions.

## Design Highlights

- **Desktop-First Layout**: Optimized for website/browser viewing
- **3-Column Grid**: Main content area with sidebar for quick tools
- **Interactive Cards**: Hover effects with color transitions and shadows
- **Professional Header**: Branded navigation with user context
- **Gradient Background**: Subtle visual depth with clean aesthetics
- **Mobile Responsive**: Adapts gracefully to smaller screens

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **ShadCN UI** - Reusable component library
- **Lucide React** - Beautiful icon library
- **Google Gemini AI** - Advanced AI for data management
- **React QR Code** - QR code generation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Gemini API key (for AI features)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd payportreal
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env.local file
echo "GEMINI_API_KEY=your_api_key_here" > .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── gemini/
│   │       └── route.ts        # Gemini AI API endpoint
│   ├── layout.tsx              # Root layout with metadata and viewport
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
├── components/
│   ├── ui/                     # ShadCN UI components
│   ├── ai-chatbot.tsx          # AI chatbot component
│   ├── qr-code-modal.tsx       # QR code modal
│   ├── merchant-dashboard.tsx  # Main dashboard component
│   ├── business-information.tsx # Business form
│   ├── personal-information.tsx # Personal form
│   ├── bank-information.tsx    # Banking form
│   └── company-contact.tsx     # Contact form
└── lib/
    └── utils.ts                # Utility functions
```

## Component Features

### MerchantDashboard Component

- **Responsive Layout**: 3-column grid that adapts to screen size
- **Interactive Elements**: Hover effects and smooth transitions
- **Professional Header**: Branded navigation with user context
- **Quick Stats**: Real-time profile status and account information
- **Accessibility**: Proper ARIA labels and semantic HTML
- **Touch-Friendly**: Optimized for both mouse and touch interactions

### AI Chatbot Component

- **Natural Language Processing**: Understand user requests in plain English
- **Document Upload**: Analyze business documents for data extraction
- **Change Confirmation**: Preview and approve all changes before applying
- **Context Awareness**: Maintains conversation context across interactions
- **Error Handling**: Graceful handling of API errors and edge cases

### Layout Breakdown

1. **Header Bar**: Navigation with logo, title, and edit profile button
2. **Welcome Section**: Full-width greeting section with store branding
3. **Main Content**: 6 action cards in responsive grid
4. **Sidebar**: QR code tools and profile statistics
5. **AI Chatbot**: Floating assistant available on all pages

### Styling Guidelines

- **Card Design**: White backgrounds with rounded corners and subtle shadows
- **Color Scheme**: Pink accent color (#ec4899) with gray tones
- **Typography**: Modern Geist font family with proper hierarchy
- **Spacing**: Consistent padding and margins using Tailwind's spacing scale
- **Interactive States**: Smooth hover effects and color transitions
- **Responsive Grid**: Adapts from 3 columns (desktop) to 1 column (mobile)

## Responsive Breakpoints

- **Desktop (lg+)**: 3-column layout with sidebar
- **Tablet (sm-lg)**: 2-column grid layout
- **Mobile (sm)**: Single column stack layout

## AI Chatbot Usage

### Example Prompts

- "Change my business phone number to +60123456789"
- "Update my opening hours to 9 AM"
- "Change the owner email to newowner@example.com"
- "Update the bank account number"

### Document Upload

- Upload business registration documents
- Bank statements for account information
- Official business documents
- Supported formats: TXT, PDF, DOC, DOCX

## Customization

### Changing the User Information

Update the welcome section in `src/components/merchant-dashboard.tsx`:

```tsx
<h2 className="text-3xl font-bold text-gray-900 mb-3">
  Hi, [Your Name Here]
</h2>
```

### Adding New Menu Items

Add new items to the `menuItems` array:

```tsx
{
  icon: YourIcon,
  label: "Your Menu Item",
  onClick: () => handleMenuItemClick("Your Menu Item"),
}
```

### Customizing the Header

Modify the header section to change branding:

```tsx
<h1 className="text-xl font-bold text-gray-900">Your Dashboard Name</h1>
<p className="text-sm text-gray-600">Your Company Name</p>
```

### AI Chatbot Customization

Update the merchant data in `src/components/ai-chatbot.tsx` to match your business:

```tsx
const currentUserData = {
  businessName: "Your Business Name",
  // ... other fields
};
```

### Theme Customization

The pink theme can be customized by updating:
- Header accent: `bg-pink-500` classes
- Button colors: `bg-pink-500 hover:bg-pink-600`
- Hover states: `hover:bg-pink-50`, `hover:text-pink-600`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API Endpoints

- `POST /api/gemini` - Gemini AI processing endpoint
  - Handles natural language requests
  - Processes document uploads
  - Returns structured data changes

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
