import express from 'express'
import Stripe from 'stripe'
import { paymentIntent } from '../controllers/paymentIntent.js'

const routes = express.Router()

routes.post('/create-payment-intent',paymentIntent)

export default routes