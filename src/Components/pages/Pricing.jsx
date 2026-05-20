import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPublicPlans } from "../../services/pricingApi";
import Header from "../Header";
import Footer from "../Layout/Footer";
import { Check, Sparkles } from "lucide-react";

function Pricing() {
  const navigate = useNavigate();
  const [billing, setBilling] = useState("monthly");
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const data = await getPublicPlans();
      setPlans(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleGetStarted = (planName) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    navigate(`/checkout?plan=${planName}&billing=${billing}`);
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </main>
      <Footer />
    </div>
  );

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
              <button onClick={() => setBilling("monthly")} className={`px-6 py-2 rounded-full font-medium transition ${billing === "monthly" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                Monthly
              </button>
              <button onClick={() => setBilling("yearly")} className={`px-6 py-2 rounded-full font-medium transition ${billing === "yearly" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                Yearly {plans.some(p => p.discount_percentage > 0) && <span className="text-sm">(Save up to {Math.max(...plans.map(p => p.discount_percentage))}%)</span>}
              </button>
            </div>
          </div>

          {/* Pricing cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => {
              const price = billing === "monthly" ? plan.price_monthly : plan.price_yearly;
              const originalPrice = billing === "monthly" 
                ? plan.price_monthly 
                : plan.price_yearly / (1 - plan.discount_percentage / 100);

              return (
                <div key={plan.id} className={`relative bg-white rounded-2xl p-8 shadow transition hover:shadow-lg ${plan.is_popular ? "border-blue-600 scale-105 border-2" : "border-gray-200 border-2"}`}>
                  {plan.is_popular && (
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Sparkles className="w-4 h-4" /> Most Popular
                    </span>
                  )}
                  
                  <h3 className="text-2xl font-bold mb-2">{plan.display_name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">${price}</span>
                      <span className="text-base font-medium text-gray-500">/{billing === "monthly" ? "mo" : "yr"}</span>
                    </div>
                    {plan.discount_percentage > 0 && billing === "yearly" && (
                      <div className="mt-1">
                        <span className="text-gray-400 line-through text-sm">${originalPrice.toFixed(0)}</span>
                        <span className="text-green-600 text-sm font-medium ml-2">Save {plan.discount_percentage}%</span>
                      </div>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={() => handleGetStarted(plan.name)} 
                    className={`w-full py-3 rounded-lg font-semibold transition ${plan.is_popular ? "bg-blue-600 text-white hover:bg-blue-700" : "border-2 border-blue-600 text-blue-600 hover:bg-blue-50"}`}
                  >
                    Get Started
                  </button>
                </div>
              );
            })}
          </div>

          {plans.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              No plans available at the moment.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Pricing;