import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getPublicPlans } from "../../services/pricingApi";
import Header from "../Header";
import Footer from "../Layout/Footer";
import { CreditCard, Lock, Check, ArrowLeft, Sparkles } from "lucide-react";

function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planName = searchParams.get("plan");
  const billing = searchParams.get("billing") || "monthly";

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Formulaire paiement
  const [payment, setPayment] = useState({
    cardHolder: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    try {
      const plans = await getPublicPlans();
      const found = plans.find((p) => p.name === planName);
      setPlan(found);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formatted = value;

    // Formatage carte
    if (name === "cardNumber") {
      formatted = value.replace(/\D/g, "").slice(0, 16);
      formatted = formatted.replace(/(\d{4})(?=\d)/g, "$1 ");
    }
    // Formatage expiry
    if (name === "expiry") {
      formatted = value.replace(/\D/g, "").slice(0, 4);
      if (formatted.length >= 2) {
        formatted = formatted.slice(0, 2) + "/" + formatted.slice(2);
      }
    }
    // Formatage CVV
    if (name === "cvv") {
      formatted = value.replace(/\D/g, "").slice(0, 4);
    }

    setPayment({ ...payment, [name]: formatted });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!payment.cardHolder.trim()) newErrors.cardHolder = "Card holder name required";
    if (payment.cardNumber.replace(/\s/g, "").length < 16) newErrors.cardNumber = "Invalid card number";
    if (payment.expiry.length < 5) newErrors.expiry = "Invalid expiry date";
    if (payment.cvv.length < 3) newErrors.cvv = "Invalid CVV";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:8000/api/subscriptions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan_id: planName,
          billing_cycle: billing,
          customer_info: {
            name: payment.cardHolder,
            cardNumber: payment.cardNumber.replace(/\s/g, ""),
            expiry: payment.expiry,
            cvv: payment.cvv,
          },
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => navigate("/dashboard"), 3000);
      } else {
        alert(data.detail || "Payment failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Plan not found</p>
            <button onClick={() => navigate("/pricing")} className="text-blue-600 hover:underline">
              Back to pricing
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const price = billing === "monthly" ? plan.price_monthly : plan.price_yearly;

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="bg-white rounded-2xl p-12 shadow-lg text-center max-w-md">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h2>
            <p className="text-gray-600 mb-2">
              You subscribed to <strong>{plan.display_name}</strong> plan
            </p>
            <p className="text-gray-500 mb-6">
              {billing === "monthly" ? "Monthly" : "Yearly"} billing • ${price}
            </p>
            <p className="text-gray-400 text-sm">Redirecting to dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow py-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Back button */}
          <button
            onClick={() => navigate("/pricing")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to plans
          </button>

          <div className="grid md:grid-cols-5 gap-8">
            {/* Formulaire paiement */}
            <div className="md:col-span-3">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Payment Details</h2>
                    <p className="text-sm text-gray-500">Complete your subscription</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Card Holder */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Holder Name
                    </label>
                    <input
                      type="text"
                      name="cardHolder"
                      value={payment.cardHolder}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                        errors.cardHolder ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.cardHolder && <p className="text-red-500 text-xs mt-1">{errors.cardHolder}</p>}
                  </div>

                  {/* Card Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="cardNumber"
                        value={payment.cardNumber}
                        onChange={handleChange}
                        placeholder="1234 5678 9012 3456"
                        className={`w-full border rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                          errors.cardNumber ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      <Lock className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
                    </div>
                    {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                  </div>

                  {/* Expiry + CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="expiry"
                        value={payment.expiry}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                          errors.expiry ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={payment.cvv}
                        onChange={handleChange}
                        placeholder="123"
                        className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                          errors.cvv ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>Pay ${price}</>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Lock className="w-4 h-4" />
                    Secure SSL encryption
                  </div>
                </form>
              </div>
            </div>

            {/* Récapitulatif */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-24">
                <h3 className="text-lg font-bold mb-4">Order Summary</h3>

                <div className={`p-4 rounded-xl mb-4 ${plan.is_popular ? "bg-blue-50 border border-blue-200" : "bg-gray-50"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {plan.is_popular && <Sparkles className="w-4 h-4 text-blue-600" />}
                    <span className="font-bold text-lg">{plan.display_name}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">${price}</span>
                    <span className="text-gray-500">/{billing === "monthly" ? "mo" : "yr"}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${price}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${price}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Checkout;