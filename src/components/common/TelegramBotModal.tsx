import React, { useState } from 'react';
import { Bot, Send, Key, Check, Copy, ExternalLink, Info, X, MessageSquare } from 'lucide-react';

interface TelegramBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
}

export const TelegramBotModal: React.FC<TelegramBotModalProps> = ({ isOpen, onClose, currentUser }) => {
  const [copiedText, setCopiedText] = useState<'id' | 'password' | 'linkCmd' | null>(null);

  if (!isOpen) return null;

  const botUsername = 'bbepmsbot';
  const botLink = 'https://t.me/bbepmsbot';

  // Construct a quick command that they can copy/paste directly
  const linkCommand = `/link ${currentUser?.userId || 'YOUR_EMPLOYEE_ID'} PASSWORD`;

  const copyToClipboard = (text: string, type: 'id' | 'password' | 'linkCmd') => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" id="telegram-bot-modal">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all w-full max-w-2xl border border-gray-100 flex flex-col">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#6B3F1D] to-[#8C5A3C] p-6 text-white flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <Bot className="h-6 w-6 text-[#C89A2B]" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight">Telegram Bot Integration</h3>
                <p className="text-xs text-amber-100/80">Bunna Bank S.C. EPMS Companion</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="rounded-lg p-1 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 flex-1 overflow-y-auto max-h-[80vh]">
            
            {/* Status Alert */}
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/50 flex items-start space-x-3">
              <Info className="h-5 w-5 text-[#C89A2B] shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-semibold text-gray-800">Connection Status: </span>
                {currentUser?.telegramChatId ? (
                  <span className="inline-flex items-center text-green-700 font-medium">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                    Linked (Telegram Chat ID: {currentUser.telegramChatId})
                  </span>
                ) : (
                  <span className="inline-flex items-center text-amber-700 font-medium">
                    <span className="h-2 w-2 rounded-full bg-amber-400 mr-1.5"></span>
                    Not Linked (Awaiting activation)
                  </span>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Once linked, you will receive performance summaries, district alerts, and can query metrics anytime.
                </p>
              </div>
            </div>

            {/* Steps Section */}
            <div>
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">
                Step-by-Step Account Linking
              </h4>
              <div className="space-y-4">
                
                {/* Step 1 */}
                <div className="flex space-x-4 items-start">
                  <div className="h-8 w-8 rounded-full bg-[#6B3F1D]/10 text-[#6B3F1D] flex items-center justify-center font-bold text-sm shrink-0">
                    1
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">Launch BBEPMS Bot</p>
                    <p className="text-xs text-gray-500">
                      Open Telegram and search for <span className="font-mono font-semibold text-gray-700">@bbepmsbot</span> or click the link button below.
                    </p>
                    <div className="mt-2">
                      <a 
                        href={botLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-3.5 py-1.5 bg-[#C89A2B] hover:bg-[#B08520] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>Open Bot on Telegram</span>
                        <ExternalLink className="h-3 w-3 ml-0.5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex space-x-4 items-start">
                  <div className="h-8 w-8 rounded-full bg-[#6B3F1D]/10 text-[#6B3F1D] flex items-center justify-center font-bold text-sm shrink-0">
                    2
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">Copy credentials or secure code</p>
                    <p className="text-xs text-gray-500">
                      You will need your Employee ID (or login email) and password to authenticate.
                    </p>
                    
                    {currentUser && (
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100 text-xs font-mono text-gray-700">
                          <span className="truncate">ID: {currentUser.userId}</span>
                          <button 
                            onClick={() => copyToClipboard(currentUser.userId, 'id')}
                            className="text-[#6B3F1D] hover:text-[#C89A2B] p-0.5"
                          >
                            {copiedText === 'id' ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100 text-xs font-mono text-gray-700">
                          <span>Password: *******</span>
                          <button 
                            onClick={() => copyToClipboard(currentUser.password || '', 'password')}
                            className="text-[#6B3F1D] hover:text-[#C89A2B] p-0.5"
                          >
                            {copiedText === 'password' ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex space-x-4 items-start">
                  <div className="h-8 w-8 rounded-full bg-[#6B3F1D]/10 text-[#6B3F1D] flex items-center justify-center font-bold text-sm shrink-0">
                    3
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">Send Link Command in chat</p>
                    <p className="text-xs text-gray-500">
                      In the BBEPMS Bot conversation, type and send the link command containing your credentials:
                    </p>
                    <div className="mt-2 max-w-md flex items-center justify-between p-2 bg-gray-900 text-amber-400 rounded-lg text-xs font-mono">
                      <span className="select-all">{linkCommand}</span>
                      <button 
                        onClick={() => copyToClipboard(linkCommand, 'linkCmd')}
                        className="text-amber-100/70 hover:text-amber-300 p-0.5 ml-2 shrink-0"
                      >
                        {copiedText === 'linkCmd' ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Commands Section */}
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">
                Supported Bot Commands
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="p-3 bg-gray-50/50 rounded-xl border border-gray-100 flex items-start space-x-3">
                  <Key className="h-4 w-4 text-[#C89A2B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-xs font-bold text-gray-800">/link &lt;id&gt; &lt;pwd&gt;</span>
                    <p className="text-xs text-gray-500 mt-1">Links your Telegram chat to your profile.</p>
                  </div>
                </div>

                <div className="p-3 bg-gray-50/50 rounded-xl border border-gray-100 flex items-start space-x-3">
                  <MessageSquare className="h-4 w-4 text-[#C89A2B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-xs font-bold text-gray-800">/profile</span>
                    <p className="text-xs text-gray-500 mt-1">Displays role, district, and linked branch details.</p>
                  </div>
                </div>

                <div className="p-3 bg-gray-50/50 rounded-xl border border-gray-100 flex items-start space-x-3">
                  <MessageSquare className="h-4 w-4 text-[#C89A2B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-xs font-bold text-gray-800">/performance</span>
                    <p className="text-xs text-gray-500 mt-1">View consolidated deposit and digital KPI stats.</p>
                  </div>
                </div>

                <div className="p-3 bg-gray-50/50 rounded-xl border border-gray-100 flex items-start space-x-3">
                  <MessageSquare className="h-4 w-4 text-[#C89A2B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-xs font-bold text-gray-800">/leaderboard</span>
                    <p className="text-xs text-gray-500 mt-1">Lists the top-performing districts and leaderboards.</p>
                  </div>
                </div>

                <div className="p-3 bg-gray-50/50 rounded-xl border border-gray-100 flex items-start space-x-3">
                  <MessageSquare className="h-4 w-4 text-[#C89A2B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-xs font-bold text-gray-800">/announcements</span>
                    <p className="text-xs text-gray-500 mt-1">Get the latest 3 bank-wide high priority notices.</p>
                  </div>
                </div>

                <div className="p-3 bg-gray-50/50 rounded-xl border border-gray-100 flex items-start space-x-3">
                  <MessageSquare className="h-4 w-4 text-[#C89A2B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-xs font-bold text-gray-800">/coaching &lt;query&gt;</span>
                    <p className="text-xs text-gray-500 mt-1">Consult BBEPMS AI Coach for professional tips.</p>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-2xl border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow-xs transition-colors"
            >
              Close
            </button>
            <a
              href={botLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium text-white bg-[#6B3F1D] hover:bg-[#523015] rounded-lg shadow-xs transition-colors inline-flex items-center space-x-2"
            >
              <Bot className="h-4 w-4 text-amber-400" />
              <span>Launch Bot</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
