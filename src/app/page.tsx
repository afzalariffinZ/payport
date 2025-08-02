
"use client";
export default function Home() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <header className="w-full flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" /></svg>
          </div>
          <span className="text-2xl font-bold text-gray-900">PayPort Real</span>
        </div>
        <div className="flex gap-3">
          <button
            className="bg-white border border-pink-500 text-pink-600 hover:bg-pink-50 font-semibold py-2 px-6 rounded-lg text-base transition"
            onClick={() => { window.location.href = '/dashboard'; }}
            type="button"
          >
            Sign In
          </button>
          <a href="/register" className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-lg text-base transition">Sign Up</a>
        </div>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-4 w-full">
        <div className="w-full max-w-4xl flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 text-center leading-tight">AI for Modern Merchants</h1>
          <p className="text-lg md:text-xl text-gray-600 text-center mb-10 max-w-2xl">
            PayPort is an AI-powered platform for merchants, offering seamless digital and physical store management. Automate onboarding, edit your data, manage menus, and get proactive business insights—all in one place.
          </p>

          {/* Bento Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-12">
            <div className="rounded-2xl border border-gray-100 shadow-sm p-8 bg-gradient-to-br from-pink-50 to-white flex flex-col gap-3 min-h-[180px]">
              <h3 className="font-semibold text-pink-600 text-lg mb-1">Automatic Sign Up</h3>
              <p className="text-gray-700 text-base">Register your business on Grab, Foodpanda, and more with a single click.</p>
            </div>
            <div className="rounded-2xl border border-gray-100 shadow-sm p-8 bg-gradient-to-br from-pink-50 to-white flex flex-col gap-3 min-h-[180px]">
              <h3 className="font-semibold text-pink-600 text-lg mb-1">AI Data Editor</h3>
              <p className="text-gray-700 text-base">Easily update your store data, menu, and photos using AI assistance.</p>
            </div>
            <div className="rounded-2xl border border-gray-100 shadow-sm p-8 bg-gradient-to-br from-pink-50 to-white flex flex-col gap-3 min-h-[180px]">
              <h3 className="font-semibold text-pink-600 text-lg mb-1">Smart Navigator</h3>
              <p className="text-gray-700 text-base">Let AI guide you to the right page or feature instantly.</p>
            </div>
            <div className="rounded-2xl border border-gray-100 shadow-sm p-8 bg-gradient-to-br from-pink-50 to-white flex flex-col gap-3 min-h-[180px]">
              <h3 className="font-semibold text-pink-600 text-lg mb-1">Proactive Loan & Investment</h3>
              <p className="text-gray-700 text-base">Get notified about business loans and investment opportunities.</p>
            </div>
            <div className="rounded-2xl border border-gray-100 shadow-sm p-8 bg-gradient-to-br from-pink-50 to-white flex flex-col gap-3 min-h-[180px]">
              <h3 className="font-semibold text-pink-600 text-lg mb-1">Document Directory</h3>
              <p className="text-gray-700 text-base">Store and manage all your business documents securely in one place.</p>
            </div>
            <div className="rounded-2xl border border-gray-100 shadow-sm p-8 bg-gradient-to-br from-pink-50 to-white flex flex-col gap-3 min-h-[180px]">
              <h3 className="font-semibold text-pink-600 text-lg mb-1">Multilingual</h3>
              <p className="text-gray-700 text-base">Use PayPort in your preferred language for a seamless experience.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="w-full py-6 text-center text-sm text-gray-500 bg-transparent mt-0">
        © 2024 PayPort Real. All rights reserved.
      </footer>
    </main>
  );
}
