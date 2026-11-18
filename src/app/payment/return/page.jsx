"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import api from "@/service/api";

export default function PaymentReturnPage() {
  const [paymentStatus, setPaymentStatus] = useState("loading");
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const cashfreeOrderId = params.get("order_id");

  if (!cashfreeOrderId) {
    setPaymentStatus("failed");
    return;
  }

  setOrderId(cashfreeOrderId);

  let cancelled = false;

  const verifyPayment = async () => {
    try {
      for (let attempt = 0; attempt < 10; attempt++) {
        if (cancelled) return;

        const response = await api.get(
          `/payment/cashfree/status/${encodeURIComponent(cashfreeOrderId)}`
        );
        console.log(response.data);

        if (cancelled) return;
        const status = response.data.paymentStatus;


        // Payment successful
        if (status === "SUCCESS") {
          setPaymentStatus("success");
          return; // STOP LOOP
        }

        // Payment failed
        if (status === "FAILED") {
          setPaymentStatus("failed");
          return; // STOP LOOP
        }

        // Payment still pending
        if (status === "PENDING") {
          setPaymentStatus("pending");

          // Wait 2 seconds before retrying
          if (attempt < 9) {
            await new Promise((resolve) =>
              setTimeout(resolve, 2000)
            );
          }

          continue;
        }

        // Still pending: wait 2 seconds and retry.
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      if (!cancelled) {
        setPaymentStatus("pending");
      }
    } catch (error) {
      console.error("Payment verification error:", error);

      if (!cancelled) {
        // Verification error is not proof of payment failure.
        setPaymentStatus("pending");
      }
    }
  };

  verifyPayment();

  return () => {
    cancelled = true;
  };
}, []);

  if (paymentStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Verifying your payment, please wait...</p>
      </div>
    );
  }

  if (paymentStatus === "success") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-soft-lg">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Order Confirmed
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold mt-4 mb-2">
            Thank you for your order!
          </h1>

          <p className="text-stone-500 mb-8">
            Your payment was successful.
            <br />
            Order Reference:{" "}
            <strong className="font-mono text-stone-900">{orderId}</strong>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/account" className="w-full sm:w-auto">
              <button className="w-full px-6 py-3 rounded-xl bg-stone-900 text-white">
                View Order in Account
                <ArrowRight className="inline w-4 h-4 ml-2" />
              </button>
            </Link>

            <Link href="/products" className="w-full sm:w-auto">
              <button className="w-full px-6 py-3 rounded-xl border border-stone-300">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === "pending") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Payment is processing</h1>
        <p className="mt-3 text-stone-500">
          Your payment has not been confirmed yet. Please check your account
          shortly.
        </p>
        <Link href="/account" className="mt-6 underline">
          Go to Account
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-red-600">
        Payment Failed or Could Not Be Verified
      </h1>
      <p className="mt-3 text-stone-500">
        Please check your payment status in your account before trying again.
      </p>
      <Link href="/account" className="mt-6 underline">
        Go to Account
      </Link>
    </div>
  );
}