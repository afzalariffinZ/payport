"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageCircle, 
  X, 
  Send, 
  Upload, 
  Bot, 
  User, 
  FileText,
  Loader2,
  ArrowRight
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useDocumentData, DocumentData, getPageFromDataType, getDisplayNameFromPage } from "@/lib/document-data-store";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'data-change' | 'document-analysis' | 'smart-navigation-offer';
  proposedChanges?: Record<string, any>;
  navigationData?: {
    dataType: string;
    targetPage: string;
    extractedData: Record<string, any>;
  };
}



export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
       content: "Hi! I'm your AI assistant. I can help you update your merchant profile data. You can ask me to change specific information or upload documents and images for me to analyze and suggest updates.",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { setStagedData, setPendingNavigation } = useDocumentData();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Function to detect if user input is a question vs a data change request
  const detectIfQuestion = (message: string): boolean => {
    const lowerMessage = message.toLowerCase().trim();
    
    // Question patterns
    const questionPatterns = [
      /^how\s+(do|can|to|should)/,
      /^what\s+(is|are|does|can|should)/,
      /^where\s+(is|are|can|do)/,
      /^when\s+(is|should|can|do)/,
      /^why\s+(is|are|do|should)/,
      /^who\s+(is|are|can|should)/,
      /^which\s+(is|are|can|should)/,
      /^can\s+i/,
      /^could\s+i/,
      /^should\s+i/,
      /^do\s+i\s+need/,
      /^is\s+it\s+possible/,
      /^is\s+there/,
      /\?$/  // Ends with question mark
    ];
    
    // Data change request patterns (these should NOT be treated as questions)
    const dataChangePatterns = [
      /^(update|change|set|modify|edit)\s+my/,
      /^i\s+want\s+to\s+(update|change|set|modify|edit)/,
      /^please\s+(update|change|set|modify|edit)/,
      /^make\s+my/,
      /to\s+["'].*["']/  // Contains quoted values like "update business name to 'new name'"
    ];
    
    // Check if it's a data change request first
    for (const pattern of dataChangePatterns) {
      if (pattern.test(lowerMessage)) {
        return false; // It's a data change request, not a question
      }
    }
    
    // Check if it matches question patterns
    for (const pattern of questionPatterns) {
      if (pattern.test(lowerMessage)) {
        return true; // It's a question
      }
    }
    
    // Default: if it's not clearly a question, treat as potential data change
    return false;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock current user data - in real app, this would come from your state management
  const currentUserData = {
    businessName: "Nasi Lemak Bangsar",
    outletName: "Bangsar Branch",
    ownerName: "Aisyah Binti Ramli",
    ownerEmail: "aisyah@nasilemakbangsar.com",
    ownerPhone: "+60123456789",
    companyEmail: "info@nasilemakbangsar.com",
    companyPhone: "+60387654321",
    outletAddress: "18 Jalan Telawi, Bangsar, 59100 Kuala Lumpur",
    bankName: "Maybank",
    bankAccountNumber: "1234567890123456",
    openingTime: "08:00",
    closingTime: "22:00"
  };

  const callGeminiAPI = async (prompt: string, documentContent?: string) => {
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          documentContent,
          currentData: currentUserData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // First, determine if this is a question/query or a data change request
      const isQuestion = detectIfQuestion(inputMessage);
      
      if (isQuestion) {
        // Handle as a normal question - no smart navigation
        const normalResponse = await callGeminiAPI(`User asks: "${inputMessage}". Provide helpful information about merchant profile management, SSM registration, business setup, etc. Be informative and helpful.`);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: normalResponse,
          sender: 'ai',
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // This might be a data change request - use smart analysis
        const response = await fetch('/api/gemini', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: `User wants to: "${inputMessage}". Determine what data they want to change and which page category it belongs to.`,
            documentContent: `User request: ${inputMessage}. Extract the field changes they want to make from this request.`,
            currentData: currentUserData,
            analysisType: 'document-smart-analysis'
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get AI response');
        }

        const data = await response.json();
        
        if (data.isValidJson && data.parsed) {
          const { dataType, extractedData } = data.parsed;
          
          if (dataType === 'Unknown' || Object.keys(extractedData).length === 0) {
            // No specific data change request - treat as general conversation
            const normalResponse = await callGeminiAPI(`User says: "${inputMessage}". Respond helpfully about merchant profile management.`);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
              content: normalResponse,
          sender: 'ai',
          timestamp: new Date(),
          type: 'text'
        };
            setMessages(prev => [...prev, aiMessage]);
          } else {
            // Smart navigation offer for text-based changes
            const targetPage = getPageFromDataType(dataType);
            const displayName = getDisplayNameFromPage(targetPage);
            
            const aiMessage: Message = {
              id: (Date.now() + 1).toString(),
              content: `I understand you want to update your ${dataType.toLowerCase()}. Would you like me to take you to the ${displayName} page to make these changes?`,
              sender: 'ai',
              timestamp: new Date(),
              type: 'smart-navigation-offer',
              navigationData: {
                dataType,
                targetPage,
                extractedData
              }
        };

        setMessages(prev => [...prev, aiMessage]);
          }
        } else {
          // Fallback to normal conversation
          const normalResponse = await callGeminiAPI(`User says: "${inputMessage}". Respond helpfully about merchant profile management.`);
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: normalResponse,
            sender: 'ai',
            timestamp: new Date(),
            type: 'text'
          };
          setMessages(prev => [...prev, aiMessage]);
        }
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble processing your request right now. Please try again.",
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      content: `Uploaded document: ${file.name}`,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const fileContent = await readFileContent(file);
      
      // Use the enhanced Gemini API with smart analysis
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: "Analyze this document for merchant profile information",
          documentContent: fileContent,
          currentData: currentUserData,
          analysisType: 'document-smart-analysis'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      if (data.isValidJson && data.parsed) {
        const { dataType, extractedData } = data.parsed;
        
        if (dataType === 'Unknown' || Object.keys(extractedData).length === 0) {
          // No relevant data found
                     const aiMessage: Message = {
             id: (Date.now() + 1).toString(),
             content: "I analyzed your file but couldn't find clear business information to update. Try uploading business registration documents, SSM certificates, business cards, or images with visible business details.",
             sender: 'ai',
             timestamp: new Date(),
             type: 'text'
           };
          setMessages(prev => [...prev, aiMessage]);
        } else {
          // Smart navigation offer with user-friendly message
          const targetPage = getPageFromDataType(dataType);
          const displayName = getDisplayNameFromPage(targetPage);
          
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
            content: `I've analyzed your document and found ${dataType}. Would you like me to take you to the ${displayName} page to review and apply these updates?`,
          sender: 'ai',
          timestamp: new Date(),
            type: 'smart-navigation-offer',
            navigationData: {
              dataType,
              targetPage,
              extractedData
            }
        };

        setMessages(prev => [...prev, aiMessage]);
        }
      } else {
        // Handle case where AI response isn't valid JSON
        console.warn('AI did not return valid JSON:', data);
        
                 // Try to parse the raw response as a fallback
         let fallbackMessage = "I had trouble analyzing your file. Please make sure it contains clear business information and try again.";
         
         if (data.response) {
           try {
             // Check if the response looks like JSON
             if (data.response.includes('"dataType"') && data.response.includes('"extractedData"')) {
               fallbackMessage = "I found some information in your file, but had trouble processing it properly. Please try uploading again.";
             }
           } catch (e) {
             // Ignore parsing errors
           }
         }
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.error || fallbackMessage,
          sender: 'ai',
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
         content: "I had trouble reading your file. Please make sure it's a supported format (PDF, DOC, TXT, JPG, PNG) and try again.",
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
       
      reader.onload = (event) => {
         const result = event.target?.result as string;
         
         // For images and PDFs, we need base64 data for AI processing
         if (file.type.startsWith('image/') || file.type === 'application/pdf') {
           // Extract base64 data and create structured content for AI
           const base64Data = result.split(',')[1];
           const fileType = file.type;
           const fileName = file.name;
           
           const aiContent = `File: ${fileName} (${fileType})
Base64 Data: ${base64Data}

Please analyze this ${file.type.startsWith('image/') ? 'image' : 'document'} and extract any business information such as:
- Business name and details
- Registration numbers (SSM)
- Addresses and contact information
- Owner information
- Any other relevant business data

SPECIAL INSTRUCTIONS FOR SSM DOCUMENTS:
If this is an SSM (Suruhanjaya Syarikat Malaysia) certificate, please map:
- "Name of the business" → businessName
- "Registration No" → ssmNumber  
- "Principal place of business" → outletAddress
- "Business ownership" → outletName

Focus on extracting accurate information that can be used to update a merchant profile.`;
           
           resolve(aiContent);
         } else {
           // For text files, return the text content directly
           resolve(result);
         }
       };
       
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
       
       // Read as data URL for images/PDFs, as text for text files
       if (file.type.startsWith('image/') || file.type === 'application/pdf') {
         reader.readAsDataURL(file);
       } else {
      reader.readAsText(file);
       }
    });
  };



  // Smart navigation handlers
  const handleSmartNavigation = (navigationData: Message['navigationData']) => {
    if (!navigationData) return;

    const { dataType, targetPage, extractedData } = navigationData;
    
    // Create changes object by comparing extracted data with current data
    const changes: Record<string, any> = {};
    Object.entries(extractedData).forEach(([key, newValue]) => {
      const oldValue = (currentUserData as any)[key] || '';
      if (newValue && newValue !== oldValue) {
        changes[key] = {
          old: oldValue,
          new: newValue,
          field: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
        };
      }
    });

    // Stage the data for the target page
    const documentData: DocumentData = {
      dataType,
      extractedData,
      changes,
      confidence: 0.95,
      timestamp: new Date()
    };

    setStagedData(documentData);
    setPendingNavigation(targetPage, `Data extracted from document ready for review`);

    // Add confirmation message
    const confirmMessage: Message = {
      id: Date.now().toString(),
      content: `Taking you to the ${getDisplayNameFromPage(targetPage)} page to review the changes...`,
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, confirmMessage]);

    // Navigation happens automatically through the useEffect in MerchantDashboard
    // The target page will detect staged data and show the review modal
    console.log('Navigation triggered to:', targetPage, 'with staged data:', documentData);
    
    // Close the chatbot after a short delay
    setTimeout(() => {
      setIsOpen(false);
    }, 2000);
  };

  const handleDismissNavigation = () => {
    const dismissMessage: Message = {
      id: Date.now().toString(),
      content: "Okay, I've dismissed the extracted data. Is there anything else I can help you with?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, dismissMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#ff0080] hover:bg-[#e00074] rounded-full shadow-lg flex items-center justify-center transition-all duration-200 z-50 hover:scale-110"
          aria-label="Open AI Assistant"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] z-50 resize min-w-[350px] min-h-[400px] max-w-[600px] max-h-[800px]">
          <div className="relative w-full h-full bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#ff0080] text-white rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#e00074] rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-xs text-blue-100">Here to help with your data</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-[#d1006d] rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-[#ff0080] text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'ai' && (
                      <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
                    )}
                    {message.sender === 'user' && (
                      <User className="w-4 h-4 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm">{message.content}</p>
                      


                      {/* Smart Navigation Offer */}
                      {message.type === 'smart-navigation-offer' && message.navigationData && (
                        <div className="mt-4">
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                            <div className="text-center mb-4">
                              <div className="w-12 h-12 bg-[#ff0080] rounded-full flex items-center justify-center mx-auto mb-3">
                                <ArrowRight className="w-6 h-6 text-white" />
                              </div>
                              <h4 className="font-semibold text-gray-900 mb-2">Ready to update your information?</h4>
                              <p className="text-sm text-gray-600">
                                I found {Object.keys(message.navigationData.extractedData).length} field{Object.keys(message.navigationData.extractedData).length !== 1 ? 's' : ''} to update
                              </p>
                            </div>
                            
                            <div className="flex flex-col space-y-3">
                              <Button
                                onClick={() => handleSmartNavigation(message.navigationData)}
                                className="w-full bg-[#ff0080] hover:bg-[#e00074] text-white text-base py-4 px-6 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                                size="lg"
                              >
                                <ArrowRight className="w-5 h-5 mr-2" />
                                Take me there
                              </Button>
                              <Button
                                onClick={handleDismissNavigation}
                                variant="outline"
                                size="lg"
                                className="w-full text-base py-4 px-6 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-all duration-200"
                              >
                                Maybe later
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4" />
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>



          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <div className="flex-1">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me to update your data or upload a document..."
                  className="min-h-[60px] resize-none"
                  disabled={isLoading}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  size="sm"
                  className="bg-[#ff0080] hover:bg-[#e00074] px-3"
                >
                  <Send className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                  className="px-3"
                >
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
               accept=".txt,.pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="hidden"
            />
            
            <p className="text-xs text-gray-500 mt-2">
               Upload documents or images (TXT, PDF, DOC, JPG, PNG) or ask me to change specific data
            </p>
          </div>
          
          {/* Resize Handle */}
          <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize">
            <div className="absolute bottom-1 right-1 w-3 h-3">
              <div className="absolute bottom-0 right-0 w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="absolute bottom-0 right-1.5 w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="absolute bottom-1.5 right-0 w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
          </div>
          </div>
        </div>
      )}
    </>
  );
} 