import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Ban,
  Trash2,
  MessageSquare,
  Sparkles,
  Download,
  Users,
  Clock,
  CheckSquare,
  Square,
  ChevronRight,
  Send,
  FileSpreadsheet,
  UserCheck
} from 'lucide-react';
import { User, DailyPerformanceReport, PerformanceTarget, getUserFullName } from '../../types';
import { api } from '../../services/api';
import { AllProductsOverview } from './AllProductsOverview';
import { BranchCampaignWidget } from './BranchCampaignWidget';
import { BranchEmployeeTargetManager } from './BranchEmployeeTargetManager';

interface ManagerDashboardProps {
  user: User;
  reports: DailyPerformanceReport[];
  employees: User[];
  targets: PerformanceTarget[];
  onRefreshData: () => void;
  onOpenAiAssistant: () => void;
  onOpenExportModal: () => void;
  onOpenProfile?: () => void;
  onOpenAiSummary?: (employee: User) => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  user,
  reports,
  employees,
  targets,
  onRefreshData,
  onOpenAiAssistant,
  onOpenExportModal,
  onOpenProfile,
  onOpenAiSummary
}) => {
  const [selectedReportIds, setSelectedReportIds] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('Pending');
  const [commentText, setCommentText] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Direct Message State
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(employees[0]?.id || '');
  const [directMessageInput, setDirectMessageInput] = useState('');
  const [messageHistory, setMessageHistory] = useState<any[]>([
    { id: '1', sender: 'Selamawit Tadesse', text: 'Good morning Abebe! Great deposit mobilization yesterday.', time: '08:30 AM' }
  ]);

  const filteredReports = reports.filter(r => {
    if (activeFilter === 'All') return true;
    return r.status === activeFilter;
  });

  const toggleSelectReport = (id: string) => {
    if (selectedReportIds.includes(id)) {
      setSelectedReportIds(selectedReportIds.filter(i => i !== id));
    } else {
      setSelectedReportIds([...selectedReportIds, id]);
    }
  };

  const selectAllReports = () => {
    if (selectedReportIds.length === filteredReports.length) {
      setSelectedReportIds([]);
    } else {
      setSelectedReportIds(filteredReports.map(r => r.id));
    }
  };

  const handleExecuteAction = async (action: 'approve' | 'reject' | 'return' | 'suspend' | 'delete') => {
    if (selectedReportIds.length === 0) {
      alert("Please select at least one daily performance report.");
      return;
    }

    setActionLoading(true);
    try {
      await api.managerAction(selectedReportIds, action, user.id, commentText);
      setSelectedReportIds([]);
      setCommentText('');
      onRefreshData();
    } catch (err: any) {
      alert(err.message || "Failed to execute manager action.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendDirectMessage = () => {
    if (!directMessageInput.trim()) return;
    setMessageHistory([...messageHistory, {
      id: String(Date.now()),
      sender: getUserFullName(user),
      text: directMessageInput,
      time: 'Just Now'
    }]);
    setDirectMessageInput('');
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0B4228] via-[#08321E] to-[#051F13] border border-[#D4AF37]/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-white">
        <div>
          <span className="bg-[#D4AF37] text-[#0B4228] font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
            Branch Operations Manager
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-1">
            {user.branchName} Manager Portal
          </h2>
          <p className="text-xs text-gray-300 mt-0.5">
            Approve, Return, Reject, and Monitor Daily Performance Reports
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {onOpenProfile && (
            <button
              onClick={onOpenProfile}
              className="px-4 py-2.5 rounded-xl bg-[#08321E] hover:bg-white/10 border border-[#D4AF37]/40 text-xs font-bold flex items-center space-x-2 text-[#D4AF37]"
            >
              <UserCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>My Role Profile</span>
            </button>
          )}

          <button
            onClick={onOpenExportModal}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold flex items-center space-x-2 text-white"
          >
            <Download className="w-4 h-4 text-[#D4AF37]" />
            <span>Export Reports</span>
          </button>

          <button
            onClick={onOpenAiAssistant}
            className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-[#0B4228] font-bold text-xs shadow-lg hover:bg-[#e0be4d] flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-[#0B4228]" />
            <span>AI Manager Assistant</span>
          </button>
        </div>
      </div>

      {/* Branch Daily Campaign Analytics Engine */}
      <BranchCampaignWidget
        branchName={user.branchName || 'Branch Unit'}
        userRole={user.role}
        reports={reports}
        onReportSubmitted={onRefreshData}
      />

      {/* Branch Employee Target & KPI Assignment Feed Engine */}
      <BranchEmployeeTargetManager
        currentUser={user}
        employees={employees}
        targets={targets}
        onTargetsUpdated={onRefreshData}
        onOpenAiSummary={onOpenAiSummary}
      />

      {/* Product Achievements & Reports Summary */}
      <AllProductsOverview
        reports={reports}
        targets={targets}
        title={`${user.branchName || 'Branch'} Products Achievement Overview`}
        subtitle="Live totals, percentage achievements against targets, remaining targets, and product breakdown"
      />

      {/* Status Filter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {['Pending', 'Approved', 'Returned', 'Rejected', 'All'].map(st => {
          const count = st === 'All' ? reports.length : reports.filter(r => r.status === st).length;
          return (
            <button
              key={st}
              onClick={() => setActiveFilter(st)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                activeFilter === st
                  ? 'bg-[#D4AF37] text-[#0B4228] border-[#D4AF37] shadow-xl font-extrabold'
                  : 'bg-[#08321E] text-white border-white/10 hover:border-[#D4AF37]'
              }`}
            >
              <p className="text-xs opacity-80 uppercase tracking-wider">{st} Reports</p>
              <h3 className="text-xl font-black mt-1">{count}</h3>
            </button>
          );
        })}
      </div>

      {/* Bulk Action Controls Bar */}
      <div className="p-5 rounded-2xl bg-[#08321E] border border-[#D4AF37]/30 shadow-lg text-white flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={selectAllReports}
            className="flex items-center space-x-2 text-xs font-bold text-[#D4AF37] hover:underline"
          >
            {selectedReportIds.length === filteredReports.length && filteredReports.length > 0 ? (
              <CheckSquare className="w-4 h-4" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            <span>Select All ({selectedReportIds.length} Selected)</span>
          </button>
        </div>

        {/* Manager Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            disabled={actionLoading}
            onClick={() => handleExecuteAction('approve')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve Selected</span>
          </button>

          <button
            disabled={actionLoading}
            onClick={() => handleExecuteAction('return')}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Return for Correction</span>
          </button>

          <button
            disabled={actionLoading}
            onClick={() => handleExecuteAction('reject')}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow"
          >
            <XCircle className="w-4 h-4" />
            <span>Reject</span>
          </button>

          <button
            disabled={actionLoading}
            onClick={() => handleExecuteAction('suspend')}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow"
          >
            <Ban className="w-4 h-4" />
            <span>Suspend</span>
          </button>

          <button
            disabled={actionLoading}
            onClick={() => handleExecuteAction('delete')}
            className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold flex items-center space-x-1.5 shadow"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Optional Manager Review Comment Input */}
      {selectedReportIds.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#0B4228] border border-[#D4AF37]/30 text-white">
          <label className="block text-xs font-bold text-[#D4AF37] mb-1">Add Manager Review Comment / Correction Note:</label>
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="e.g. Please verify account opening numbers against physical records before re-submitting."
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      )}

      {/* Reports Table List */}
      <div className="p-6 rounded-3xl bg-[#08321E] border border-[#D4AF37]/30 shadow-xl text-white">
        <h3 className="font-bold text-lg text-white mb-4">
          Daily Performance Submissions Queue ({filteredReports.length})
        </h3>

        {filteredReports.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-xs">
            No reports found matching status filter "{activeFilter}".
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#0B4228] text-[#D4AF37] font-bold uppercase">
                <tr>
                  <th className="p-3 w-10">Select</th>
                  <th className="p-3">Report Date</th>
                  <th className="p-3">Employee</th>
                  <th className="p-3">Deposits (ETB)</th>
                  <th className="p-3">FCY (ETB)</th>
                  <th className="p-3">Digital Services (ETB)</th>
                  <th className="p-3">Accounts</th>
                  <th className="p-3">Mobile Banking</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Submitted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredReports.map(r => (
                  <tr key={r.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedReportIds.includes(r.id)}
                        onChange={() => toggleSelectReport(r.id)}
                        className="rounded border-white/20 bg-white/5 text-[#D4AF37]"
                      />
                    </td>
                    <td className="p-3 font-bold text-[#D4AF37]">{r.reportDate} ({r.dayOfWeek})</td>
                    <td className="p-3 font-semibold text-white">{r.employeeName}</td>
                    <td className="p-3 font-bold text-emerald-400">ETB {r.depositsETB?.toLocaleString()}</td>
                    <td className="p-3 font-semibold">ETB {r.foreignCurrencyETB?.toLocaleString()}</td>
                    <td className="p-3 font-semibold">ETB {r.digitalFinancialServicesETB?.toLocaleString()}</td>
                    <td className="p-3 font-bold">{r.accountOpenings}</td>
                    <td className="p-3 font-bold text-[#D4AF37]">{r.mobileBankingActivations}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        r.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300' :
                        r.status === 'Pending' ? 'bg-amber-500/20 text-amber-300' :
                        r.status === 'Returned' ? 'bg-blue-500/20 text-blue-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-400 text-[11px]">{r.submittedAt || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Direct Messaging with Employees Section */}
      <div className="p-6 rounded-3xl bg-[#08321E] border border-[#D4AF37]/30 shadow-xl text-white">
        <div className="flex items-center space-x-2 mb-4">
          <MessageSquare className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="font-bold text-lg text-white">Manager & Employee Direct Communications</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 space-y-2">
            <label className="block text-xs font-semibold text-gray-300">Select Employee:</label>
            {employees.map(e => (
              <button
                key={e.id}
                onClick={() => setSelectedEmployeeId(e.id)}
                className={`w-full p-3 rounded-xl border text-left flex justify-between items-center text-xs transition-all ${
                  selectedEmployeeId === e.id
                    ? 'bg-[#D4AF37] text-[#0B4228] border-[#D4AF37] font-bold'
                    : 'bg-white/5 text-white border-white/10 hover:border-[#D4AF37]'
                }`}
              >
                <div>
                  <p className="font-bold">{getUserFullName(e)}</p>
                  <p className="text-[10px] opacity-80">{e.jobTitle}</p>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            ))}
          </div>

          <div className="md:col-span-8 bg-[#0B4228] border border-white/10 rounded-2xl p-4 flex flex-col h-72">
            <div className="flex-1 overflow-y-auto space-y-3 p-2">
              {messageHistory.map(m => (
                <div key={m.id} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <div className="flex justify-between font-bold text-[#D4AF37] mb-1">
                    <span>{m.sender}</span>
                    <span className="text-[10px] text-gray-400">{m.time}</span>
                  </div>
                  <p className="text-gray-200">{m.text}</p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center space-x-2">
              <input
                type="text"
                value={directMessageInput}
                onChange={(e) => setDirectMessageInput(e.target.value)}
                placeholder="Type direct feedback or report instructions..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                onClick={handleSendDirectMessage}
                className="px-4 py-2.5 rounded-xl bg-[#D4AF37] text-[#0B4228] font-bold text-xs flex items-center space-x-1"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
