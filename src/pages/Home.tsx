import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { GoogleGIcon, TrustpilotStar } from "@/components/icons/AIIcons";
import { OrbitBackground } from "@/components/landing/OrbitBackground";
import { ActivityStack } from "@/components/landing/ActivityStack";
import { PartnerLogos } from "@/components/landing/PartnerLogos";
import {
  FeaturesModal,
  PricingModal,
  SalesModal,
  ChangelogModal,
} from "@/components/landing/LandingModals";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen w-full bg-[#FAFAFC] dark:bg-[#090A0F] text-zinc-900 dark:text-white flex flex-col justify-between overflow-x-hidden selection:bg-violet-500/20 selection:text-violet-900 dark:selection:text-violet-100">
      {/* ----------------- TOP FLOATING NAVBAR ----------------- */}
      <header className="sticky top-4 sm:top-6 z-50 w-full px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/70 dark:border-zinc-800/80 rounded-full shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all">
          {/* Logo & Brand Name */}
          <Link
            to={isAuthenticated ? "/chat" : "/"}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src="/brain_hop.png"
                alt="Brain Hop Logo"
                className="w-8 h-12 object-cover object-top -mt-0.5 group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center">
              <span>Brain</span>
              <span className="ml-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                Hop
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Hidden on small mobile, visible on md+) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            <button
              onClick={() => setActiveModal("features")}
              className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              Features
            </button>
            <Link
              to={isAuthenticated ? "/models" : "/signup"}
              className="hover:text-zinc-950 dark:hover:text-white transition-colors"
            >
              Models
            </Link>
            <button
              onClick={() => setActiveModal("pricing")}
              className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              Pricing
            </button>
            <button
              onClick={() => setActiveModal("features")}
              className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              Docs
            </button>
            <button
              onClick={() => setActiveModal("changelog")}
              className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              Changelog
            </button>
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {!isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  asChild
                  className="rounded-full text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white px-3 sm:px-4 h-9"
                >
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button
                  asChild
                  className="rounded-full bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 px-4 sm:px-5 h-9 text-xs sm:text-sm font-medium shadow-sm transition-all"
                >
                  <Link to="/signup">Get Started</Link>
                </Button>
              </>
            ) : (
              <Button
                asChild
                className="rounded-full bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 px-5 h-9 text-sm font-medium shadow-sm"
              >
                <Link to="/chat">Open Chat</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* ----------------- HERO & ORBIT SECTION ----------------- */}
      <main className="relative flex-1 flex flex-col items-center justify-center w-full px-4 pt-12 pb-6 md:pt-16 md:pb-10">
        {/* Orbital Rings & AI Model Badges Background */}
        <OrbitBackground />

        {/* Center Hero Content Container */}
        <div className="relative z-20 flex flex-col items-center text-center max-w-3xl mx-auto pointer-events-auto">
          {/* Rating Badges */}
          <div className="inline-flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-[13px] font-medium text-zinc-600 dark:text-zinc-300 mb-5 sm:mb-6 select-none">
            <div className="flex items-center gap-1.5">
              <GoogleGIcon className="w-4 h-4" />
              <span className="font-bold text-zinc-900 dark:text-white">4.9</span>
              <span className="text-zinc-500 dark:text-zinc-400">Google</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrustpilotStar className="w-3.5 h-3.5" />
              <span className="font-bold text-zinc-900 dark:text-white">4.8</span>
              <span className="text-zinc-500 dark:text-zinc-400">Trustpilot</span>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[62px] font-extrabold tracking-[-0.035em] text-zinc-900 dark:text-white leading-[1.08] max-w-2xl">
            AI-powered workspace to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              hop
            </span>{" "}
            across top models
          </h1>

          {/* Subtitle */}
          <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-zinc-500 dark:text-zinc-400 max-w-lg leading-relaxed font-normal">
            Chat with the best AI models, merge conversations, and build a semantic memory that works for you.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-3.5 mt-7 sm:mt-8">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 px-6 sm:px-7 h-11 text-sm sm:text-[15px] font-medium shadow-md transition-all hover:scale-[1.02]"
            >
              <Link to="/signup">Get started free</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setActiveModal("sales")}
              className="rounded-full bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 px-6 sm:px-7 h-11 text-sm sm:text-[15px] font-medium shadow-sm transition-all"
            >
              Talk to sales team
            </Button>
          </div>

          {/* Stacked Activity Notification Cards */}
          <ActivityStack />
        </div>
      </main>

      {/* ----------------- BOTTOM SOCIAL PROOF / LOGOS ----------------- */}
      <footer className="relative z-20 w-full">
        <PartnerLogos />
      </footer>

      {/* ----------------- MODALS ----------------- */}
      <FeaturesModal
        isOpen={activeModal === "features"}
        onClose={() => setActiveModal(null)}
      />
      <PricingModal
        isOpen={activeModal === "pricing"}
        onClose={() => setActiveModal(null)}
      />
      <SalesModal
        isOpen={activeModal === "sales"}
        onClose={() => setActiveModal(null)}
      />
      <ChangelogModal
        isOpen={activeModal === "changelog"}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}
