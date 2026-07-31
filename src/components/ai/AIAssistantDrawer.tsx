import React, { useState, useEffect } from 'react';
import { X, Sparkles, Send, Bot, User as UserIcon, RefreshCw, Award } from 'lucide-react';
import { User, getUserFullName } from '../../types';
import { api } from '../../services/api';

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
  const [messages, setMessages] = useState<any[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am Bunna Bank AI EPMS Assistant. Ask me about KPI targets, district performance rankings, report drafting, or request a natural language performance summary for any employee!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastSummarizedId, setLastSummarizedId] = useState<string | null>(null);

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
    
    // Add user prompt to message list
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
        { id: String(Date.now() + 1), sender: 'ai', text: aiReply, employeeContext: empName }
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

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: String(Date.now()), sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const data = await api.askAiAssistant(
        userText,
        userRole,
        targetEmployee?.id,
        targetEmployee ? { employeeId: targetEmployee.id, employeeName: getUserFullName(targetEmployee) } : undefined
      );
      const replyText = data.response || data.reply || data.answer || data.text || 'Bunna AI evaluation complete.';
      setMessages(prev => [
        ...prev,
        { id: String(Date.now() + 1), sender: 'ai', text: replyText }
      ]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        { id: String(Date.now() + 1), sender: 'ai', text: 'Error connecting to Gemini AI Assistant.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-[#08321E] border-l border-[#D4AF37]/40 text-white h-full shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#0B4228]">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-[#D4AF37] text-[#0B4228] font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Gemini EPMS Assistant</h3>
              <p className="text-[10px] text-[#D4AF37]">RAG Context Powered AI Performance Coach</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Employee Banner if inspecting specific profile */}
        {targetEmployee && (
          <div className="p-3 bg-gradient-to-r from-[#051F13] to-[#0B4228] border-b border-[#D4AF37]/30 flex items-center justify-between">
            <div className="flex items-center space-x-2 overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-[#D4AF37] text-[#0B4228] flex items-center justify-center font-black text-xs shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">
                  Profile Context: <span className="text-[#D4AF37]">{getUserFullName(targetEmployee)}</span>
                </p>
                <p className="text-[10px] text-gray-300 truncate">
                  {targetEmployee.jobTitle || 'Banking Staff'} • {targetEmployee.branchName}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1 shrink-0">
              <button
                onClick={() => fetchEmployeeSummary(targetEmployee)}
                disabled={loading}
                title="Refresh Natural Language Performance Summary"
                className="p-1.5 rounded-lg bg-white/10 hover:bg-[#D4AF37] hover:text-[#0B4228] text-xs font-semibold flex items-center space-x-1 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              {onClearTargetEmployee && (
                <button
                  onClick={onClearTargetEmployee}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/20 text-gray-400 hover:text-white"
                  title="Clear Employee Context"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Quick Sample Prompts */}
        <div className="p-3 bg-[#051F13] border-b border-white/10 flex items-center space-x-2 overflow-x-auto text-[11px]">
          {targetEmployee ? (
            <button
              onClick={() => fetchEmployeeSummary(targetEmployee)}
              className="px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B4228] border border-[#D4AF37]/40 shrink-0 transition-colors font-bold flex items-center space-x-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Summarize {getUserFullName(targetEmployee).split(' ')[0]}'s Performance</span>
            </button>
          ) : (
            <button
              onClick={() => setInput("Summarize my branch performance for July 2026.")}
              className="px-3 py-1 rounded-full bg-white/5 hover:bg-[#D4AF37] hover:text-[#0B4228] border border-white/10 shrink-0 transition-colors font-medium"
            >
              Branch Summary
            </button>
          )}
          <button
            onClick={() => setInput("What are the key KPIs for Bunna Mobile activations?")}
            className="px-3 py-1 rounded-full bg-white/5 hover:bg-[#D4AF37] hover:text-[#0B4228] border border-white/10 shrink-0 transition-colors font-medium"
          >
            KPI Targets
          </button>
          <button
            onClick={() => setInput("What are the policy rules for Sunday report submission?")}
            className="px-3 py-1 rounded-full bg-white/5 hover:bg-[#D4AF37] hover:text-[#0B4228] border border-white/10 shrink-0 transition-colors font-medium"
          >
            Policy Rules
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(m => (
            <div
              key={m.id}
              className={`flex items-start space-x-2.5 ${m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div className={`p-2 rounded-xl text-xs shrink-0 ${
                m.sender === 'user' ? 'bg-[#D4AF37] text-[#0B4228]' : 'bg-[#0B4228] text-[#D4AF37]'
              }`}>
                {m.sender === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                m.sender === 'user'
                  ? 'bg-[#D4AF37] text-[#0B4228] font-bold'
                  : 'bg-white/5 border border-white/10 text-gray-200'
              }`}>
                {m.text.split('\n').map((line: string, i: number) => {
                  if (line.startsWith('### ')) {
                    return <h4 key={i} className="font-bold text-[#D4AF37] mt-2 mb-1 text-xs">{line.replace('### ', '')}</h4>;
                  }
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <p key={i} className="font-bold text-white mt-1">{line.replace(/\*\*/g, '')}</p>;
                  }
                  return (
                    <p key={i} className={line.trim() === '' ? 'h-2' : ''}>
                      {line.split('**').map((part: string, idx: number) => 
                        idx % 2 === 1 ? <strong key={idx} className="text-white font-semibold">{part}</strong> : part
                      )}
                    </p>
                  );
                })}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-[#D4AF37] p-3 bg-white/5 rounded-xl border border-white/10">
              <Sparkles className="w-4 h-4 animate-spin text-[#D4AF37]" />
              <span>Analyzing performance metrics & generating natural language AI evaluation...</span>
            </div>
          )}
        </div>

        {/* Input Controls */}
        <div className="p-4 border-t border-white/10 bg-[#0B4228] flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={targetEmployee ? `Ask about ${getUserFullName(targetEmployee)}'s performance...` : "Ask AI Assistant anything..."}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="p-2.5 rounded-xl bg-[#D4AF37] text-[#0B4228] font-bold hover:bg-[#e0be4d] transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

