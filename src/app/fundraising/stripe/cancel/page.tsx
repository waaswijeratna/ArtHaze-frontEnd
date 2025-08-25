/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

export default function CancelPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-2xl font-bold mb-4 text-red-600">Payment Cancelled</h1>
      <img src="/images/payment_cancel.svg" alt="Thank You" className="mx-auto mb-4 w-32 h-auto" />
      <p className="text-lg">Your payment was cancelled. You can try again.</p>
      <a href="/" className="mt-6 inline-block px-6 py-2 bg-secondary hover:bg-third text-black rounded-full">
        Go back home
      </a>
    </div>
  );
}
