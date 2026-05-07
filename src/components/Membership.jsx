import { useState, useEffect } from "react";
import axios from "axios";

const PLANS = [
  {
    id: "silver",
    name: "Silver",
    price: 99,
    color: "from-gray-400 to-gray-600",
    features: [
      "Unlimited swipes",
      "See who liked you",
      "Priority in feed",
      "Silver badge on profile"
    ]
  },
  {
    id: "gold",
    name: "Gold",
    price: 199,
    color: "from-yellow-400 to-yellow-600",
    features: [
      "Everything in Silver",
      "Real-time chat priority",
      "Profile boost",
      "Gold badge on profile",
      "Advanced filters"
    ]
  }
];

const Membership = () => {
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMembership();
    loadRazorpayScript();
  }, []);

  const loadRazorpayScript = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  };

  const fetchMembership = async () => {
    try {
      const { data } = await axios.get(
        "/api/payment/membership",
        { withCredentials: true }
      );
      setMembership(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBuyPlan = async (planId) => {
    setLoading(true);
    try {
      // Step 1: Create order
      const { data } = await axios.post(
        "/api/payment/create-order",
        { plan: planId },
        { withCredentials: true }
      );

      // Step 2: Open Razorpay checkout
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "DevTinder",
        description: `${data.planName} Membership`,
        order_id: data.orderId,
        handler: async (response) => {
          // Step 3: Verify payment
          try {
            const verify = await axios.post(
              "/api/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              },
              { withCredentials: true }
            );

            if (verify.data.success) {
              alert(`🎉 ${planId} membership activated!`);
              fetchMembership();
            }
          } catch (err) {
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: "DevTinder User",
        },
        theme: {
          color: planId === "gold" ? "#F59E0B" : "#6B7280"
        },
        modal: {
          ondismiss: () => setLoading(false)
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8 pt-24">
      <h1 className="text-3xl font-bold text-white text-center mb-2">
        Upgrade Your DevTinder
      </h1>
      <p className="text-gray-400 text-center mb-10">
        Unlock premium features with Gold or Silver
      </p>

      {/* Current membership status */}
      {membership && membership.plan !== "free" && (
        <div className="max-w-md mx-auto mb-8 p-4 bg-green-900
          border border-green-500 rounded-lg text-center">
          <p className="text-green-400 font-semibold">
            ✅ Active: {membership.plan.toUpperCase()} Plan
          </p>
          <p className="text-green-300 text-sm">
            Expires: {new Date(membership.expiryDate)
              .toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Plan cards */}
      <div className="flex flex-col md:flex-row
        gap-6 max-w-3xl mx-auto">
        {PLANS.map((plan) => (
          <div key={plan.id}
            className="flex-1 bg-gray-800 rounded-2xl
              overflow-hidden border border-gray-700">

            {/* Header */}
            <div className={`bg-gradient-to-r
              ${plan.color} p-6 text-center`}>
              <h2 className="text-2xl font-bold text-white">
                {plan.name}
              </h2>
              <p className="text-white text-4xl font-bold mt-2">
                ₹{plan.price}
                <span className="text-sm font-normal">/month</span>
              </p>
            </div>

            {/* Features */}
            <div className="p-6">
              <ul className="space-y-3 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i}
                    className="flex items-center text-gray-300">
                    <span className="text-green-400 mr-2">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleBuyPlan(plan.id)}
                disabled={loading ||
                  membership?.plan === plan.id}
                className={`w-full py-3 rounded-xl font-bold
                  text-white transition
                  ${membership?.plan === plan.id
                    ? "bg-gray-600 cursor-not-allowed"
                    : `bg-gradient-to-r ${plan.color}
                       hover:opacity-90`
                  }`}
              >
                {membership?.plan === plan.id
                  ? "Current Plan"
                  : loading ? "Processing..."
                  : `Get ${plan.name}`
                }
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Membership;