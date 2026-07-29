"use client";

import { useState } from "react";
import { CheckIcon } from "./Icons";

export default function Pricing() {
  const [billing, setBilling] = useState<"credits" | "subscription">(
    "subscription"
  );

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 pricing-gradient">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
          Buy credits or Go unlimited
        </h2>
        <p className="text-slate-500 mb-8">
          Refund Policy · Unlimited Calls · Cancel Anytime
        </p>

        {/* Toggle */}
        <div className="inline-flex bg-white rounded-full p-1 shadow-sm border border-border mb-10">
          <button
            onClick={() => setBilling("credits")}
            className={`px-5 py-1.5 rounded-full text-sm font-semibold transition ${
              billing === "credits"
                ? "bg-primary text-white"
                : "text-slate-600"
            }`}
          >
            Credits only
          </button>
          <button
            onClick={() => setBilling("subscription")}
            className={`px-5 py-1.5 rounded-full text-sm font-semibold transition ${
              billing === "subscription"
                ? "bg-primary text-white"
                : "text-slate-600"
            }`}
          >
            Subscription
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Monthly */}
          <div className="bg-white rounded-2xl border border-border p-6 text-left shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-1">Monthly</p>
            <p className="text-4xl font-extrabold text-slate-900 mb-1">
              ₹9,470
              <span className="text-base font-normal text-slate-400">/mo</span>
            </p>
            <p className="text-xs text-slate-400 mb-4">~$113 USD</p>
            <ul className="space-y-2 mb-6 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <CheckIcon /> Unlimited Calls
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon /> All AI models
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon /> Desktop + Mobile
              </li>
            </ul>
            <a
              href="#subscribe"
              className="block w-full text-center bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-full transition"
            >
              Subscribe
            </a>
          </div>

          {/* Yearly — best value */}
          <div className="bg-white rounded-2xl border-2 border-primary p-6 text-left shadow-lg relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-0.5 rounded-full">
              Best Value
            </span>
            <p className="text-sm font-medium text-slate-500 mb-1">Yearly</p>
            <p className="text-4xl font-extrabold text-slate-900 mb-1">
              ₹57,300
              <span className="text-base font-normal text-slate-400">/yr</span>
            </p>
            <p className="text-xs text-green-600 font-medium mb-4">
              Unlimited Calls · Save 50%
            </p>
            <ul className="space-y-2 mb-6 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <CheckIcon /> Unlimited Calls
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon /> All AI models
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon /> Priority support
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon /> Desktop + Mobile
              </li>
            </ul>
            <a
              href="#subscribe"
              className="block w-full text-center bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 rounded-full transition shadow-md shadow-green-200"
            >
              Subscribe
            </a>
          </div>
        </div>

        <p className="mt-8 text-xs text-slate-400">
          Accepted: Visa · Mastercard · Amex · Apple Pay · Google Pay · UPI ·
          PayPal
        </p>
      </div>
    </section>
  );
}
