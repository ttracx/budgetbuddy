'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface CategoryData {
  name: string
  icon: string
  color: string
  spent: number
  budget: number
}

interface DailyData {
  date: string
  amount: number
}

interface SpendingChartProps {
  categoryData: CategoryData[]
  dailyData: DailyData[]
}

export function SpendingByCategory({ data }: { data: CategoryData[] }) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No spending data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          dataKey="spent"
          nameKey="name"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => formatCurrency(value)}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function DailySpendingChart({ data }: { data: DailyData[] }) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No spending data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          tickFormatter={(date) => new Date(date).getDate().toString()}
          tick={{ fill: '#6b7280', fontSize: 12 }}
        />
        <YAxis
          tickFormatter={(value) => `$${value}`}
          tick={{ fill: '#6b7280', fontSize: 12 }}
        />
        <Tooltip
          formatter={(value: number) => formatCurrency(value)}
          labelFormatter={(date) => new Date(date).toLocaleDateString()}
        />
        <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function BudgetVsSpending({ data }: { data: CategoryData[] }) {
  const chartData = data.filter(d => d.budget > 0 || d.spent > 0)
  
  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No budget data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis type="number" tickFormatter={(value) => `$${value}`} />
        <YAxis
          type="category"
          dataKey="name"
          width={120}
          tick={{ fill: '#6b7280', fontSize: 12 }}
        />
        <Tooltip formatter={(value: number) => formatCurrency(value)} />
        <Legend />
        <Bar dataKey="budget" fill="#e5e7eb" name="Budget" radius={[0, 4, 4, 0]} />
        <Bar dataKey="spent" fill="#6366f1" name="Spent" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
