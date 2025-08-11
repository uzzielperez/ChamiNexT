import React from 'react';
import { useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/jobseekers/CheckoutForm';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('your_publishable_key'); // Replace with your publishable key

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const data = location.state?.data;

  const options = {
    // passing the client secret obtained from the server
    clientSecret: '{{CLIENT_SECRET}}',
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-8">Payment</h1>
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm data={data} />
      </Elements>
    </div>
  );
};

export default PaymentPage;
