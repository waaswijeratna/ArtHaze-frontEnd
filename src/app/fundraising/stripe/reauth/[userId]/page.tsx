"use client";

import { useEffect } from 'react';
import { createStripeAccountLink } from '@/services/fundraisingService';
import { useParams } from 'next/navigation';

export default function ReauthPage() {
  const params = useParams();
  const userId = params.userId as string;

  useEffect(() => {
    const reauthorize = async () => {
      const result = await createStripeAccountLink(userId);
      if (result?.url) {
        window.location.href = result.url;
      }
    };

    reauthorize();
  }, [userId]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Reauthorizing with Stripe...</h1>
        <p>Please wait while we redirect you to Stripe.</p>
      </div>
    </div>
  );
}