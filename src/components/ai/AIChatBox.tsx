"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, Bot, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { sendCareerGuidanceAction } from "@/lib/actions/aiActions";
import { ChatMessage } from "@/lib/ai/provider.interface";

interface AIChatBoxProps {
  studentName: string;
  targetRole?: string | null;
}

export function AIChatBox({ studentName, targetRole }: AIChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Hello ${studentName}! I am your AI Career Mentor on SkillMatch. I can help you tailor your resume for ${targetRole || "internships"}, prepare for technical interviews, or optimize your skill roadmap. How can I assist your career journey today?`,
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const newMessages: ChatMessage[] = [...messages, { role: "user", content: textToSend }];
    setMessages(newMessages);
    if (!customPrompt) setInput("");
    setIsLoading(true);

    const res = await sendCareerGuidanceAction(newMessages);
    setIsLoading(false);

    if (res.success && res.reply) {
      setMessages([...newMessages, { role: "assistant", content: res.reply }]);
    } else {
      setMessages([
        ...newMessages,
        { role: "assistant", content: res.error || "Sorry, I am unable to process your request at the moment." },
      ]);
    }
  };

  const quickPrompts = [
    "How can I optimize my resume for tech recruiters?",
    "What technical interview questions should I prepare for?",
    "How do I structure my GitHub projects for internships?",
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
      {/* Chat Header */}
      <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-900">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base">SkillMatch AI Career Mentor</h3>
            <p className="text-[11px] text-indigo-300">Grounded in candidate profile & skill context</p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                role: "assistant",
                content: `Chat history reset. How else can I assist your career prep, ${studentName}?`,
              },
            ])
          }
          className="text-slate-400 hover:text-white p-2 rounded-lg transition-colors"
          title="Reset conversation"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                m.role === "user"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-gradient-to-tr from-slate-900 to-indigo-950 text-white shadow-xs"
              }`}
            >
              {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-indigo-300" />}
            </div>

            <div
              className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-indigo-600 text-white font-medium rounded-tr-none shadow-sm"
                  : "bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-xs"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold p-2">
            <Sparkles className="w-4 h-4 animate-spin text-indigo-500" />
            <span>AI Mentor is crafting a response...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">Quick Prompts:</span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp)}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Footer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI Mentor anything about your career path, resume, or interview prep..."
          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <Button type="submit" size="md" isLoading={isLoading} disabled={!input.trim()} className="gap-1 font-semibold">
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </Button>
      </form>
    </div>
  );
}
