/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { confirmStripePayment } from "@/services/exhibitionService";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState("Processing payment...");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    const confirmPayment = async () => {
      if (!sessionId) {
        setStatus("Missing session ID!");
        setIsSuccess(false);
        return;
      }

      try {
        const result = await confirmStripePayment(sessionId);
        if (result.success) {
          setStatus("Your donation has been received. Thank you!");
          setIsSuccess(true);
        } else {
          setStatus("Payment not completed.");
          setIsSuccess(false);
        }
      } catch (error) {
        setStatus("Error confirming payment. " + error);
        setIsSuccess(false);
      }
    };

    confirmPayment();
  }, [sessionId]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {isSuccess ? (
        <div className="bg-primary text-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Payment Successful</h1>
          <img src="/images/payment_success.svg" alt="Thank You" className="mx-auto mb-4 w-32 h-auto" />
          <p className="text-lg">{status}</p>
          <a href="/" className="mt-6 inline-block px-6 py-2 bg-secondary hover:bg-third text-black rounded-full">
            Go back home
          </a>
        </div>
      ) : (
        <div className="bg-white text-black p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Payment Failed</h1>
          <p className="text-lg">{status}</p>
          <a href="/" className="mt-6 inline-block text-blue-600 underline">
            Try Again
          </a>
        </div>
      )}
    </div>
  );
}
