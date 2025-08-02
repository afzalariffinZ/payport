// 1. Add this at the top to enable client-side hooks
"use client";

// 2. Import React hooks, Next.js router, and your custom hook
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DocumentDataProvider, useDocumentData } from "@/lib/document-data-store";

// 3. Import everything else you need
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AIChatbot from "@/components/ai-chatbot";
import Notifications from "@/components/notifications";
import { LanguageProvider } from "@/lib/language-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 4. Create a new Client Component to handle the logic
function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  // Get the navigation state and the setter function from your context
  const { pendingNavigation, setPendingNavigation } = useDocumentData();

  useEffect(() => {
    // Check if a navigation request is pending
    if (pendingNavigation && pendingNavigation.targetPage) {
      console.log(`Navigation detected in Layout. Routing to: ${pendingNavigation.targetPage}`);
      
      // Use the router to navigate to the target page
      router.push(pendingNavigation.targetPage);
      
      // IMPORTANT: Clear the pending navigation state to prevent re-triggering.
      // We do this by setting the target back to null.
      setPendingNavigation(null, null);
    }
    // Add dependencies to the useEffect hook
  }, [pendingNavigation, router, setPendingNavigation]);

  // This component renders the page content and the chatbot
  return (
    <>
      {/* Fixed Notifications Icon */}
      <div className="fixed top-4 right-4 z-50">
        <Notifications />
      </div>
      {children}
      <AIChatbot />
    </>
  );
}


// 5. Your main RootLayout remains a simple component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Merchant Profile Dashboard</title>
        <meta name="description" content="Manage your merchant profile with ease" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        {/* The Provider wraps the new ClientLayout */}
        <LanguageProvider>
          <DocumentDataProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </DocumentDataProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}