import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types/well';
import { Send, Bot, User } from 'lucide-react';

interface AIChatPanelProps {
  wellName: string;
}

export function AIChatPanel({ wellName }: AIChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm your AI assistant for **${wellName}**. Ask me anything about the well data — lithology, curve interpretations, anomalies, or drilling recommendations.`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    await new Promise((r) => setTimeout(r, 1500));
    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `Based on the ${wellName} data, here's my analysis regarding your question about "${input}":\n\nThe well-log data suggests normal formation characteristics in the selected depth interval. The Gamma Ray readings indicate alternating sand-shale sequences, while the resistivity logs show moderate values consistent with water-bearing formations in the upper sections.\n\nWould you like me to elaborate on any specific aspect?`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] rounded-xl border border-border gradient-card overflow-hidden sticky top-20">
      {/* Header */}
      <div className="border-b border-border px-4 py-3 flex items-center gap-2">
        <Bot className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">AI Chat</span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="h-6 w-6 rounded-md gradient-accent flex items-center justify-center shrink-0 mt-1">
                <Bot className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="h-6 w-6 rounded-md bg-secondary flex items-center justify-center shrink-0 mt-1">
                <User className="h-3.5 w-3.5 text-secondary-foreground" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2">
            <div className="h-6 w-6 rounded-md gradient-accent flex items-center justify-center shrink-0">
              <Bot className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <div className="rounded-lg bg-secondary px-3 py-2">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse" />
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:150ms]" />
                <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about well data..."
            className="flex-1 h-9 rounded-lg border border-border bg-secondary/50 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="h-9 w-9 rounded-lg gradient-accent flex items-center justify-center text-primary-foreground disabled:opacity-40 hover:scale-105 transition-transform"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
