import React, { useMemo } from 'react';
import { DailyPerformanceReport, PerformanceTarget } from '../../types';

interface Props {
  reports: DailyPerformanceReport[];
  targets: PerformanceTarget[];
  employeeId: string;
}

const KPI_KEYS = [
  { key: 'depositsETB', label: 'Deposits (ETB)' },
  { key: 'foreignCurrencyETB', label: 'Foreign Currency / FCY Remittance (ETB)' },
  { key: 'digitalFinancialServicesETB', label: 'Digital Financial Services Vol (ETB)' },
  { key: 'accountOpenings', label: 'Account Openings' },
  { key: 'mobileBankingActivations', label: 'Bunna Mobile Activations' },
  { key: 'internetBankingActivations', label: 'Internet Banking' },
  { key: 'merchantSolutionsActivations', label: 'Merchant POS' },
  { key: 'atmCardsIssued', label: 'ATM Cards' }
];

export const EmployeePerformanceTable: React.FC<Props> = ({ reports, targets, employeeId }) => {
  const approvedReports = reports.filter(r => r.employeeId === employeeId && r.status === 'Approved');
  const myTargets = targets.filter(t => t.employeeId === employeeId);

  const stats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().substring(0, 10);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10);
    const semiAnnualAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10);
    const annualAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10);

    return KPI_KEYS.map(kpi => {
      let daily = 0, weekly = 0, monthly = 0, semiAnnual = 0, annual = 0, totalActual = 0;
      
      approvedReports.forEach(r => {
        const val = (r as any)[kpi.key] || 0;
        totalActual += val;
        if (r.date === todayStr || r.reportDate === todayStr) daily += val;
        if ((r.date || r.reportDate) >= oneWeekAgo) weekly += val;
        if ((r.date || r.reportDate) >= oneMonthAgo) monthly += val;
        if ((r.date || r.reportDate) >= semiAnnualAgo) semiAnnual += val;
        if ((r.date || r.reportDate) >= annualAgo) annual += val;
      });

      // Target mapping: Since targets may be created generally by Branch Manager, we sum targets that match the KPI label.
      const assignedTarget = myTargets
        .filter(t => t.kpiName.toLowerCase().includes(kpi.label.split(' ')[0].toLowerCase()))
        .reduce((sum, t) => sum + t.targetValue, 0);

      const diff = totalActual - assignedTarget;
      const completionPct = assignedTarget > 0 ? (totalActual / assignedTarget) * 100 : 0;
      const remaining = Math.max(0, assignedTarget - totalActual);

      return {
        ...kpi,
        daily, weekly, monthly, semiAnnual, annual,
        totalActual, assignedTarget, diff, completionPct, remaining
      };
    });
  }, [approvedReports, myTargets]);

  return (
    <div className="bg-[#4A2C17] border border-[#C89A2B]/40 rounded-3xl p-6 shadow-xl w-full overflow-hidden">
      <h3 className="text-lg font-black text-white mb-4">Comprehensive KPI Performance</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-200">
          <thead className="bg-[#6B3F1D]/50 text-[#C89A2B] text-xs">
            <tr>
              <th className="p-3 rounded-tl-xl font-bold">KPI Name</th>
              <th className="p-3 font-bold text-center">Daily</th>
              <th className="p-3 font-bold text-center">Weekly</th>
              <th className="p-3 font-bold text-center">Monthly</th>
              <th className="p-3 font-bold text-center">Semi-Annual</th>
              <th className="p-3 font-bold text-center">Annual</th>
              <th className="p-3 font-bold text-right border-l border-white/5">Target</th>
              <th className="p-3 font-bold text-right">Actual</th>
              <th className="p-3 font-bold text-right">Diff</th>
              <th className="p-3 font-bold text-right">Remaining</th>
              <th className="p-3 rounded-tr-xl font-bold text-right">Completion %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-xs">
            {stats.map((row, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                <td className="p-3 font-semibold text-white whitespace-nowrap">{row.label}</td>
                <td className="p-3 text-center">{row.daily.toLocaleString()}</td>
                <td className="p-3 text-center">{row.weekly.toLocaleString()}</td>
                <td className="p-3 text-center text-emerald-400 font-medium">{row.monthly.toLocaleString()}</td>
                <td className="p-3 text-center">{row.semiAnnual.toLocaleString()}</td>
                <td className="p-3 text-center">{row.annual.toLocaleString()}</td>
                
                <td className="p-3 text-right border-l border-white/5 text-[#C89A2B] font-bold">{row.assignedTarget > 0 ? row.assignedTarget.toLocaleString() : '-'}</td>
                <td className="p-3 text-right text-white font-bold">{row.totalActual.toLocaleString()}</td>
                <td className="p-3 text-right">
                  <span className={row.diff >= 0 ? "text-emerald-400" : "text-rose-400"}>
                    {row.diff > 0 ? '+' : ''}{row.diff.toLocaleString()}
                  </span>
                </td>
                <td className="p-3 text-right text-gray-400">{row.remaining.toLocaleString()}</td>
                <td className="p-3 text-right font-black">
                  <span className={row.completionPct >= 100 ? "text-emerald-400" : row.completionPct > 50 ? "text-[#C89A2B]" : "text-rose-400"}>
                    {row.completionPct.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
