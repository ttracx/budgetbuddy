'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { CreditCard, User, Shield, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'

export default function SettingsPage() {
  const { data: session } = useSession()
  const [subscription, setSubscription] = useState<{
    isSubscribed: boolean
    subscriptionEnd: string | null
  } | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSubscription()
  }, [])

  const fetchSubscription = async () => {
    try {
      const res = await fetch('/api/user/subscription')
      const data = await res.json()
      setSubscription(data)
    } catch (error) {
      console.error('Error fetching subscription:', error)
    }
  }

  const handleManageSubscription = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error opening portal:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error creating checkout:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account and subscription</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <User className="h-5 w-5 text-indigo-600" />
            </div>
            <CardTitle>Account</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{session?.user?.name || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{session?.user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-green-600" />
            </div>
            <CardTitle>Subscription</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {subscription?.isSubscribed ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
                <span className="text-sm text-gray-500">Pro Plan</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Period Ends</p>
                <p className="font-medium">
                  {subscription.subscriptionEnd
                    ? formatDate(subscription.subscriptionEnd)
                    : 'N/A'}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleManageSubscription}
                loading={loading}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Manage Subscription
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Free Trial
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Upgrade to Pro for unlimited access to all features.
              </p>
              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl font-bold text-gray-900">$6.99</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li>✓ Unlimited expense tracking</li>
                  <li>✓ Custom budget categories</li>
                  <li>✓ Monthly reports</li>
                  <li>✓ Priority support</li>
                </ul>
                <Button onClick={handleSubscribe} loading={loading} className="w-full">
                  Upgrade to Pro
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-amber-600" />
            </div>
            <CardTitle>Security</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Your data is encrypted and stored securely. We never share your
            financial information with third parties.
          </p>
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Shield className="h-4 w-4" />
            <span>256-bit SSL encryption</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
