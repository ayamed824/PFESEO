import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function WelcomeModal({ isOpen, plan, billing, onClose }) {
  const navigate = useNavigate();

  // Fermer automatiquement après 5 secondes
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        navigate("/dashboard");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, navigate]);

  if (!isOpen) return null;

  // Texte personnalisé selon le plan
  const planMessages = {
    starter: "Parfait pour débuter votre aventure SEO !",
    pro: "Vous avez choisi le plan le plus populaire 🔥",
    enterprise: "Bienvenue dans l'élite du SEO ! 🏆"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-10 w-full max-w-lg shadow-2xl text-center relative animate-fade-in">
        
        {/* Confetti / Étoiles décoratives */}
        <div className="absolute top-4 left-4 text-2xl">✨</div>
        <div className="absolute top-4 right-4 text-2xl">🎊</div>
        <div className="absolute bottom-4 left-4 text-2xl">🌟</div>
        <div className="absolute bottom-4 right-4 text-2xl">🚀</div>

        {/* Icône principale */}
        <div className="text-6xl mb-6 animate-bounce">🌍</div>

        {/* Titre principal */}
        <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
          Welcome to our world
        </h2>

        {/* Sous-titre */}
        <p className="text-xl text-gray-700 mb-6">
          Merci d'avoir rejoint l'aventure ! 🎉
        </p>

        {/* Info plan */}
        <div className="bg-blue-50 rounded-xl p-5 mb-6">
          <p className="text-blue-800 font-medium">
            ✅ Plan <strong>{plan?.name}</strong> activé ({plan?.price}/{billing === "monthly" ? "mois" : "an"})
          </p>
          <p className="text-blue-600 text-sm mt-2">
            {planMessages[plan?.id] || "Prêt à optimiser votre SEO ?"}
          </p>
        </div>

        {/* Avantages du plan */}
        <ul className="text-left text-gray-700 space-y-2 mb-8">
          <li className="flex items-center gap-2">
            <i className="fa-solid fa-check-circle text-green-500"></i>
            Analyses SEO illimitées
          </li>
          <li className="flex items-center gap-2">
            <i className="fa-solid fa-check-circle text-green-500"></i>
            Agents intelligents activés
          </li>
          <li className="flex items-center gap-2">
            <i className="fa-solid fa-check-circle text-green-500"></i>
            Rapports exportables en PDF
          </li>
        </ul>

        {/* Bouton d'action */}
        <button
          onClick={() => {
            onClose?.();
            navigate("/dashboard");
          }}
          className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-rocket"></i>
          Accéder au Dashboard
        </button>

        {/* Lien vers aide */}
        <p className="text-sm text-gray-500 mt-4">
          Besoin d'aide ? <a href="/help" className="text-blue-600 hover:underline">Consultez notre guide</a>
        </p>

      </div>
    </div>
  );
}