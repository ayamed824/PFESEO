import { api } from './api';

// Test rapide (à exécuter dans la console du navigateur)
console.log("🔍 Testing API service...");
console.log("✅ isAuthenticated:", api.isAuthenticated());
console.log("✅ Base URL:", api.getBaseUrl());

// Test async (nécessite un token valide)
// api.getProfile().then(console.log).catch(console.error);