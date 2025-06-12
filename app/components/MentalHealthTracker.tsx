"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from 'lucide-react';
import { MessageContent } from './MessageContent';
import { generateGeminiResponse } from '@/actions/gemini';

interface Message {
  text: string;
  isBot: boolean;
  options?: string[];
  isMarkdown?: boolean;
}

interface MentalHealthChatbotProps {
  user?: unknown;
  data?: unknown;
}

const MentalHealthChatbot: React.FC<MentalHealthChatbotProps> = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      text: "Hi! I'm your mental health companion. You can ask Anything",
      isBot: true,
      options: []
    }
  ]);

  const [emo] = useState("Not Detected");
  const [isThinking, setIsThinking] = useState(false);
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [pred] = useState({ type: "Predicting" });

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const addMessage = (message: Message, delay = 1000) => {
    setIsThinking(true);
    setTimeout(() => {
      setMessages(prev => [...prev, message]);
      setIsThinking(false);
    }, delay);
  };

  const handleSendMessage = async () => {
    if (userInput.trim()) {
      setMessages(prev => [...prev, { text: userInput, isBot: false, options: [] }]);
      const currentInput = userInput;
      setUserInput('');
      await askAi(currentInput);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const askAi = async (prompt: string) => {
    setIsThinking(true);

    try {
      const res = await generateGeminiResponse(prompt, messages, emo, pred);
      setMessages(prev => [...prev, { text: res, isBot: true, isMarkdown: true, options: [] }]);
    } catch (error) {
      console.error('Error calling AI:', error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble connecting right now. Please try again later.", 
        isBot: true,
        options: []
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleOptionClick = (option: string) => {
    setMessages(prev => [...prev, { text: option, isBot: false, options: [] }]);
    
    if (option === "Yes, let's begin") {
      setTimeout(() => {
        addMessage({
          text: "I'll ask you a series of questions to better understand how you're feeling. Please answer honestly - this is a safe space.",
          isBot: true,
          options: []
        });
      }, 500);
    }
  };

  return (
    <div className="max-h-screen g-gradient-to-br from-blue-50 to-blue-50 p-4 relative">
      <Card className="max-w-2xl mx-auto shadow-lg border-none bg-white/90 backdrop-blur">
        <CardHeader className="border-b bg-gradient-to-r from-blue-100 to-blue-100">
          <CardTitle className="flex items-center justify-between space-x-2 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-600">
           Chatbot
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px] p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`rounded-2xl p-4 max-w-[80%] ${
                    msg.isBot 
                      ? 'bg-gradient-to-r from-blue-100 to-blue-100 text-gray-800' 
                      : 'bg-gradient-to-r from-blue-500 to-blue-500 text-white'
                  }`}>
                    <MessageContent message={msg} />
                    {msg.options && msg.options.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {msg.options.map((option, optIdx) => (
                          <Button
                            key={optIdx}
                            onClick={() => handleOptionClick(option)}
                            className="w-full bg-white text-blue-600 hover:bg-blue-50"
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-r from-blue-100 to-blue-100 rounded-2xl p-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce animation-delay-0" />
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce animation-delay-150" />
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce animation-delay-300" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-grow px-4 py-2 rounded-full border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <Button 
                onClick={handleSendMessage}
                className="rounded-full bg-gradient-to-r from-blue-500 to-blue-500 hover:from-blue-600 hover:to-blue-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentalHealthChatbot;