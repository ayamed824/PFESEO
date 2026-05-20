import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Tag, Package, ToggleLeft, ToggleRight, Save, X } from 'lucide-react';
import { getPlans, createPlan, updatePlan, deletePlan, getOffers, createOffer, updateOffer, deleteOffer } from '../../services/pricingApi';

function AdminPricing() {
  const [activeTab, setActiveTab] = useState('plans');
  const [plans, setPlans] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'plan' ou 'offer'
  const [editingItem, setEditingItem] = useState(null);

  // Formulaire plan
  const [planForm, setPlanForm] = useState({
    name: '', display_name: '', description: '',
    price_monthly: '', price_yearly: '', discount_percentage: 0,
    features: [], is_active: true, is_popular: false, order: 0
  });
  const [featureInput, setFeatureInput] = useState('');

  // Formulaire offre
  const [offerForm, setOfferForm] = useState({
    code: '', name: '', description: '',
    discount_percentage: '', applicable_plans: [],
    valid_from: '', valid_until: '', max_uses: '', is_active: true
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [plansData, offersData] = await Promise.all([getPlans(), getOffers()]);
      setPlans(plansData);
      setOffers(offersData);
    } catch (err) {
      console.error(err);
      alert('Error loading data');
    }
    setLoading(false);
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    if (type === 'plan') {
      setPlanForm(item ? { ...item, features: [...item.features] } : {
        name: '', display_name: '', description: '',
        price_monthly: '', price_yearly: '', discount_percentage: 0,
        features: [], is_active: true, is_popular: false, order: plans.length + 1
      });
    } else {
      setOfferForm(item ? {
        ...item,
        valid_from: item.valid_from?.split('T')[0] || '',
        valid_until: item.valid_until?.split('T')[0] || ''
      } : {
        code: '', name: '', description: '',
        discount_percentage: '', applicable_plans: [],
        valid_from: '', valid_until: '', max_uses: '', is_active: true
      });
    }
    setShowModal(true);
  };

  const handleSavePlan = async () => {
    try {
      const data = {
        ...planForm,
        price_monthly: parseFloat(planForm.price_monthly),
        price_yearly: parseFloat(planForm.price_yearly),
        discount_percentage: parseInt(planForm.discount_percentage),
        order: parseInt(planForm.order)
      };
      if (editingItem) {
        await updatePlan(editingItem.id, data);
      } else {
        await createPlan(data);
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Error saving plan');
    }
  };

  const handleSaveOffer = async () => {
    try {
      const data = {
        ...offerForm,
        discount_percentage: parseInt(offerForm.discount_percentage),
        max_uses: offerForm.max_uses ? parseInt(offerForm.max_uses) : null,
        valid_from: new Date(offerForm.valid_from).toISOString(),
        valid_until: new Date(offerForm.valid_until).toISOString()
      };
      if (editingItem) {
        await updateOffer(editingItem.id, data);
      } else {
        await createOffer(data);
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Error saving offer');
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm('Are you sure?')) return;
    try {
      if (type === 'plan') await deletePlan(id);
      else await deleteOffer(id);
      loadData();
    } catch (err) {
      alert('Error deleting');
    }
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setPlanForm({ ...planForm, features: [...planForm.features, featureInput.trim()] });
    setFeatureInput('');
  };

  const removeFeature = (idx) => {
    setPlanForm({ ...planForm, features: planForm.features.filter((_, i) => i !== idx) });
  };

  const togglePlan = async (plan) => {
    try {
      await updatePlan(plan.id, { is_active: !plan.is_active });
      loadData();
    } catch (err) {
      alert('Error updating plan');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">💰 Pricing Management</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b">
        <button
          onClick={() => setActiveTab('plans')}
          className={`px-6 py-3 font-medium flex items-center gap-2 ${activeTab === 'plans' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          <Package className="w-5 h-5" /> Plans
        </button>
        <button
          onClick={() => setActiveTab('offers')}
          className={`px-6 py-3 font-medium flex items-center gap-2 ${activeTab === 'offers' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          <Tag className="w-5 h-5" /> Offers & Promotions
        </button>
      </div>

      {/* PLANS TAB */}
      {activeTab === 'plans' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Subscription Plans</h2>
            <button onClick={() => openModal('plan')} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
              <Plus className="w-4 h-4" /> Add Plan
            </button>
          </div>

          <div className="grid gap-4">
            {plans.map(plan => (
              <div key={plan.id} className={`bg-white rounded-xl p-6 shadow border-2 ${plan.is_popular ? 'border-yellow-400' : 'border-gray-100'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{plan.display_name}</h3>
                      {plan.is_popular && <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-medium">⭐ Popular</span>}
                      {!plan.is_active && <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">Inactive</span>}
                    </div>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    
                    <div className="flex gap-8 mb-4">
                      <div>
                        <span className="text-sm text-gray-500">Monthly</span>
                        <p className="text-2xl font-bold text-blue-600">${plan.price_monthly}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Yearly</span>
                        <p className="text-2xl font-bold text-green-600">${plan.price_yearly}</p>
                      </div>
                      {plan.discount_percentage > 0 && (
                        <div>
                          <span className="text-sm text-gray-500">Discount</span>
                          <p className="text-lg font-bold text-purple-600">-{plan.discount_percentage}%</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {plan.features.map((f, i) => (
                        <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">✓ {f}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button onClick={() => openModal('plan', plan)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete('plan', plan.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => togglePlan(plan)} className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                      {plan.is_active ? <ToggleRight className="w-5 h-5 text-green-600" /> : <ToggleLeft className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* OFFERS TAB */}
      {activeTab === 'offers' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Promotional Offers</h2>
            <button onClick={() => openModal('offer')} className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700">
              <Plus className="w-4 h-4" /> Add Offer
            </button>
          </div>

          <div className="grid gap-4">
            {offers.map(offer => (
              <div key={offer.id} className={`bg-white rounded-xl p-6 shadow border-2 ${offer.is_active ? 'border-gray-100' : 'border-gray-200 opacity-60'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{offer.name}</h3>
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded font-mono text-sm">{offer.code}</span>
                      {!offer.is_active && <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">Inactive</span>}
                    </div>
                    <p className="text-gray-600 mb-3">{offer.description}</p>
                    
                    <div className="flex gap-6 text-sm">
                      <span className="text-green-600 font-bold text-lg">-{offer.discount_percentage}%</span>
                      <span className="text-gray-500">Valid: {new Date(offer.valid_from).toLocaleDateString()} → {new Date(offer.valid_until).toLocaleDateString()}</span>
                      <span className="text-gray-500">Uses: {offer.used_count}{offer.max_uses ? `/${offer.max_uses}` : ' (unlimited)'}</span>
                    </div>
                    
                    {offer.applicable_plans.length > 0 && (
                      <div className="mt-2 flex gap-2">
                        {offer.applicable_plans.map(p => (
                          <span key={p} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">{p}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button onClick={() => openModal('offer', offer)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete('offer', offer.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold">{editingItem ? 'Edit' : 'Add'} {modalType === 'plan' ? 'Plan' : 'Offer'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {modalType === 'plan' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">System Name (unique)</label>
                      <input value={planForm.name} onChange={e => setPlanForm({...planForm, name: e.target.value})} className="w-full border rounded-lg p-2" disabled={!!editingItem} placeholder="starter" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Display Name</label>
                      <input value={planForm.display_name} onChange={e => setPlanForm({...planForm, display_name: e.target.value})} className="w-full border rounded-lg p-2" placeholder="Starter" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <input value={planForm.description} onChange={e => setPlanForm({...planForm, description: e.target.value})} className="w-full border rounded-lg p-2" />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Monthly Price ($)</label>
                      <input type="number" value={planForm.price_monthly} onChange={e => setPlanForm({...planForm, price_monthly: e.target.value})} className="w-full border rounded-lg p-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Yearly Price ($)</label>
                      <input type="number" value={planForm.price_yearly} onChange={e => setPlanForm({...planForm, price_yearly: e.target.value})} className="w-full border rounded-lg p-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Discount %</label>
                      <input type="number" min="0" max="100" value={planForm.discount_percentage} onChange={e => setPlanForm({...planForm, discount_percentage: e.target.value})} className="w-full border rounded-lg p-2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Features</label>
                    <div className="flex gap-2 mb-2">
                      <input value={featureInput} onChange={e => setFeatureInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && addFeature()} className="flex-1 border rounded-lg p-2" placeholder="Add a feature..." />
                      <button onClick={addFeature} className="bg-gray-100 px-4 rounded-lg hover:bg-gray-200">+</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {planForm.features.map((f, i) => (
                        <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                          {f}
                          <button onClick={() => removeFeature(i)} className="text-blue-400 hover:text-red-500">×</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={planForm.is_active} onChange={e => setPlanForm({...planForm, is_active: e.target.checked})} />
                      <span className="text-sm">Active</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={planForm.is_popular} onChange={e => setPlanForm({...planForm, is_popular: e.target.checked})} />
                      <span className="text-sm">Mark as Popular</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Display Order</label>
                    <input type="number" value={planForm.order} onChange={e => setPlanForm({...planForm, order: e.target.value})} className="w-full border rounded-lg p-2" />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Offer Code (unique)</label>
                      <input value={offerForm.code} onChange={e => setOfferForm({...offerForm, code: e.target.value})} className="w-full border rounded-lg p-2" disabled={!!editingItem} placeholder="SUMMER2024" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <input value={offerForm.name} onChange={e => setOfferForm({...offerForm, name: e.target.value})} className="w-full border rounded-lg p-2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <input value={offerForm.description} onChange={e => setOfferForm({...offerForm, description: e.target.value})} className="w-full border rounded-lg p-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Discount %</label>
                      <input type="number" min="0" max="100" value={offerForm.discount_percentage} onChange={e => setOfferForm({...offerForm, discount_percentage: e.target.value})} className="w-full border rounded-lg p-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Max Uses (empty = unlimited)</label>
                      <input type="number" value={offerForm.max_uses} onChange={e => setOfferForm({...offerForm, max_uses: e.target.value})} className="w-full border rounded-lg p-2" placeholder="100" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Valid From</label>
                      <input type="date" value={offerForm.valid_from} onChange={e => setOfferForm({...offerForm, valid_from: e.target.value})} className="w-full border rounded-lg p-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Valid Until</label>
                      <input type="date" value={offerForm.valid_until} onChange={e => setOfferForm({...offerForm, valid_until: e.target.value})} className="w-full border rounded-lg p-2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Applicable Plans (leave empty for all)</label>
                    <div className="flex gap-2 flex-wrap">
                      {['starter', 'pro', 'enterprise'].map(plan => (
                        <label key={plan} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                          <input type="checkbox" checked={offerForm.applicable_plans.includes(plan)} onChange={e => {
                            const plans = e.target.checked 
                              ? [...offerForm.applicable_plans, plan]
                              : offerForm.applicable_plans.filter(p => p !== plan);
                            setOfferForm({...offerForm, applicable_plans: plans});
                          }} />
                          <span className="text-sm capitalize">{plan}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={offerForm.is_active} onChange={e => setOfferForm({...offerForm, is_active: e.target.checked})} />
                    <span className="text-sm">Active</span>
                  </label>
                </>
              )}
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={modalType === 'plan' ? handleSavePlan : handleSaveOffer} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Save className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPricing;