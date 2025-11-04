'use client';

import { useSearchParams } from 'next/navigation';

export default function ConfirmEmailPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name');
  const email = searchParams.get('email');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="bg-darkmode rounded-xl p-8 shadow-lg max-w-md w-full border border-cyan-500/20">
        <h1 className="text-2xl mb-2 font-bold">Hello{name ? `, ${name}` : ""}!</h1>
        <h2 className="mb-4 text-lg font-semibold">Welcome to Nexus Tech 🎉</h2>
        <p className="mb-2">
          Your account was created successfully{email ? <> for <b>{email}</b></> : null}.
        </p>
        <p>
          Please check your email inbox to activate your account!
        </p>
        <p className="mt-2 text-xs text-gray-400">
          Having trouble? Also check your spam folder, or <a href={`mailto:support@nexustech.com`} className="underline text-cyan-300">contact support</a>.
        </p>
      </div>
    </div>
  );
}