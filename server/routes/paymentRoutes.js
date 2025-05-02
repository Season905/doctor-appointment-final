const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const asyncHandler = require('express-async-handler');
const auth = require('../middleware/auth');

router.post('/create-payment-intent', auth, asyncHandler(async (req, res) => {
  const { amount } = req.body;
  
  if (!amount || isNaN(amount)) {
    return res.status(400).json({ error: 'Valid amount required' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: { userId: req.user.id.toString() }
    });

    res.json({ 
      success: true,
      clientSecret: paymentIntent.client_secret 
    });
  } catch (err) {
    console.error('Stripe Error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Payment processing failed' 
    });
  }
}));

module.exports = router;