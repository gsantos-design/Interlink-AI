const express = require('express');
const Stripe = require('stripe');

const router = express.Router();

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const priceId = process.env.STRIPE_PRICE_ID;
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

router.post('/create-checkout-session', async (req, res) => {
  try {
    if (!stripe || !priceId) {
      return res
        .status(500)
        .json({ error: 'Stripe not configured. Add STRIPE_SECRET_KEY and STRIPE_PRICE_ID.' });
    }
    const { successUrl, cancelUrl } = req.body || {};
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl || 'https://example.com/checkout/success',
      cancel_url: cancelUrl || 'https://example.com/checkout/cancel',
    });
    return res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error', err);
    return res.status(500).json({ error: 'Error creating checkout session.' });
  }
});

module.exports = router;
