import React, { useState } from 'react';
import {
  Users,
  Building2,
  Building,
  MapPin,
  TrendingUp,
  Award,
  Calendar as CalendarIcon,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  BarChart2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  Settings,
  Bell,
  Search,
  MessageSquare,
  UserCheck,
  X
} from 'lucide-react';
import { api } from '../../services/api';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { User, District, Branch, KPI, DailyPerformanceReport, AuditLog, BankHoliday, PerformanceTarget, getUserFullName } from '../../types';
import { AllProductsOverview } from './AllProductsOverview';
import { BranchCampaignWidget } from './BranchCampaignWidget';

interface AdminDashboardProps {
  user: User;
  districts: District[];
  branches: Branch[];
  employees: User[];
  kpis: KPI[];
  reports: DailyPerformanceReport[];
  auditLogs: AuditLog[];
  holidays: BankHoliday[];
  targets?: PerformanceTarget[];
  onRefreshData: () => void;
  onOpenAiAssistant: () => void;
  onOpenExportModal: () => void;
  onOpenProfile?: () => void;
  onOpenAiSummary?: (employee: User) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  districts,
  branches,
  employees,
  kpis,
  reports,
  auditLogs,
  holidays,
  targets = [],
  onRefreshData,
  onOpenAiAssistant,
  onOpenExportModal,
  onOpenProfile,
  onOpenAiSummary
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'districts' | 'branches' | 'employees' | 'kpis' | 'reports' | 'audit' | 'holidays'
  >('overview');

  const [searchTerm, setSearchTerm] = useState('');

  // Modals for adding district and branch
  const [isAddDistrictModalOpen, setIsAddDistrictModalOpen] = useState(false);
  const [newDistrictName, setNewDistrictName] = useState('');
  const [newDistrictCode, setNewDistrictCode] = useState('');
  const [newDistrictRegion, setNewDistrictRegion] = useState('');
  const [newDistrictManager, setNewDistrictManager] = useState('');
  const [newDistrictType, setNewDistrictType] = useState<'District' | 'Area Office'>('District');

  const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchCode, setNewBranchCode] = useState('');
  const [newBranchDistrictId, setNewBranchDistrictId] = useState('');
  const [newBranchType, setNewBranchType] = useState('Grade I');
  const [newBranchLocation, setNewBranchLocation] = useState('');
  const [newBranchManager, setNewBranchManager] = useState('');

  const handleCreateDistrict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDistrictName || !newDistrictCode || !newDistrictRegion) return;
    try {
      const formattedName = newDistrictName.endsWith('District') 
        ? newDistrictName 
        : `${newDistrictName} District`;

      await api.createDistrict({
        name: formattedName,
        code: newDistrictCode.toUpperCase(),
        region: newDistrictRegion,
        managerName: newDistrictManager || 'Assigned Manager',
        branchCount: 0,
        totalEmployees: 0
      });
      setIsAddDistrictModalOpen(false);
      setNewDistrictName('');
      setNewDistrictCode('');
      setNewDistrictRegion('');
      setNewDistrictManager('');
      onRefreshData();
    } catch (err) {
      alert('Failed to create district');
    }
  };

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName || !newBranchCode || !newBranchDistrictId) return;
    try {
      const dist = districts.find(d => d.id === newBranchDistrictId);
      await api.createBranch({
        districtId: newBranchDistrictId,
        districtName: dist?.name || '',
        name: newBranchName,
        code: newBranchCode.toUpperCase(),
        type: newBranchType,
        location: newBranchLocation || 'Main Commercial Area',
        managerName: newBranchManager || 'Branch Manager',
        employeeCount: 0
      });
      setIsAddBranchModalOpen(false);
      setNewBranchName('');
      setNewBranchCode('');
      setNewBranchDistrictId('');
      setNewBranchLocation('');
      setNewBranchManager('');
      onRefreshData();
    } catch (err) {
      alert('Failed to create branch');
    }
  };

  // Sample Chart Data
  const trendData = [
    { month: 'Jan', deposits: 120, digital: 850 },
    { month: 'Feb', deposits: 145, digital: 980 },
    { month: 'Mar', deposits: 160, digital: 1120 },
    { month: 'Apr', deposits: 180, digital: 1300 },
    { month: 'May', deposits: 210, digital: 1450 },
    { month: 'Jun', deposits: 240, digital: 1680 },
    { month: 'Jul', deposits: 290, digital: 1950 }
  ];

  const districtPerformanceData = districts.map(d => ({
    name: d.code,
    branches: d.branchCount,
    employees: d.totalEmployees
  }));

  const COLORS = ['#D4AF37', '#0B4228', '#10B981', '#3B82F6', '#F59E0B'];

  const pendingCount = reports.filter(r => r.status === 'Pending').length;
  const approvedCount = reports.filter(r => r.status === 'Approved').length;
  const rejectedCount = reports.filter(r => r.status === 'Rejected').length;

  return (
    <div className="space-y-8">
      
      {/* Top Banner / Welcome Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0B4228] via-[#08321E] to-[#051F13] border border-[#D4AF37]/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-white">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-[#D4AF37] text-[#0B4228] font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
              Administrator Console
            </span>
            <span className="text-xs text-gray-300">Bunna Bank S.C. HQ</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">
            Welcome, {getUserFullName(user)}
          </h2>
          <p className="text-xs text-gray-300 mt-0.5">
            Enterprise Performance Monitoring, District Governance, & AI Analytics
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
            <span>AI Insights Engine</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-white/10 text-xs font-bold text-gray-300">
        {[
          { id: 'overview', label: 'Executive Dashboard' },
          { id: 'products', label: 'All Products Performance' },
          { id: 'districts', label: 'Districts' },
          { id: 'branches', label: 'Branches' },
          { id: 'employees', label: 'Employee Roster' },
          { id: 'kpis', label: 'KPI Management' },
          { id: 'reports', label: 'Daily Reports' },
          { id: 'holidays', label: 'Bank Holidays' },
          { id: 'audit', label: 'System Audit Logs' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-[#D4AF37] text-[#0B4228] shadow-md font-extrabold'
                : 'bg-[#08321E] hover:bg-white/5 border border-white/10 text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB FOR ALL PRODUCTS */}
      {activeTab === 'products' && (
        <AllProductsOverview reports={reports} targets={targets} kpis={kpis} />
      )}

      {/* TAB 1: EXECUTIVE DASHBOARD */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Enterprise & Branch Daily Campaign Analytics Engine */}
          <BranchCampaignWidget
            branchName="All Bunna Bank Network Branches"
            userRole={user.role}
            reports={reports}
            onReportSubmitted={onRefreshData}
          />

          {/* Main All Products Performance Overview Section */}
          <AllProductsOverview reports={reports} targets={targets} kpis={kpis} />
          
          {/* Top Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-[#08321E] border border-[#D4AF37]/30 shadow-lg text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-400 font-medium">Total Staff Employees</p>
                  <h3 className="text-2xl font-extrabold text-white mt-1">{employees.length.toLocaleString()}</h3>
                </div>
                <div className="p-3 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37]">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <p className="text-[11px] text-emerald-400 mt-3 font-semibold">+12% growth in 2026</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#08321E] border border-[#D4AF37]/30 shadow-lg text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-400 font-medium">Active Branches</p>
                  <h3 className="text-2xl font-extrabold text-white mt-1">{branches.length} Branches</h3>
                </div>
                <div className="p-3 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37]">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>
              <p className="text-[11px] text-[#D4AF37] mt-3 font-semibold">Across {districts.length} Districts</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#08321E] border border-[#D4AF37]/30 shadow-lg text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-400 font-medium">Pending Approvals</p>
                  <h3 className="text-2xl font-extrabold text-amber-400 mt-1">{pendingCount} Reports</h3>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <p className="text-[11px] text-gray-400 mt-3 font-medium">Awaiting branch manager review</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#08321E] border border-[#D4AF37]/30 shadow-lg text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-400 font-medium">Approved Reports</p>
                  <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">{approvedCount} Reports</h3>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <p className="text-[11px] text-emerald-400 mt-3 font-semibold">99.8% compliance rate</p>
            </div>
          </div>

          {/* Interactive Recharts Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Chart 1: Performance Trends Area Chart */}
            <div className="lg:col-span-8 p-6 rounded-3xl bg-[#08321E] border border-[#D4AF37]/30 shadow-xl text-white">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold text-lg text-white">Financial Mobilization & Digital Activations Trend</h3>
                  <p className="text-xs text-gray-400">Monthly aggregate growth across all Bunna Bank branches</p>
                </div>
                <span className="bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-full text-xs font-bold">2026 YTD</span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorDeposits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorDigital" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
                    <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#0B4228', borderColor: '#D4AF37', borderRadius: '12px', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="deposits" name="Deposits (Million ETB)" stroke="#D4AF37" fillOpacity={1} fill="url(#colorDeposits)" />
                    <Area type="monotone" dataKey="digital" name="Digital Banking Activations" stroke="#10B981" fillOpacity={1} fill="url(#colorDigital)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: District Distribution Bar Chart */}
            <div className="lg:col-span-4 p-6 rounded-3xl bg-[#08321E] border border-[#D4AF37]/30 shadow-xl text-white flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-white mb-1">District Branch Density</h3>
                <p className="text-xs text-gray-400 mb-4">Branch count distribution per district</p>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={districtPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
                      <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} />
                      <YAxis stroke="#9CA3AF" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: '#0B4228', borderColor: '#D4AF37', borderRadius: '12px', fontSize: '12px' }} />
                      <Bar dataKey="branches" name="Branches" fill="#D4AF37" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 text-center">
                <span className="text-xs text-[#D4AF37] font-semibold">
                  Top Performing District: Addis Ababa East District
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: DISTRICTS */}
      {activeTab === 'districts' && (
        <div className="p-6 rounded-3xl bg-[#08321E] border border-[#D4AF37]/30 shadow-xl text-white space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-white">Districts Roster</h3>
            <button
              onClick={() => setIsAddDistrictModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#0B4228] font-bold text-xs flex items-center space-x-1.5 hover:bg-[#b89628] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New District</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#0B4228] text-[#D4AF37] font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">District Code</th>
                  <th className="p-3">District Name</th>
                  <th className="p-3">Region / Location</th>
                  <th className="p-3">Branches</th>
                  <th className="p-3">Staff Employees</th>
                  <th className="p-3">District Manager</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {districts.map(d => (
                  <tr key={d.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-bold text-[#D4AF37]">{d.code}</td>
                    <td className="p-3 font-semibold text-white">{d.name}</td>
                    <td className="p-3">{d.region}</td>
                    <td className="p-3">{d.branchCount} Branches</td>
                    <td className="p-3">{d.totalEmployees} Staff</td>
                    <td className="p-3 text-emerald-400 font-medium">{d.managerName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BRANCHES */}
      {activeTab === 'branches' && (
        <div className="p-6 rounded-3xl bg-[#08321E] border border-[#D4AF37]/30 shadow-xl text-white space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-white">Branch Directory ({branches.length})</h3>
            <button
              onClick={() => setIsAddBranchModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#0B4228] font-bold text-xs flex items-center space-x-1.5 hover:bg-[#b89628] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Branch</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#0B4228] text-[#D4AF37] font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Code</th>
                  <th className="p-3">Branch Name</th>
                  <th className="p-3">District</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Branch Manager</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {branches.map(b => (
                  <tr key={b.id} className="hover:bg-white/5">
                    <td className="p-3 font-bold text-[#D4AF37]">{b.code}</td>
                    <td className="p-3 font-semibold text-white">{b.name}</td>
                    <td className="p-3">{b.districtName}</td>
                    <td className="p-3"><span className="bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full text-[10px] font-bold">{b.type}</span></td>
                    <td className="p-3">{b.location}</td>
                    <td className="p-3 text-emerald-400 font-medium">{b.managerName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: EMPLOYEES */}
      {activeTab === 'employees' && (
        <div className="p-6 rounded-3xl bg-[#08321E] border border-[#D4AF37]/30 shadow-xl text-white space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-white">Employee Staff Roster</h3>
            <span className="text-xs text-[#D4AF37]">{employees.length} Registered Users</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#0B4228] text-[#D4AF37] font-bold uppercase">
                <tr>
                  <th className="p-3">Staff ID</th>
                  <th className="p-3">Employee Name</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Job Title</th>
                  <th className="p-3">Branch</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {employees.map(e => (
                  <tr key={e.id} className="hover:bg-white/5">
                    <td className="p-3 font-bold text-[#D4AF37]">{e.userId}</td>
                    <td className="p-3 font-semibold text-white">{getUserFullName(e)}</td>
                    <td className="p-3"><span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold">{e.role}</span></td>
                    <td className="p-3">{e.jobTitle}</td>
                    <td className="p-3">{e.branchName}</td>
                    <td className="p-3">{e.email}</td>
                    <td className="p-3"><span className="text-emerald-400 font-bold">{e.status}</span></td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (onOpenAiSummary) {
                            onOpenAiSummary(e);
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#D4AF37] hover:bg-[#e0be4d] text-[#0B4228] font-bold text-[11px] inline-flex items-center space-x-1 shadow transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>AI Summary</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: KPIS */}
      {activeTab === 'kpis' && (
        <div className="p-6 rounded-3xl bg-[#08321E] border border-[#D4AF37]/30 shadow-xl text-white space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-white">Bunna Bank KPI Definitions & Weightings</h3>
            <button
              onClick={() => alert("New KPI creation modal opened.")}
              className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#0B4228] font-bold text-xs flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Define New KPI</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {kpis.map(k => (
              <div key={k.id} className="p-4 rounded-2xl bg-[#0B4228] border border-[#D4AF37]/20 flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-[#D4AF37]">{k.code}</span>
                    <span className="bg-white/10 text-[10px] px-2 py-0.5 rounded font-medium">{k.category}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white mt-1">{k.name}</h4>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">{k.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-base font-extrabold text-[#D4AF37]">{k.weight}%</span>
                  <p className="text-[10px] text-gray-400">Weight</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: REPORTS */}
      {activeTab === 'reports' && (
        <div className="p-6 rounded-3xl bg-[#08321E] border border-[#D4AF37]/30 shadow-xl text-white space-y-4">
          <h3 className="font-bold text-lg text-white">Daily Performance Reports Master Log</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#0B4228] text-[#D4AF37] font-bold uppercase">
                <tr>
                  <th className="p-3">Report Date</th>
                  <th className="p-3">Employee</th>
                  <th className="p-3">Branch</th>
                  <th className="p-3">Deposits (ETB)</th>
                  <th className="p-3">Mobile Activations</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Reviewed By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {reports.map(r => (
                  <tr key={r.id} className="hover:bg-white/5">
                    <td className="p-3 font-bold text-[#D4AF37]">{r.reportDate}</td>
                    <td className="p-3 font-semibold text-white">{r.employeeName}</td>
                    <td className="p-3">{r.branchName}</td>
                    <td className="p-3 font-bold text-emerald-400">ETB {r.depositsETB.toLocaleString()}</td>
                    <td className="p-3">{r.mobileBankingActivations}</td>
                    <td className="p-3"><span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">{r.status}</span></td>
                    <td className="p-3">{r.reviewedBy || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: BANK HOLIDAYS */}
      {activeTab === 'holidays' && (
        <div className="p-6 rounded-3xl bg-[#08321E] border border-[#D4AF37]/30 shadow-xl text-white space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-white">Configured Official Bank Holidays</h3>
            <button
              onClick={() => alert("Add Bank Holiday modal opened.")}
              className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#0B4228] font-bold text-xs flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Bank Holiday</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {holidays.map(h => (
              <div key={h.id} className="p-4 rounded-2xl bg-[#0B4228] border border-[#D4AF37]/20">
                <p className="font-bold text-xs text-[#D4AF37]">{h.date}</p>
                <h4 className="font-bold text-sm text-white mt-0.5">{h.name}</h4>
                <p className="text-xs text-gray-300 mt-1">{h.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-3xl bg-[#08321E] border border-[#D4AF37]/30 shadow-xl text-white space-y-4">
          <h3 className="font-bold text-lg text-white">System Security & Audit Log History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#0B4228] text-[#D4AF37] font-bold uppercase">
                <tr>
                  <th className="p-3">Log ID</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Module</th>
                  <th className="p-3">IP Address</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {auditLogs.map(l => (
                  <tr key={l.id} className="hover:bg-white/5">
                    <td className="p-3 font-bold text-[#D4AF37]">{l.id}</td>
                    <td className="p-3 font-semibold text-white">{l.userName}</td>
                    <td className="p-3">{l.userRole}</td>
                    <td className="p-3 font-mono text-emerald-400">{l.action}</td>
                    <td className="p-3">{l.module}</td>
                    <td className="p-3">{l.ipAddress}</td>
                    <td className="p-3">{l.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD DISTRICT */}
      {isAddDistrictModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B4228] border border-[#D4AF37]/40 rounded-3xl p-6 w-full max-w-md text-white space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-bold text-lg text-white flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-[#D4AF37]" />
                <span>Add New District</span>
              </h3>
              <button
                onClick={() => setIsAddDistrictModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDistrict} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">District Type</label>
                <select
                  value={newDistrictType}
                  onChange={(e) => setNewDistrictType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#08321E] border border-white/20 text-xs text-white focus:outline-none"
                >
                  <option value="District">Regional City District</option>
                  <option value="Area Office">Zonal City District</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">City / Office Name</label>
                <input
                  type="text"
                  placeholder="e.g., Harar, Gondar, Nekemte"
                  value={newDistrictName}
                  onChange={(e) => setNewDistrictName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#08321E] border border-white/20 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">District Code</label>
                <input
                  type="text"
                  placeholder="e.g., HRD, GND, NKT"
                  value={newDistrictCode}
                  onChange={(e) => setNewDistrictCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#08321E] border border-white/20 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Region / Zone</label>
                <input
                  type="text"
                  placeholder="e.g., Harari Region, Amhara Region"
                  value={newDistrictRegion}
                  onChange={(e) => setNewDistrictRegion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#08321E] border border-white/20 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Manager Name</label>
                <input
                  type="text"
                  placeholder="e.g., Ato Solomon Worku"
                  value={newDistrictManager}
                  onChange={(e) => setNewDistrictManager(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#08321E] border border-white/20 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddDistrictModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-xs text-gray-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#0B4228] text-xs font-bold"
                >
                  Save Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD BRANCH */}
      {isAddBranchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B4228] border border-[#D4AF37]/40 rounded-3xl p-6 w-full max-w-md text-white space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-bold text-lg text-white flex items-center space-x-2">
                <Building className="w-5 h-5 text-[#D4AF37]" />
                <span>Add New Branch</span>
              </h3>
              <button
                onClick={() => setIsAddBranchModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBranch} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Parent District / Area Office</label>
                <select
                  value={newBranchDistrictId}
                  onChange={(e) => setNewBranchDistrictId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#08321E] border border-white/20 text-xs text-white focus:outline-none"
                  required
                >
                  <option value="">-- Choose Parent Office --</option>
                  {districts.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.region})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Branch Name</label>
                <input
                  type="text"
                  placeholder="e.g., Harar Jugol Branch"
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#08321E] border border-white/20 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Branch Code</label>
                <input
                  type="text"
                  placeholder="e.g., HRR-01"
                  value={newBranchCode}
                  onChange={(e) => setNewBranchCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#08321E] border border-white/20 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Grade / Type</label>
                  <select
                    value={newBranchType}
                    onChange={(e) => setNewBranchType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#08321E] border border-white/20 text-xs text-white focus:outline-none"
                  >
                    <option value="Grade I">Grade I</option>
                    <option value="Grade II">Grade II</option>
                    <option value="Grade III">Grade III</option>
                    <option value="Special Branch">Special Branch</option>
                    <option value="IFB Special Branch">IFB Special Branch</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Location Area</label>
                  <input
                    type="text"
                    placeholder="e.g., Downtown Commercial"
                    value={newBranchLocation}
                    onChange={(e) => setNewBranchLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#08321E] border border-white/20 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Branch Manager Name</label>
                <input
                  type="text"
                  placeholder="e.g., W/ro Bethlehem Tesfaye"
                  value={newBranchManager}
                  onChange={(e) => setNewBranchManager(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#08321E] border border-white/20 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddBranchModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-xs text-gray-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#0B4228] text-xs font-bold"
                >
                  Create Branch
                </button>
                </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
