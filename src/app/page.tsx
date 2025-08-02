
"use client";
import { CometCard } from "@/components/ui/comet-card";
import { cn } from "@/lib/utils";
import { 
  Zap, 
  Edit3, 
  Navigation, 
  TrendingUp, 
  FolderOpen, 
  Globe,
  ArrowRight
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Zap,
      title: "One Click. Everywhere.",
      description: "Register once, conquer every platform. Grab, Foodpanda, Shopee all with a single tap. Because your time is worth more than paperwork.",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: Edit3,
      title: "AI That Gets You.",
      description: "Your business, your way. Our AI doesn't just edit it understands. Change menus, update photos, manage data. All through conversation.",
      color: "from-pink-500 to-rose-600"
    },
    {
      icon: Navigation,
      title: "Navigate Like Magic.",
      description: "Lost in your own platform? Never again. Our AI guides you exactly where you need to be. Intuitive. Instant. Invisible.",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: TrendingUp,
      title: "Opportunities Find You.",
      description: "Loans. Investments. Growth. We don't wait for you to ask we bring opportunities to your doorstep. Proactive. Personal. Powerful.",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: FolderOpen,
      title: "Everything. Everywhere.",
      description: "All your documents. All your data. All in one place. Secure. Organized. Accessible. Because chaos is not a business strategy.",
      color: "from-indigo-500 to-blue-600"
    },
    {
      icon: Globe,
      title: "Speak Your Language.",
      description: "English. Malay. Chinese. Whatever you speak, we speak it too. Because great ideas don't have language barriers.",
      color: "from-teal-500 to-cyan-600"
    }
  ];

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col relative">
      {/* Grid Background */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
        )}
      />
      {/* Radial gradient overlay for faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
              <header className="w-full flex justify-between items-center px-8 py-6 max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" /></svg>
          </div>
          <span className="text-2xl font-bold text-gray-900">PayPort</span>
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

      <section className="flex-1 flex flex-col items-center justify-center px-4 w-full relative z-10">
        <div className="w-full max-w-4xl flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 text-center leading-tight">Think Different. Sell Smarter.</h1>
          <p className="text-lg md:text-xl text-gray-600 text-center mb-10 max-w-2xl">
            PayPort doesn't just manage your business it revolutionizes it. With AI that thinks like you do, we're not building another platform. We're building the future of commerce. Simple. Powerful. Magical.
          </p>

          {/* Bento Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-12">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <CometCard 
                  key={index} 
                  className="fade-in-up" 
                  style={{animationDelay: `${index * 100}ms`}}
                  rotateDepth={20}
                  translateDepth={25}
                >
                  <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 min-h-[200px] flex flex-col gap-4 transition-all duration-300 hover:border-gray-300">
                    {/* Icon */}
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-xl mb-3 group-hover:text-gray-800 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-base leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                        {feature.description}
                      </p>
                    </div>
                    
                    {/* Arrow */}
                    <div className="flex justify-end">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-all duration-300 group-hover:scale-110">
                        <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-gray-800 transition-colors duration-300" />
                      </div>
                    </div>
                    
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
                  </div>
                </CometCard>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="w-full py-6 text-center text-sm text-gray-500 bg-transparent mt-0 relative z-10">
        © 2024 PayPort Real. All rights reserved.
      </footer>
    </main>
  );
}
