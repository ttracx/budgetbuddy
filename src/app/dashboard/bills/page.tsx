'use client'

import { useEffect, useState } from 'react'
import { Plus, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { BillCard } from '@/components/dashboard/bill-card'
import { formatCurrency } from '@/lib/utils'

interface Bill {
  id: string
  name: string
  amount: number
  dueDay: number
  isRecurring: boolean
  isPaid: boolean
}

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddBill, setShowAddBill] = useState(false)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDay, setDueDay] = useState('')

  const fetchBills = async () => {
    try {
      const res = await fetch('/api/bills')
      const data = await res.json()
      setBills(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching bills:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBills()
  }, [])

  const handleAddBill = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/bills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, amount, dueDay }),
    })
    setName('')
    setAmount('')
    setDueDay('')
    setShowAddBill(false)
    fetchBills()
  }

  const handleTogglePaid = async (id: string, isPaid: boolean) => {
    await fetch(`/api/bills/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPaid }),
    })
    fetchBills()
  }

  const handleDeleteBill = async (id: string) => {
    await fetch(`/api/bills/${id}`, { method: 'DELETE' })
    fetchBills()
  }

  const today = new Date().getDate()
  const upcomingBills = bills.filter((b) => !b.isPaid && b.dueDay >= today && b.dueDay <= today + 7)
  const overdueBills = bills.filter((b) => !b.isPaid && b.dueDay < today)
  const totalMonthly = bills.reduce((sum, b) => sum + b.amount, 0)
  const totalUnpaid = bills.filter((b) => !b.isPaid).reduce((sum, b) => sum + b.amount, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bill Reminders</h1>
          <p className="text-gray-500">Never miss a payment again</p>
        </div>
        <Button onClick={() => setShowAddBill(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Bill
        </Button>
      </div>

      {(upcomingBills.length > 0 || overdueBills.length > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">
              {overdueBills.length > 0 && `${overdueBills.length} overdue bill(s). `}
              {upcomingBills.length > 0 && `${upcomingBills.length} bill(s) due this week.`}
            </span>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500 mb-1">Total Monthly Bills</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(totalMonthly)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500 mb-1">Unpaid This Month</p>
            <p className="text-3xl font-bold text-red-600">
              {formatCurrency(totalUnpaid)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Bills</CardTitle>
        </CardHeader>
        <CardContent>
          {bills.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No bills added yet. Add your first bill to get reminders!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bills.map((bill) => (
                <BillCard
                  key={bill.id}
                  bill={bill}
                  onTogglePaid={handleTogglePaid}
                  onDelete={handleDeleteBill}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={showAddBill}
        onClose={() => setShowAddBill(false)}
        title="Add Bill"
      >
        <form onSubmit={handleAddBill} className="space-y-4">
          <Input
            label="Bill Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Rent, Electricity"
            required
          />
          <Input
            label="Amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
          />
          <Input
            label="Due Day of Month"
            type="number"
            min="1"
            max="31"
            value={dueDay}
            onChange={(e) => setDueDay(e.target.value)}
            placeholder="1-31"
            required
          />
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddBill(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Bill
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
