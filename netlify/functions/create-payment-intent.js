const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    const { amount, coupon } = JSON.parse(event.body);
    
    const finalAmount = coupon === 'FREE' ? 0 : amount;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: 'usd',
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
