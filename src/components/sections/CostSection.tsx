'use client'
import { costData } from '@/data/dashboardData'
import { DonutChart } from '@/components/ui'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

function CostKPI({
  label, value, prev, chg,
}: { label: string; value: string; prev: string; chg: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm space-y-1">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{label}</p>
      <p className="text-2xl font-black text-teal-700">{value}</p>
      <p className="text-xs text-gray-400">
        vs Last: {prev} <span className="text-red-500 font-bold">{chg}</span>
      </p>
    </div>
  )
}

export default function CostSection() {
  const d = costData
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-2">
        <div className="w-16 h-16 rounded-xl flex flex-col items-center justify-center text-white" style={{ backgroundColor: '#00695C' }}>
          <span className="text-2xl">💰</span>
          <span className="text-[8px] font-black tracking-widest">COST</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-teal-800">Cost</h1>
          <p className="text-sm text-gray-500 font-medium">People Cost & Investment</p>
        </div>
      </div>
      <div className="w-full h-px bg-gray-200" />

      {/* Main content */}
      <div className="rounded-2xl p-6 space-y-5" style={{ backgroundColor: '#e0f2f1' }}>
        <div className="text-center">
          <h2 className="text-2xl font-black uppercase text-gray-900">Workforce Economics</h2>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">People Cost Visibility</p>
        </div>

        <span className="bg-teal-700 text-white text-xs font-black px-3 py-1 rounded uppercase tracking-wider">
          Key Metrics
        </span>

        {/* 5 KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <CostKPI label="Monthly Manpower Cost" value={d.monthlyManpowerCost} prev={d.monthlyManpowerCostPrev} chg={d.monthlyManpowerCostChg} />
          <CostKPI label="Annualized Cost" value={d.annualizedCost} prev={d.annualizedCostPrev} chg={d.annualizedCostChg} />
          <CostKPI label="Cost Per Employee" value={d.costPerEmployee} prev={d.costPerEmployeePrev} chg={d.costPerEmployeeChg} />
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Growth Per Trend (YoY)</p>
            <p className="text-2xl font-black text-teal-700">{d.growthYoY}</p>
            <p className="text-xs text-gray-400">vs Last Year: {d.growthYoYPrev} <span className="text-red-500 font-bold">+2.9pp</span></p>
          </div>
          <CostKPI label="Replacement Hiring Cost" value={d.replacementHiringCost} prev={d.replacementHiringCostPrev} chg={d.replacementHiringCostChg} />
        </div>

        {/* 3 charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Manpower Cost Trend */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-widest text-center text-gray-700 mb-1">Manpower Cost Trend</p>
            <p className="text-[10px] text-gray-400 text-center mb-2">(Last 12 Months)</p>
            <p className="text-[10px] text-gray-500 text-left">Rp (Billion)</p>
            <ResponsiveContainer width="100%" height={130}>
              <LineChart data={d.manpowerTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 9 }} domain={[0, 3]} />
                <Tooltip formatter={(v) => `Rp ${v}B`} />
                <Line type="monotone" dataKey="value" stroke="#00695C" strokeWidth={2} dot={{ r: 2, fill: '#00695C' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Cost Breakdown Donut */}
          <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center gap-2">
            <p className="text-xs font-black uppercase tracking-widest text-center text-gray-700">Cost Breakdown</p>
            <p className="text-[10px] text-gray-400">(Annualized)</p>
            <DonutChart
              segments={d.costBreakdown.map((s) => ({ value: s.value, color: s.color }))}
              size={120}
              center={
                <div className="text-center">
                  <p className="text-sm font-black text-teal-700">{d.annualizedCost}</p>
                  <p className="text-[10px] text-gray-500">Total</p>
                </div>
              }
            />
            <div className="grid grid-cols-1 gap-0.5 text-xs w-full">
              {d.costBreakdown.map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="text-gray-600">{s.name} ({s.amount} {s.value}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Per Employee Trend */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-widest text-center text-gray-700 mb-1">Cost Per Employee Trend</p>
            <p className="text-[10px] text-gray-400 text-center mb-2">(Last 12 Months)</p>
            <p className="text-[10px] text-gray-500 text-left">Rp (Million)</p>
            <ResponsiveContainer width="100%" height={130}>
              <LineChart data={d.costPerEmployeeTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 9 }} domain={[0, 25]} />
                <Tooltip formatter={(v) => `Rp ${v}M`} />
                <Line type="monotone" dataKey="value" stroke="#00695C" strokeWidth={2} dot={{ r: 2, fill: '#00695C' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Leadership Signal */}
      <div className="rounded-2xl p-4 flex flex-wrap items-center gap-6 bg-teal-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-teal-700 flex items-center justify-center text-white text-xl flex-shrink-0">💡</div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-teal-700">Leadership Signal</p>
            <p className="text-xs text-gray-600 font-medium">{d.leadershipSignal}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          {[
            { icon: '💱', text: 'High turnover drives recurring recruitment and onboarding cost' },
            { icon: '📊', text: 'Productivity loss while critical roles remain vacant' },
            { icon: '👥', text: 'Knowledge loss impacts delivery quality and speed' },
            { icon: '💰', text: 'True cost of turnover is 1.5 - 2.5x annual salary' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-xs max-w-[150px]">
              <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white flex-shrink-0">{s.icon}</div>
              <span className="text-gray-600">{s.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
