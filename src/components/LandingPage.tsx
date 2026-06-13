/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Shield, Eye, Lock, Zap, Check, Smartphone, GraduationCap, ChevronRight, Settings } from "lucide-react";
import { SubscriptionPlan } from "../types";

interface LandingProps {
  onStartParent: () => void;
  onStartChild: () => void;
  subscription: SubscriptionPlan;
}

export default function LandingPage({ onStartParent, onStartChild, subscription }: LandingProps) {
  return (
    <div id="landing-page" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Hero Banner Section */}
      <header className="relative overflow-hidden border-b border-slate-800 bg-linear-to-b from-purple-950/20 to-transparent">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <Shield className="w-3.5 h-3.5 text-purple-400" /> Active Threat Protection Platform
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight bg-linear-to-r from-white via-purple-100 to-purple-400 bg-clip-text text-transparent mb-6 uppercase">
            Spykids <span className="text-pink-500">Guardian</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 mb-10 leading-relaxed">
            Protect your children from digital predators, grooming, bullying, and online hazards without turning your relationship into an intrusive surveillance state.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onStartParent}
              id="cta-parent"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 active:translate-y-0.5 cursor-pointer"
            >
              <Smartphone className="w-5 h-5" /> Launch Parent Portal
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={onStartChild}
              id="cta-child"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-semibold hover:bg-slate-700 transition-all flex items-center justify-center gap-2 active:translate-y-0.5 cursor-pointer"
            >
              <GraduationCap className="w-5 h-5 text-pink-400" /> Open Child Companion Screen
            </button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-purple-400" /> Visible Companion App
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-pink-400" /> Privacy & Consent Honored
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-400" /> Live AI Risk Assessment
            </div>
          </div>
        </div>
      </header>

      {/* Core Principles */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 tracking-wide uppercase text-slate-200">
          Why Spykids is <span className="text-purple-400">Ethical Safety</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl backdrop-blur-xs">
            <div className="w-12 h-12 rounded-lg bg-purple-950/50 border border-purple-500/20 flex items-center justify-center mb-6 text-purple-400">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">No Stealth Surveillance</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Stalkerware ruins mutual parent-child trust. Spykids is clearly visible on your child's phone with active transparency. The child is always aware it is keeping them safe.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl backdrop-blur-xs">
            <div className="w-12 h-12 rounded-lg bg-pink-950/50 border border-pink-500/20 flex items-center justify-center mb-6 text-pink-400">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Minimal Data Retention</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              We never collect or compile chat summaries, call audio, or complete conversation logs. Normal interactions are fully private. Only high-risk signals create temporary parental alerts.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl backdrop-blur-xs">
            <div className="w-12 h-12 rounded-lg bg-orange-950/50 border border-orange-500/20 flex items-center justify-center mb-6 text-orange-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Intelligent Risk Analysis</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Powered by advanced Google Gemini models. Analyses keywords, sender context, and behavioral anomalies to grade safety risks (0-100 score). Only scores above 70 flag a parent alert.
            </p>
          </div>
        </div>
      </section>

      {/* Subscription matrix */}
      <section className="bg-slate-900/20 py-16 border-t border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-normal uppercase text-slate-200">Subscription Plans</h2>
            <p className="text-slate-400 mt-2 text-sm">Flexible levels suited to your household's digital lifestyle.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div>
                <h4 className="text-xs uppercase text-slate-500 tracking-wider font-bold mb-2">Free Protection</h4>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold">£0.00</span>
                  <span className="text-slate-500 text-sm">/mo</span>
                </div>
                <hr className="border-slate-800 my-4" />
                <ul className="space-y-3.5 text-sm mb-8 text-slate-400">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> 1 Device Pairing</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Basic Danger Keyword Scans</li>
                  <li className="flex items-center gap-2 text-slate-600"><Check className="w-4 h-4" /> Comprehensive Risk Scoring</li>
                  <li className="flex items-center gap-2 text-slate-600"><Check className="w-4 h-4" /> Dynamic Geofencing Mapping</li>
                </ul>
              </div>
              <button onClick={onStartParent} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm transition-all cursor-pointer">
                Get Started
              </button>
            </div>

            {/* Basic */}
            <div className="bg-slate-900/80 border-2 border-purple-500/50 rounded-3xl p-8 relative flex flex-col justify-between shadow-xl shadow-purple-950/20">
              <div className="absolute top-0 right-6 -translate-y-1/2 px-3 py-1 bg-purple-600 text-[10px] uppercase font-bold tracking-wider rounded-md text-white">Popular</div>
              <div>
                <h4 className="text-xs uppercase text-purple-400 tracking-wider font-bold mb-2">Basic Guardian</h4>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold text-white">£4.99</span>
                  <span className="text-slate-500 text-sm">/mo</span>
                </div>
                <hr className="border-slate-800 my-4" />
                <ul className="space-y-3.5 text-sm mb-8 text-slate-400">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> 2 Devices Supported</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Full Risk Heuristics Engine</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Advanced Risk Scoring Model</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Geofencing Spatial Alerts</li>
                </ul>
              </div>
              <button onClick={onStartParent} className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-purple-600/10 cursor-pointer">
                Upgrade to Basic
              </button>
            </div>

            {/* Premium */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div>
                <h4 className="text-xs uppercase text-pink-400 tracking-wider font-bold mb-2">Premium Automation</h4>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold">£7.99</span>
                  <span className="text-slate-500 text-sm">/mo</span>
                </div>
                <hr className="border-slate-800 my-4" />
                <ul className="space-y-3.5 text-sm mb-8 text-slate-400">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Unrestricted Devices per Family</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Intelligent Custom Filtering</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Historical Trend Analytics</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400" /> Family Automation Workflows</li>
                </ul>
              </div>
              <button onClick={onStartParent} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm transition-all cursor-pointer">
                Unlock Premium
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 border-t border-slate-900 bg-slate-950/80 text-center text-xs text-slate-600 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          © 2026 Spykids Inc. All rights reserved. Built ethically with parent-child safety partnerships.
        </div>
        <div className="flex gap-6">
          <a href="#landing" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
          <a href="#landing" className="hover:text-slate-400 transition-colors">Safety Standards</a>
          <a href="#landing" className="hover:text-slate-400 transition-colors">Ethical Framework</a>
        </div>
      </footer>
    </div>
  );
}
