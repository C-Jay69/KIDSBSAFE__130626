/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Send, AlertTriangle, ShieldCheck, HelpCircle, RefreshCw, Layers } from "lucide-react";

interface RiskSimulatorProps {
  onMessageSimulated: (alertCreated: boolean) => void;
  isGeminiConnected: boolean;
  selectedChildId: string;
  selectedChildAge: number;
}

export default function RiskSimulator({ onMessageSimulated, isGeminiConnected, selectedChildId, selectedChildAge }: RiskSimulatorProps) {
  const [senderName, setSenderName] = useState("Unlisted_Contact7");
  const [contactNovelty, setContactNovelty] = useState<"new" | "known">("new");
  const [messageText, setMessageText] = useState("hey can we keep this secret? trade pics with me first and then we can meet alone tonight.");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Last analysis result
  const [lastResult, setLastResult] = useState<{
    engine: string;
    isRisk: boolean;
    riskScore: number;
    severity: string;
    categories: string[];
    reasoning: string;
  } | null>(null);

  const presets = [
    {
      title: "Grooming & Secrecy (High Risk)",
      text: "Hey, you are cute for your age. Let's keep our relationship a secret from your mom, OK? Trade pics first.",
      novelty: "new" as const,
      sender: "DeltaCoreX"
    },
    {
      title: "Unsafe Meetup Request (High Risk)",
      text: "Are you home alone right now? Let's meet alone at the old warehouse at 9pm. Don't tell your parent.",
      novelty: "new" as const,
      sender: "Stranger_Active"
    },
    {
      title: "Financial Scam Hazard (High Risk)",
      text: "Hey kid! Send me some money immediately. Send me some Amazon Gift Cards code or I will report you.",
      novelty: "new" as const,
      sender: "Scammer_Node"
    },
    {
      title: "Harmful Bullying (Medium Risk)",
      text: "You are an absolute loser, nobody at school likes you. Why don't you just stay home tomorrow.",
      novelty: "known" as const,
      sender: "Classmate_A"
    },
    {
      title: "Safe Homework Query (No Risk)",
      text: "Hey Liam, did you finish the Math sheet for tomorrow? I'm playing Roblox if you want to join afterwards.",
      novelty: "known" as const,
      sender: "SchoolFriend_Leo"
    }
  ];

  const applyPreset = (p: typeof presets[0]) => {
    setMessageText(p.text);
    setSenderName(p.sender);
    setContactNovelty(p.novelty);
  };

  const handleRunAnalysis = async () => {
    if (!messageText.trim()) return;

    setIsAnalyzing(true);
    setLastResult(null);

    try {
      // First, fetch the risk assessment from our backend endpoint using the actual payload
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          contact: senderName,
          novelty: contactNovelty,
          age: selectedChildAge
        })
      });

      const assessment = await res.json();
      setLastResult(assessment);

      // Now, push / trigger this threat on the companion state to potentially add a parental alert if riskScore >= 70
      const pushRes = await fetch("/api/simulation/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId: selectedChildId,
          sender: senderName,
          content: messageText,
          novelty: contactNovelty,
          riskAssessment: assessment
        })
      });

      const pushData = await pushRes.json();
      
      // Notify parent screen to update alerts list
      onMessageSimulated(pushData.alertCreated);

    } catch (err) {
      console.error("Simulation error occurred:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div id="risk-simulator" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/5 rounded-full blur-2xl"></div>
      
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" /> Active Threat Engine Sandbox
          </h3>
          <p className="text-slate-400 text-xs mt-1">
            Simulate incoming chats on Liam's phone to see how the server risk engine flags grooming or bullying.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${isGeminiConnected ? 'bg-emerald-950/40 border border-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isGeminiConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
            {isGeminiConnected ? 'AI (Gemini) Active' : 'Heuristics Fallback'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Presets and Inputs */}
        <div className="lg:col-span-7 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Preset Threat Signatures</label>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => applyPreset(preset)}
                  className="px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-705 text-[11px] text-slate-300 transition-all text-left truncate max-w-full cursor-pointer hover:text-white"
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Sender Handle</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Familiarity</label>
              <select
                value={contactNovelty}
                onChange={(e) => setContactNovelty(e.target.value as "new" | "known")}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/50"
              >
                <option value="new">Stranger (Novel contact)</option>
                <option value="known">Known Contact (Friend)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Message Content</label>
            <textarea
              rows={3}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/50 placeholder-slate-700"
              placeholder="Type simulated chat message content received on device..."
            />
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing || !messageText.trim()}
            className="w-full py-3 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/10 cursor-pointer disabled:cursor-not-allowed transition-all"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-purple-200" />
                Analyzing with {isGeminiConnected ? "Gemini Deep AI" : "Heuristic Rules engine"}...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Simulate Incoming Message Event
              </>
            )}
          </button>
        </div>

        {/* Live Analysis Terminal Display */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between font-mono relative">
          <div className="text-[10px] text-slate-600 border-b border-slate-900 pb-2 flex items-center justify-between">
            <span>ENGINE_LOG_OUTPUT v3.3</span>
            <span>SYSTEM_SECURE_LAYER</span>
          </div>

          {lastResult ? (
            <div className="space-y-4 py-3 flex-1 overflow-y-auto">
              {/* Score ring */}
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${lastResult.isRisk ? 'bg-purple-500/10 text-pink-500 border border-pink-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                  {lastResult.isRisk ? (
                    <AlertTriangle className="w-8 h-8" />
                  ) : (
                    <ShieldCheck className="w-8 h-8" />
                  )}
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Computed Risk Coefficient</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-4xl font-extrabold font-sans ${lastResult.riskScore >= 70 ? 'text-pink-500' : 'text-emerald-400'}`}>
                      {lastResult.riskScore}
                    </span>
                    <span className="text-xs text-slate-600">/ 100</span>
                  </div>
                </div>
              </div>

              {/* Tags / Details */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900/60 p-2 rounded-lg">
                  <div className="text-[9px] text-slate-600 uppercase">Assessment</div>
                  <div className={`font-bold capitalize ${lastResult.isRisk ? 'text-pink-500' : 'text-emerald-400'}`}>
                    {lastResult.isRisk ? `Danger (Score >= 70)` : "Private (No alert)"}
                  </div>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-lg">
                  <div className="text-[9px] text-slate-600 uppercase">Severity</div>
                  <div className={`font-bold uppercase ${lastResult.severity === 'high' ? 'text-pink-500' : lastResult.severity === 'medium' ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {lastResult.severity}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[9px] text-slate-600 uppercase mb-1">Threat Classifications</div>
                <div className="flex flex-wrap gap-1.5">
                  {lastResult.categories.map((cat, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 rounded-md text-[10px]">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-900 pt-3">
                <div className="text-[9px] text-slate-600 uppercase mb-1">AI Reasoning Report (Ethical Output)</div>
                <p className="text-slate-400 text-[11px] leading-relaxed font-sans italic">
                  "{lastResult.reasoning}"
                </p>
                {!lastResult.isRisk && (
                  <p className="text-[10px] text-slate-500 mt-2 font-sans flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400 inline" />
                    Because score was low, chat was kept fully private. No alert was sent to the parent dashboard!
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center my-auto">
              <HelpCircle className="w-12 h-12 mx-auto text-slate-800 mb-4 animate-bounce" />
              <p className="text-xs text-slate-600 font-sans max-w-xs mx-auto">
                No active event simulated yet. Use inputs on the left or select a preset to analyze communication triggers.
              </p>
            </div>
          )}

          <div className="text-[9px] text-slate-700 mt-auto border-t border-slate-900 pt-2 flex items-center justify-between">
            <span>Powered via: {lastResult?.engine || "Active Monitor Ready"}</span>
            <span>RESTRICTION: PRIVACY_SHIELD_ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
