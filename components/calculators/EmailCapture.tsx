"use client";

import { useState } from "react";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="my-10 rounded-xl border border-gray-200 bg-gray-50 px-6 py-7 text-center">
      {submitted ? (
        <div>
          <div className="text-2xl mb-2">✓</div>
          <p className="text-gray-800 font-semibold">You&apos;re on the list!</p>
          <p className="text-gray-500 text-sm mt-1">Check your inbox for the free options guide.</p>
        </div>
      ) : (
        <>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Free Resource</p>
          <h3 className="text-gray-900 font-bold text-lg mb-1">Get the Complete Options Strategy Guide</h3>
          <p className="text-gray-500 text-sm mb-5 max-w-md mx-auto">
            A concise PDF covering every major options strategy — payoff diagrams, breakeven formulas, and when to use each one. Free for traders.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
            >
              Send Me the Guide
            </button>
          </form>
          <p className="text-gray-400 text-xs mt-3">No spam. Unsubscribe any time.</p>
        </>
      )}
    </div>
  );
}
