import Link from 'next/link'
import {
  PiggyBank,
  BarChart3,
  Bell,
  Target,
  Receipt,
  Shield,
  Check,
} from 'lucide-react'

const features = [
  {
    icon: Receipt,
    title: 'Expense Tracking',
    description: 'Log and categorize every expense with ease. Know exactly where your money goes.',
  },
  {
    icon: BarChart3,
    title: 'Spending Insights',
    description: 'Visualize your spending patterns with beautiful charts and detailed reports.',
  },
  {
    icon: Bell,
    title: 'Bill Reminders',
    description: 'Never miss a payment. Get reminders before bills are due.',
  },
  {
    icon: Target,
    title: 'Savings Goals',
    description: 'Set goals and track your progress. Watch your savings grow over time.',
  },
]

const pricingFeatures = [
  'Unlimited expense tracking',
  'Custom budget categories',
  'Monthly spending reports',
  'Bill reminders',
  'Savings goals tracking',
  'Data export',
  'Priority support',
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <PiggyBank className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">BudgetBuddy</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Take Control of Your{' '}
            <span className="text-indigo-600">Finances</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            BudgetBuddy helps you track expenses, manage budgets, and achieve your
            savings goals — all in one beautiful, easy-to-use app.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors text-lg"
            >
              Start Free Trial
            </Link>
            <Link
              href="#features"
              className="bg-white text-gray-700 px-8 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors text-lg"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Your Money
            </h2>
            <p className="text-lg text-gray-600">
              Powerful features to help you stay on top of your finances.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center p-6">
                <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-7 w-7 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600">
              One plan, all features. Start with a free trial.
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro Plan</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-gray-900">$6.99</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <p className="text-gray-500 mt-2">Cancel anytime</p>
              </div>
              <ul className="space-y-4 mb-8">
                {pricingFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block w-full bg-indigo-600 text-white text-center py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of users who have transformed their financial habits.
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors text-lg"
          >
            Get Started for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PiggyBank className="h-6 w-6 text-indigo-400" />
              <span className="text-lg font-bold text-white">BudgetBuddy</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Shield className="h-4 w-4" />
              <span className="text-sm">Secure & Private</span>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} BudgetBuddy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
