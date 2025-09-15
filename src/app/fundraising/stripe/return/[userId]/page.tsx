"use client";

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { getStripeAccountStatus } from '@/services/fundraisingService';

interface AccountStatus {
  detailsSubmitted: boolean;
  payoutsEnabled: boolean;
  chargesEnabled: boolean;
  accountId: string;
}

export default function ReturnPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const userId = params.userId as string;
  const accountId = searchParams.get('accountId');
  
  const [status, setStatus] = useState<AccountStatus | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const checkStatus = async () => {
      if (!accountId) {
        setError('No account ID provided');
        return;
      }

      const result = await getStripeAccountStatus(userId, accountId);
      if (result) {
        setStatus(result);
      } else {
        setError('Failed to get account status');
      }
    };

    checkStatus();
  }, [userId, accountId]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p>Checking your account status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Stripe Account Status</h1>
        
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-2">Account ID</h2>
            <p className="font-mono bg-gray-100 p-2 rounded">{status.accountId}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <span className={status.detailsSubmitted ? "text-green-500" : "text-red-500"}>
                ⬤
              </span>
              <span className="ml-2">Account Details Submitted</span>
            </div>

            <div className="flex items-center">
              <span className={status.payoutsEnabled ? "text-green-500" : "text-red-500"}>
                ⬤
              </span>
              <span className="ml-2">Payouts Enabled</span>
            </div>

            <div className="flex items-center">
              <span className={status.chargesEnabled ? "text-green-500" : "text-red-500"}>
                ⬤
              </span>
              <span className="ml-2">Charges Enabled</span>
            </div>
          </div>
        </div>

        {status.detailsSubmitted && status.payoutsEnabled && status.chargesEnabled ? (
          <div className="mt-6 p-4 bg-green-50 text-green-700 rounded-md">
            <p className="text-center">
              Your account is fully set up! You can now use this Account ID for your fundraising campaigns:
              <span className="block mt-2 font-mono bg-white p-2 rounded border border-green-200">
                {status.accountId}
              </span>
            </p>
          </div>
        ) : (
          <div className="mt-6 p-4 bg-yellow-50 text-yellow-700 rounded-md">
            <p className="text-center">
              Your account setup is not complete. Please ensure all requirements are met to start accepting payments.
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => window.close()}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}