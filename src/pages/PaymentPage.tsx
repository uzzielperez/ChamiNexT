import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/jobseekers/CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentPage: React.FC = () => {
  const [clientSecret, setClientSecret] = useState('');
  const [coupon, setCoupon] = useState('');

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch('/.netlify/functions/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 1000, coupon }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [coupon]);

  const options = {
    clientSecret,
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-8">Payment</h1>
      <div className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="coupon" className="block text-sm font-medium text-gray-300">
            Coupon Code
          </label>
          <input
            type="text"
            id="coupon"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm"
          />
        </div>
        {clientSecret && (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
