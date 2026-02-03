import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
  typescript: true,
})

export const PRICE_ID = process.env.STRIPE_PRICE_ID || ''
export const PRODUCT_ID = process.env.STRIPE_PRODUCT_ID || ''
