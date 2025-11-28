import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Button from "./components/Button";

export default function Home({ onNavigate, onLogout }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header onLogout={onLogout} onNavigate={onNavigate} currentPage="home" />

      <main className="flex-1 bg-gray-900 overflow-auto">
        {/* Banner Section */}
        <div className="relative w-full h-96 bg-linear-to-r from-blue-600 to-purple-600 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{
              backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400"><rect fill="%23000" width="1200" height="400"/><circle cx="200" cy="100" r="80" fill="%23ffffff" opacity="0.1"/><circle cx="1000" cy="300" r="120" fill="%23ffffff" opacity="0.1"/><rect x="100" y="150" width="200" height="200" fill="%23ffffff" opacity="0.05"/></svg>')`,
            }}
          />
          <div className="relative flex items-center justify-center h-full">
            <div className="text-center px-6">
              <h1 className="text-5xl font-bold text-white mb-4">
                PharmaCare
              </h1>
              <p className="text-xl text-gray-100 mb-8">
                Efficient Pharmacy Medicine Inventory Management System
              </p>
              <Button
                onClick={() => onNavigate("inventory")}
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
              >
                Get Started →
              </Button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">
            Why Choose PharmaCare?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Easy Inventory Management
              </h3>
              <p className="text-gray-400">
                Track and manage your medicine inventory with ease. Add, edit, and delete medicines in seconds.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Secure & Reliable
              </h3>
              <p className="text-gray-400">
                Your data is protected with modern security protocols. Focus on your pharmacy operations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Fast & Efficient
              </h3>
              <p className="text-gray-400">
                Quick search, filter, and organize medicines. Optimized for speed and performance.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-linear-to-r from-blue-600 to-purple-600 py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Streamline Your Pharmacy?
            </h2>
            <p className="text-gray-100 mb-8 text-lg">
              Start managing your medicine inventory efficiently today.
            </p>
            <Button
              onClick={() => onNavigate("inventory")}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
            >
              Go to Inventory →
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
