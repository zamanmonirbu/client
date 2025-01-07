import express from 'express'
import Stripe from 'stripe'
import { paymentIntent, payWithIdeal } from '../controllers/paymentIntent.js'

const routes = express.Router()

routes.post('/create-payment-intent',paymentIntent)
routes.post('/initialize',payWithIdeal)


export default routes