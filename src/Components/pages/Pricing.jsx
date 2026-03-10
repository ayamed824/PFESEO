// frontend/src/Components/pages/Pricing.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import Footer from "../Layout/Footer";

function Pricing() {
  const navigate = useNavigate();
  const [billing, setBilling] = useState("monthly");
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [payment, setPayment] = useState({ name: "", card: "", expiry: "", cvv: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const plans = [
    { name: "Starter", priceMonthly: 19, priceYearly: 190, description: "Perfect for small projects", features: ["10 analyses","10 pages per analysis","Community support"], popular: false },
    { name: "Pro", priceMonthly: 49, priceYearly: 490, description: "Best for freelancers", features: ["100 analyses","Unlimited pages per analysis","Priority support","Advanced recommendations"], popular: true },
    { name: "Enterprise", priceMonthly: 99, priceYearly: 990, description: "For agencies & teams", features: ["Unlimited analyses","Unlimited pages","Team collaboration","Dedicated support"], popular: false },
  ];

  const handleGetStarted = (plan) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePaymentChange = (e) => setPayment({ ...payment, [e.target.name]: e.target.value });

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:8000/api/subscriptions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          plan_id: selectedPlan.toLowerCase(),
          billing_cycle: billing,
          customer_info: { name: payment.name, cardNumber: payment.card, expiry: payment.expiry, cvv: payment.cvv }
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => { setShowPayment(false); navigate("/"); }, 3000);
      } else {
        alert(data.detail || "Payment failed");
      }

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Professional Pricing</h1>
            <p className="text-xl text-gray-600">Choose your plan. Upgrade anytime. Payments are secure.</p>
          </div>
          {/* Billing toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-white shadow rounded-full p-1 flex">
              <button onClick={()=>setBilling("monthly")} className={`px-6 py-2 rounded-full font-medium ${billing==="monthly"?"bg-blue-600 text-white":"text-gray-600"}`}>Monthly</button>
              <button onClick={()=>setBilling("yearly")} className={`px-6 py-2 rounded-full font-medium ${billing==="yearly"?"bg-blue-600 text-white":"text-gray-600"}`}>Yearly <span className="text-sm">(Save 20%)</span></button>
            </div>
          </div>
          {/* Pricing cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan,i)=>(
              <div key={i} className={`relative bg-white rounded-2xl p-8 shadow ${plan.popular?"border-blue-600 scale-105 border-2":"border-gray-200 border-2"}`}>
                {plan.popular && <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm">Most Popular</span>}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <div className="text-4xl font-bold mb-6">${billing==="monthly"?plan.priceMonthly:plan.priceYearly}<span className="text-base font-medium text-gray-500">/{billing==="monthly"?"mo":"yr"}</span></div>
                <ul className="space-y-3 mb-8">{plan.features.map((f,i)=><li key={i} className="flex items-center text-gray-700"><i className="fa-solid fa-check text-green-500 mr-3"></i>{f}</li>)}</ul>
                <button onClick={()=>handleGetStarted(plan.name)} className={`w-full py-3 rounded-lg font-semibold ${plan.popular?"bg-blue-600 text-white hover:bg-blue-700":"border border-blue-600 text-blue-600 hover:bg-blue-50"} transition`}>Get Started</button>
              </div>
            ))}
          </div>
          {/* Payment modal */}
          {showPayment && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
              {!success ? (
                <form onSubmit={handlePaymentSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                  <h2 className="text-2xl font-bold text-center mb-4">Complete Subscription — {selectedPlan}</h2>
                  <input type="text" name="name" placeholder="Card Holder Name" value={payment.name} onChange={handlePaymentChange} className="w-full border p-2 mb-3 rounded" required />
                  <input type="text" name="card" placeholder="Card Number" value={payment.card} onChange={handlePaymentChange} className="w-full border p-2 mb-3 rounded" required />
                  <div className="flex gap-3">
                    <input type="text" name="expiry" placeholder="MM/YY" value={payment.expiry} onChange={handlePaymentChange} className="w-1/2 border p-2 rounded" required />
                    <input type="text" name="cvv" placeholder="CVV" value={payment.cvv} onChange={handlePaymentChange} className="w-1/2 border p-2 rounded" required />
                  </div>
                  <button type="submit" disabled={submitting} className="w-full mt-5 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">{submitting?"Processing...":"Confirm Payment"}</button>
                </form>
              ) : (
                <div className="bg-white rounded-xl p-8 shadow-lg w-full max-w-md text-center">
                  <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Subscription Activated!</h2>
                  <p className="mb-2 text-gray-700">Welcome to the <strong>{selectedPlan}</strong> plan.</p>
                  <p className="mb-4 text-gray-500">Duration: {billing==="monthly"?"1 Month":"1 Year"}</p>
                  <p className="text-gray-400">Redirecting to home...</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Pricing;