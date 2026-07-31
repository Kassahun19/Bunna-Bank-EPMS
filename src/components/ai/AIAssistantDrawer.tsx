import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  Send,
  Bot,
  User as UserIcon,
  RefreshCw,
  Award,
  Trash2,
  Copy,
  Check,
  Mic,
  MicOff,
  Volume2,
  Download,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  TrendingUp,
  Target,
  FileText,
  HelpCircle,
  Trophy,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, getUserFullName } from '../../types';
import { api } from '../../services/api';
import { BunnaBankLogo } from '../common/BunnaBankLogo';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
  targetEmployee?: User | null;
  onClearTargetEmployee?: () => void;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  userRole = 'EMPLOYEE',
  targetEmployee = null,
  onClearTargetEmployee
}) => {
  const initialGreeting = {
    id: 'welcome-1',
    sender: 'ai',
    text: `**Welcome to Bunna Bank AI Assistant!** 🏦
*Online • EPMS Intelligent Performance Coach*

Ask me anything about:
• **KPI Targets & Achievements:** Deposits, FCY, Bunna Mobile, Accounts, Merchants & Cards
• **Branch Performance & July Summaries:** Real-time metrics & district rankings
• **Reporting Guidelines & Approvals:** Daily logging cutoffs & manager approval workflows
• **Custom Queries:** Type any specific question in English or አማርኛ!`
  };

  const [messages, setMessages] = useState<any[]>([initialGreeting]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackMap, setFeedbackMap] = useState<Record<string, 'up' | 'down'>>({});
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [lastSummarizedId, setLastSummarizedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const autoScroll = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      autoScroll();
    }
  }, [isOpen, messages, loading]);

  useEffect(() => {
    if (isOpen && targetEmployee && targetEmployee.id !== lastSummarizedId) {
      fetchEmployeeSummary(targetEmployee);
    }
  }, [isOpen, targetEmployee]);

  const fetchEmployeeSummary = async (employee: User) => {
    const empName = getUserFullName(employee);
    setLoading(true);
    setLastSummarizedId(employee.id);

    const userPrompt = `Provide a natural language performance summary for employee ${empName} (${employee.jobTitle || 'Banking Staff'}).`;
    
    setMessages(prev => [
      ...prev,
      {
        id: String(Date.now()),
        sender: 'user',
        text: `🔍 Requesting AI Performance Evaluation for ${empName} (${employee.jobTitle || 'Staff'}).`
      }
    ]);

    try {
      const data = await api.askAiAssistant(
        userPrompt,
        userRole,
        employee.id,
        {
          employeeId: employee.id,
          employeeName: empName,
          jobTitle: employee.jobTitle,
          branchName: employee.branchName
        }
      );

      const aiReply = data.response || data.reply || data.answer || data.text || 'Summary generated successfully.';

      setMessages(prev => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'ai',
          text: aiReply,
          employeeContext: empName,
          followUps: ['Show Bunna Mobile target', 'Compare to district average', 'How to log daily report?']
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { id: String(Date.now() + 1), sender: 'ai', text: `Failed to analyze performance data for ${empName}.` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    setInput('');
    const userMsgId = String(Date.now());
    setMessages(prev => [...prev, { id: userMsgId, sender: 'user', text: textToSend.trim() }]);
    setLoading(true);

    try {
      const data = await api.askAiAssistant(
        textToSend,
        userRole,
        targetEmployee?.id,
        targetEmployee ? { employeeId: targetEmployee.id, employeeName: getUserFullName(targetEmployee) } : undefined
      );
      const replyText = data.response || data.reply || data.answer || data.text || 'Bunna Bank AI evaluation complete.';
      
      setMessages(prev => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'ai',
          text: replyText,
          followUps: ['Show FY 2025/26 targets', 'How to submit daily report?', 'What are top district rankings?']
        }
      ]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        { id: String(Date.now() + 1), sender: 'ai', text: 'Error connecting to Bunna Bank AI Assistant.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([initialGreeting]);
    setShowClearConfirm(false);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = (id: string, type: 'up' | 'down') => {
    setFeedbackMap(prev => ({ ...prev, [id]: type }));
  };

  const toggleVoiceMode = () => {
    if (!isListening) {
      setIsListening(true);
      // Simulate voice dictation greeting after 2.5s
      setTimeout(() => {
        setInput("Summarize my branch performance for July 2026.");
        setIsListening(false);
      }, 2500);
    } else {
      setIsListening(false);
    }
  };

  const exportChatHistory = () => {
    const content = messages.map(m => `[${m.sender.toUpperCase()}]: ${m.text}`).join('\n\n---\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bunna_Bank_AI_Chat_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  // Categories of recommended auto-typing prompts
  const recommendationPrompts = [
    { label: '📊 July Branch Summary', prompt: 'Summarize my branch performance for July 2026.' },
    { label: '🎯 FY 2025/26 Targets', prompt: 'What are the key KPI targets for Bunna Bank FY 2025/26?' },
    { label: '📝 How to Submit Report', prompt: 'How do I submit my daily performance report?' },
    { label: '🏆 Top Districts', prompt: 'Which districts are leading the leaderboard rankings?' },
    { label: '💵 Foreign Currency (FCY)', prompt: 'What is the Foreign Currency Inflow target and achievement?' },
    { label: '📱 Bunna Mobile KPI', prompt: 'What is the Bunna Mobile banking activation target?' },
    { label: '🌍 አማርኛ መመሪያ', prompt: 'ስለ Bunna Bank EPMS በኢትዮጵያ አማርኛ ገለጻ ስጠኝ።' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-md flex justify-end">
      
      {/* Hanging Glass Container */}
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="w-full max-w-lg bg-gradient-to-b from-[#0B4228] via-[#08321E] to-[#051F13] border-l-2 border-[#D4AF37]/60 text-white h-full shadow-[0_0_50px_rgba(212,175,55,0.25)] flex flex-col relative overflow-hidden"
      >
        {/* Top Hanging Mount Cables (Visual Accent) */}
        <div className="absolute top-0 left-10 w-0.5 h-6 bg-[#D4AF37]/40 z-20 pointer-events-none" />
        <div className="absolute top-0 right-16 w-0.5 h-6 bg-[#D4AF37]/40 z-20 pointer-events-none" />

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#D4AF37]/30 flex items-center justify-between bg-[#0B4228]/95 backdrop-blur-xl relative z-10 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#D4AF37] via-[#B38F24] to-[#0B4228] p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-[#0B4228] rounded-[14px] p-1.5 flex items-center justify-center">
                  <BunnaBankLogo className="w-7 h-7" variant="gold" />
                </div>
              </div>
              {/* Online Green Pulsing Indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0B4228] animate-pulse shadow-[0_0_10px_#34d399]" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base text-white tracking-wide">Bunna Bank AI Assistant</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[10px] font-black uppercase tracking-wider flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Online</span>
                </span>
              </div>
              <p className="text-[11px] text-[#D4AF37] font-semibold mt-0.5">EPMS RAG Performance Coach & Advisor</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* Export History */}
            <button
              onClick={exportChatHistory}
              title="Export Conversation History"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-[#D4AF37] transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Clear History */}
            <button
              onClick={() => setShowClearConfirm(true)}
              title="Clear Conversation History"
              className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-300 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Close Drawer */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Confirm Clear Modal Overlay */}
        {showClearConfirm && (
          <div className="p-3 bg-red-900/90 border-b border-red-500/50 text-white flex items-center justify-between text-xs animate-fadeIn z-20">
            <span className="font-bold">Clear all conversation history?</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleClearHistory}
                className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 font-bold text-white shadow-sm"
              >
                Yes, Clear
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Active Employee Context Banner */}
        {targetEmployee && (
          <div className="p-3 bg-gradient-to-r from-[#051F13] via-[#0B4228] to-[#051F13] border-b border-[#D4AF37]/40 flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-[#D4AF37] text-[#0B4228] flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                <Award className="w-4 h-4" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">
                  Target Profile: <span className="text-[#D4AF37]">{getUserFullName(targetEmployee)}</span>
                </p>
                <p className="text-[10px] text-gray-300 truncate">
                  {targetEmployee.jobTitle || 'Banking Staff'} • {targetEmployee.branchName}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 shrink-0">
              <button
                onClick={() => fetchEmployeeSummary(targetEmployee)}
                disabled={loading}
                title="Refresh AI Performance Evaluation"
                className="px-2.5 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#e0be4d] text-[#0B4228] text-xs font-extrabold flex items-center space-x-1 transition-colors shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Evaluate</span>
              </button>
              {onClearTargetEmployee && (
                <button
                  onClick={onClearTargetEmployee}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
                  title="Clear Target Employee Context"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Auto Typing Recommendation Chips Bar */}
        <div className="p-3 bg-[#051F13]/90 border-b border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>Recommended Quick Questions:</span>
            </span>
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto text-[11px] pb-1 custom-scrollbar">
            {recommendationPrompts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(item.prompt)}
                disabled={loading}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#D4AF37] hover:text-[#0B4228] border border-[#D4AF37]/30 text-gray-200 hover:font-bold shrink-0 transition-all duration-200 shadow-sm flex items-center space-x-1"
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Voice Dictation Active Wave Bar */}
        {isListening && (
          <div className="p-3 bg-gradient-to-r from-emerald-900/90 to-emerald-800/90 border-b border-emerald-400/40 text-emerald-200 text-xs flex items-center justify-between animate-pulse">
            <div className="flex items-center space-x-2">
              <Mic className="w-4 h-4 text-emerald-400 animate-bounce" />
              <span className="font-bold">Bunna Voice Listening... Speak your performance query.</span>
            </div>
            <span className="text-[10px] bg-emerald-400/20 px-2 py-0.5 rounded-full font-mono text-emerald-300">
              [Auto-Detecting]
            </span>
          </div>
        )}

        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          <AnimatePresence initial={false}>
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className={`flex items-start space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  {/* Avatar Icon */}
                  <div
                    className={`w-9 h-9 rounded-2xl text-xs shrink-0 flex items-center justify-center font-bold shadow-md ${
                      isUser
                        ? 'bg-gradient-to-br from-[#D4AF37] to-[#B38F24] text-[#0B4228]'
                        : 'bg-gradient-to-br from-[#0B4228] to-[#051F13] text-[#D4AF37] border border-[#D4AF37]/40'
                    }`}
                  >
                    {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
                  </div>

                  {/* Message Bubble Card */}
                  <div
                    className={`group relative p-4 rounded-3xl text-xs leading-relaxed max-w-[88%] shadow-lg border transition-all ${
                      isUser
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#C59F2A] text-[#0B4228] font-bold border-transparent rounded-tr-sm'
                        : 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border-[#D4AF37]/30 text-gray-100 rounded-tl-sm hover:border-[#D4AF37]/60'
                    }`}
                  >
                    {/* Formatted Content */}
                    <div className="space-y-1.5">
                      {m.text.split('\n').map((line: string, i: number) => {
                        if (line.startsWith('### ')) {
                          return (
                            <h4 key={i} className="font-extrabold text-[#D4AF37] mt-2 mb-1 text-xs tracking-wide">
                              {line.replace('### ', '')}
                            </h4>
                          );
                        }
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return (
                            <p key={i} className="font-black text-white mt-1 text-xs">
                              {line.replace(/\*\*/g, '')}
                            </p>
                          );
                        }
                        return (
                          <p key={i} className={line.trim() === '' ? 'h-1.5' : ''}>
                            {line.split('**').map((part: string, idx: number) =>
                              idx % 2 === 1 ? (
                                <strong key={idx} className={isUser ? 'text-[#0B4228] font-extrabold' : 'text-white font-bold'}>
                                  {part}
                                </strong>
                              ) : (
                                part
                              )
                            )}
                          </p>
                        );
                      })}
                    </div>

                    {/* AI Message Action Footer (Copy & Thumbs Rating) */}
                    {!isUser && (
                      <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-400">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleCopy(m.text, m.id)}
                            className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors"
                          >
                            {copiedId === m.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400 font-bold">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>

                          <div className="flex items-center space-x-1 border-l border-white/10 pl-2">
                            <button
                              onClick={() => handleFeedback(m.id, 'up')}
                              className={`p-1 rounded-md transition-colors ${
                                feedbackMap[m.id] === 'up' ? 'text-emerald-400 bg-emerald-500/20' : 'hover:text-white'
                              }`}
                            >
                              <ThumbsUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleFeedback(m.id, 'down')}
                              className={`p-1 rounded-md transition-colors ${
                                feedbackMap[m.id] === 'down' ? 'text-red-400 bg-red-500/20' : 'hover:text-white'
                              }`}
                            >
                              <ThumbsDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <span className="text-[9px] text-[#D4AF37]/80 font-medium">Bunna Bank AI</span>
                      </div>
                    )}

                    {/* Follow-up Quick Action Suggestions */}
                    {!isUser && m.followUps && (
                      <div className="mt-3 pt-2 space-y-1.5">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Suggested Follow-ups:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {m.followUps.map((fu: string, fidx: number) => (
                            <button
                              key={fidx}
                              onClick={() => handleSend(fu)}
                              className="px-2.5 py-1 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37] hover:text-[#0B4228] border border-[#D4AF37]/30 text-[10px] text-[#D4AF37] font-semibold transition-all flex items-center space-x-1"
                            >
                              <span>{fu}</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Loading Indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-3 text-xs text-[#D4AF37] p-3.5 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl border border-[#D4AF37]/40 backdrop-blur-md shadow-lg"
            >
              <div className="relative">
                <Sparkles className="w-5 h-5 animate-spin text-[#D4AF37]" />
                <span className="absolute inset-0 rounded-full bg-[#D4AF37]/30 animate-ping pointer-events-none" />
              </div>
              <div>
                <p className="font-extrabold text-white">Bunna Bank AI is thinking...</p>
                <p className="text-[10px] text-gray-300 font-medium">Analyzing EPMS database & evaluating performance context</p>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Controls Bar */}
        <div className="p-4 border-t border-[#D4AF37]/30 bg-[#0B4228]/95 backdrop-blur-xl relative z-10 space-y-2">
          
          <div className="flex items-center space-x-2">
            {/* Voice Dictation Button */}
            <button
              onClick={toggleVoiceMode}
              title={isListening ? 'Stop Voice Listening' : 'Use Voice Dictation'}
              className={`p-3 rounded-2xl border transition-all ${
                isListening
                  ? 'bg-red-500 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-[#D4AF37] hover:text-white'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Main Text Input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={
                targetEmployee
                  ? `Ask about ${getUserFullName(targetEmployee)}'s performance...`
                  : 'Ask Bunna Bank AI anything...'
              }
              className="flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all shadow-inner"
            />

            {/* Send Button */}
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="p-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#0B4228] font-black hover:opacity-95 transition-all disabled:opacity-40 shadow-lg flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[9px] text-gray-400 px-1">
            <span>Powered by Bunna Bank S.C. RAG AI Architecture</span>
            <span className="text-[#D4AF37] font-semibold">Press Enter to Send</span>
          </div>
        </div>

      </motion.div>
    </div>
  );
};


