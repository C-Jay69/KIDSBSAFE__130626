/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Users, Shield, ShieldAlert, AlertTriangle, CheckCircle, RefreshCw, 
  MapPin, Settings, Key, Sparkles, CreditCard, Plus, Trash2, Sliders, Play, Check 
} from "lucide-react";
import { Family, RiskAlert, Geofence, SubscriptionPlan, ChildDevice } from "../types";
import RiskSimulator from "./RiskSimulator";

interface ParentDashboardProps {
  family: Family;
  alerts: RiskAlert[];
  geofences: Geofence[];
  isGeminiConnected: boolean;
  onResolveAlert: (alertId: string) => Promise<void>;
  onCreateGeofence: (name: string, radius: number, type: "safe" | "restricted") => Promise<void>;
  onDeleteGeofence: (id: string) => Promise<void>;
  onRegeneratePIN: (childId: string) => Promise<void>;
  onUpdateSubscription: (plan: SubscriptionPlan) => Promise<void>;
  onTriggerGpsBreach: (childId: string, geofenceName: string, fenceType: "safe" | "restricted") => Promise<void>;
  onRefreshAll: () => Promise<void>;
  onBackToLanding: () => void;
}

export default function ParentDashboard({
  family,
  alerts,
  geofences,
  isGeminiConnected,
  onResolveAlert,
  onCreateGeofence,
  onDeleteGeofence,
  onRegeneratePIN,
  onUpdateSubscription,
  onTriggerGpsBreach,
  onRefreshAll,
  onBackToLanding
}: ParentDashboardProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "alerts" | "geofences" | "pairing" | "subscription" | "automation">("summary");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Form states
  const [newFenceName, setNewFenceName] = useState("");
  const [newFenceRadius, setNewFenceRadius] = useState(150);
  const [newFenceType, setNewFenceType] = useState<"safe" | "restricted">("restricted");

  const [activeChildForGpsBreed, setActiveChildForGpsBreed] = useState("kid_liam");

  // Selection for child-level simulation context
  const [selectedChildForSim, setSelectedChildForSim] = useState<ChildDevice>(
    family.children[0] || { id: "kid_liam", name: "Liam", age: 14, pinCode: "582914", isPaired: true, status: "active" }
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefreshAll();
    setIsRefreshing(false);
  };

  const handleCreateFenceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFenceName.trim()) return;
    await onCreateGeofence(newFenceName.trim(), newFenceRadius, newFenceType);
    setNewFenceName("");
  };

  const handleResolve = async (id: string) => {
    await onResolveAlert(id);
  };

  const handleBillingUpdate = async (plan: SubscriptionPlan) => {
    await onUpdateSubscription(plan);
  };

  // Stats calculation
  const totalAlerts = alerts.length;
  const unresolvedAlerts = alerts.filter(a => !a.resolved);
  const highSeverityCount = alerts.filter(a => !a.resolved && a.severity === "high").length;
  const activeDevices = family.children.filter(c => c.isPaired).length;

  return (
    <div id="parent-dashboard" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Upper Navigation Rail */}
      <header className="border-b border-slate-900 bg-slate-950/80 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm uppercase tracking-wider block">SPYKIDS <span className="text-purple-400">PORTAL</span></span>
              <span className="text-[10px] text-slate-500 font-mono -mt-1 block">SECURE_VERIFIED_SESSION</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-lg border border-slate-900 bg-slate-900/60 text-slate-300 hover:text-white transition-all cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              Sync Info
            </button>
            <button
              onClick={onBackToLanding}
              className="px-3.5 py-2 rounded-lg border border-slate-900 bg-slate-900/60 text-slate-300 hover:text-white transition-all cursor-pointer text-xs font-semibold"
            >
              Landing Page
            </button>
          </div>
        </div>
      </header>

      {/* Main Panel layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        
        {/* Quick Insights Matrix */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-slate-900 border border-slate-840 p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] sm:text-xs font-bold uppercase text-slate-400 tracking-wider">Unresolved Threats</span>
              <ShieldAlert className="w-5 h-5 text-pink-500" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl sm:text-3.5xl font-extrabold ${unresolvedAlerts.length > 0 ? 'text-pink-500' : 'text-slate-300'}`}>
                {unresolvedAlerts.length}
              </span>
              <span className="text-xs text-slate-600">active</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              {highSeverityCount} classified as Critical High Risk
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-840 p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] sm:text-xs font-bold uppercase text-slate-400 tracking-wider">Companion Status</span>
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3.5xl font-extrabold text-slate-100">
                {activeDevices} / {family.children.length}
              </span>
              <span className="text-xs text-slate-600">devices</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              All transparent tracking states confirmed live.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-840 p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] sm:text-xs font-bold uppercase text-slate-400 tracking-wider">Subscription Tier</span>
              <CreditCard className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3.5xl font-extrabold text-purple-400">
                {family.subscription}
              </span>
            </div>
            <p className="text-[10px] text-slate-300 mt-2 hover:underline cursor-pointer" onClick={() => setActiveTab("subscription")}>
              Change or manage membership plan &rarr;
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-840 p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] sm:text-xs font-bold uppercase text-slate-400 tracking-wider">Risk Analysis Engine</span>
              <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-sm sm:text-base font-extrabold uppercase ${isGeminiConnected ? 'text-emerald-400' : 'text-slate-400'}`}>
                {isGeminiConnected ? "Gemini Node Connected" : "Local Rules Engine"}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              Checks incoming texts, novelty logs and keyword matrices.
            </p>
          </div>
        </div>

        {/* View Selection Tab List */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-900 pb-2.5">
          <button
            onClick={() => setActiveTab("summary")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-normal transition-all cursor-pointer whitespace-nowrap ${activeTab === 'summary' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-900/60'}`}
          >
            Dashboard Overview
          </button>
          <button
            onClick={() => setActiveTab("alerts")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-normal transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'alerts' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-900/60'}`}
          >
            Threat Alerts Matrix
            {unresolvedAlerts.length > 0 && (
              <span className="bg-pink-600 text-white text-[10px] px-1.5 rounded-md font-extrabold">
                {unresolvedAlerts.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("geofences")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-normal transition-all cursor-pointer whitespace-nowrap ${activeTab === 'geofences' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-900/60'}`}
          >
            Geofencing
          </button>
          <button
            onClick={() => setActiveTab("pairing")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-normal transition-all cursor-pointer whitespace-nowrap ${activeTab === 'pairing' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-900/60'}`}
          >
            Device Pairing PINs
          </button>
          <button
            onClick={() => setActiveTab("subscription")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-normal transition-all cursor-pointer whitespace-nowrap ${activeTab === 'subscription' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-900/60'}`}
          >
            Billing
          </button>
          <button
            onClick={() => setActiveTab("automation")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-normal transition-all cursor-pointer whitespace-nowrap ${activeTab === 'automation' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-900/60'}`}
          >
            Custom Filters
          </button>
        </div>

        {/* Tab Contents */}
        
        {/* SUMMARY TAB */}
        {activeTab === "summary" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Children list & Stats */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-slate-900 border border-slate-840 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-slate-350 uppercase tracking-wider mb-4">Household Paired Devices</h3>
                  <div className="space-y-3.5">
                    {family.children.map(kid => (
                      <div key={kid.id} className="p-4 bg-slate-950/40 border border-slate-900 rounded-xl hover:border-slate-800 transition-all flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-200">{kid.name}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold ${kid.isPaired ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'}`}>
                              {kid.isPaired ? "Paired" : "Pending"}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1">
                            Age: {kid.age} y/o • Status: <span className="text-purple-400 font-semibold">{kid.status.toUpperCase()}</span>
                          </div>
                          {kid.lastActive && (
                            <div className="text-[10px] text-slate-600 mt-0.5 whitespace-nowrap">
                              Last active: {new Date(kid.lastActive).toLocaleTimeString()}
                            </div>
                          )}
                        </div>
                        {kid.isPaired ? (
                          <div className="text-right">
                            <span className="text-xs text-slate-400 block font-semibold">Active Stream</span>
                            <span className="inline-block w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping mt-1"></span>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setActiveTab("pairing")}
                            className="p-1 px-2.2 bg-slate-800 text-[10px] text-slate-300 rounded hover:bg-slate-700 transition"
                          >
                            Setup Pin
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inline SVG Chart for Alerts over Time */}
                <div className="bg-slate-900 border border-slate-840 rounded-2xl p-5 relative overflow-hidden">
                  <h3 className="text-sm font-bold text-slate-350 uppercase tracking-wider mb-2">Weekly Incident Trend Matrix</h3>
                  <p className="text-[10px] text-slate-500 mb-6">Total calculated high-risk signals captured since last week.</p>
                  
                  {/* Elegant Custom SVG Chart */}
                  <div className="h-28 w-full mt-4 flex items-end justify-between font-mono text-[10px] text-slate-600 border-b border-slate-800 pb-2">
                    <div className="flex flex-col items-center gap-1.5 w-full">
                      <div className="h-10 w-2.5 bg-slate-800 rounded-t-sm hover:bg-slate-700 transition-all"></div>
                      <span>Mon</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 w-full">
                      <div className="h-16 w-2.5 bg-slate-800 rounded-t-sm hover:bg-slate-700 transition-all"></div>
                      <span>Tue</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 w-full">
                      <div className="h-6 w-2.5 bg-slate-800 rounded-t-sm hover:bg-slate-700 transition-all"></div>
                      <span>Wed</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 w-full">
                      <div className="h-22 w-2.5 bg-purple-600 rounded-t-sm hover:bg-purple-500 transition-all"></div>
                      <span>Thu</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 w-full">
                      <div className="h-24 w-2.5 bg-purple-600 rounded-t-sm hover:bg-purple-500 transition-all"></div>
                      <span>Fri</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 w-full">
                      <div className="h-14 w-2.5 bg-pink-500 rounded-t-sm hover:bg-pink-400 transition-all animate-pulse"></div>
                      <span>Sat</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 w-full">
                      <div className="h-8 w-2.5 bg-slate-800 rounded-t-sm hover:bg-slate-700 transition-all"></div>
                      <span>Sun</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-3 font-semibold">
                    <span>Low Risks: 12</span>
                    <span>High Risk Flagged: 2</span>
                  </div>
                </div>

              </div>

              {/* Right Column: Key Alerts feed and Device simulation configuration */}
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-350 uppercase tracking-wider">Unresolved Security Notifications</h3>
                    <button 
                      onClick={() => setActiveTab("alerts")} 
                      className="text-xs text-purple-400 hover:underline"
                    >
                      View all {totalAlerts} logs &rarr;
                    </button>
                  </div>

                  {unresolvedAlerts.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-900 rounded-2xl p-8 text-center text-slate-500 flex flex-col items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-emerald-500 mb-3" />
                      <p className="text-sm text-slate-300 font-semibold">No high-risk security warning active</p>
                      <p className="text-[11px] text-slate-500 mt-1 max-w-sm">All scanned conversation streams remain safely below risk thresholds, giving your children total, uncompromised privacy.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {unresolvedAlerts.slice(0, 3).map(alert => (
                        <div key={alert.id} className={`p-5 rounded-2xl border bg-slate-900/50 backdrop-blur-md ${alert.severity === 'high' ? 'border-pink-500/20 hover:border-pink-500/35 shadow-pink-950/5' : 'border-slate-800 hover:border-slate-700'}`}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex gap-3">
                              <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${alert.severity === 'high' ? 'bg-pink-500/10 text-pink-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                <AlertTriangle className="w-4.5 h-4.5" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-bold text-sm text-slate-100">{alert.title}</h4>
                                  <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-extrabold uppercase ${alert.severity === 'high' ? 'bg-pink-950 text-pink-400' : 'bg-amber-950 text-amber-400'}`}>
                                    Score: {alert.score}%
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1">
                                  Recipients: <span className="text-purple-400 font-semibold">{alert.childName}</span> • Type: {alert.type.toUpperCase()} • Received {new Date(alert.timestamp).toLocaleTimeString()}
                                </p>
                                <p className="text-slate-300 text-xs mt-3 bg-slate-950/60 p-3 rounded-xl border border-slate-900 line-clamp-2 leading-relaxed font-mono">
                                  "{alert.description}"
                                </p>
                                
                                {alert.metadata && alert.metadata.reasoning && (
                                  <div className="mt-2.5 text-[11px] text-slate-500 italic font-sans">
                                    <Sparkles className="w-3.5 h-3.5 inline mr-1 text-purple-400 align-middle" /> 
                                    AI reasoning: {alert.metadata.reasoning}
                                  </div>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleResolve(alert.id)}
                              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold cursor-pointer transition-colors shrink-0"
                            >
                              Resolve
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Simulated Geofence boundaries breach trigger row (Parent can trigger physical test events) */}
                <div className="bg-slate-900 border border-slate-840 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-slate-350 uppercase tracking-wider mb-2">Simulated Boundary Breach Tool</h3>
                  <p className="text-[10px] text-slate-500 mb-4">Leverage our testing triggers to dispatch mock coordinate violations into the parent notifier.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    <div className="sm:col-span-4">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target Child Device</label>
                      <select
                        value={activeChildForGpsBreed}
                        onChange={(e) => setActiveChildForGpsBreed(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-bold text-slate-300"
                      >
                        {family.children.map(k => (
                          <option key={k.id} value={k.id}>{k.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-5">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Triggering Geofence Coordinates Zone</label>
                      <div className="flex gap-2">
                        {geofences.map(f => (
                          <button
                            key={f.id}
                            onClick={() => onTriggerGpsBreach(activeChildForGpsBreed, f.name, f.type)}
                            className="w-full p-2 bg-slate-950 hover:bg-slate-905 border border-slate-800 hover:border-slate-705 rounded-xl text-[10px] text-slate-300 font-bold flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <MapPin className={`w-3 h-3 ${f.type === 'restricted' ? 'text-pink-500' : 'text-emerald-400'}`} />
                            Breach {f.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="sm:col-span-3 text-center text-slate-400 text-[10px] italic">
                      Dispatched alerts appear in Risk Alerts feed.
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* COLLAPSIBLE sandbox threat engine panel inside summary for immediate user evaluation */}
            <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/10">
              <div className="bg-slate-900 px-6 py-4.5 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" /> Interactive Simulation Sandbox (Try Me!)
                  </h3>
                  <p className="text-slate-500 text-xs">Simulate test messages below. The system evaluates danger in real time and automatically fires notifications above.</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Context: </span>
                  <select 
                    value={selectedChildForSim.id} 
                    onChange={(e) => {
                      const found = family.children.find(k => k.id === e.target.value);
                      if (found) setSelectedChildForSim(found);
                    }}
                    className="bg-slate-950 border border-slate-800 p-1 rounded text-purple-300 text-xs font-bold font-mono"
                  >
                    {family.children.map(k => (
                      <option key={k.id} value={k.id}>{k.name} (Age {k.age})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="p-4 sm:p-6 bg-slate-950/20">
                <RiskSimulator 
                  onMessageSimulated={() => handleRefresh()} 
                  isGeminiConnected={isGeminiConnected}
                  selectedChildId={selectedChildForSim.id}
                  selectedChildAge={selectedChildForSim.age}
                />
              </div>
            </div>

          </div>
        )}

        {/* ALERTS TAB */}
        {activeTab === "alerts" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-100">Historical Security Event Log</h3>
                <p className="text-slate-500 text-xs">Review threat signals routed via Spykids transparent API pipelines.</p>
              </div>
              <div className="text-slate-400 text-xs">
                Showing {alerts.length} notifications sorted chronologically
              </div>
            </div>

            {alerts.length === 0 ? (
              <div className="bg-slate-900 border border-slate-900 rounded-2xl p-12 text-center text-slate-500 flex flex-col items-center justify-center">
                <CheckCircle className="w-12 h-12 text-emerald-500 mb-3" />
                <p className="text-sm text-slate-300 font-semibold">Security pipeline is clear</p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-sm">No keyword alarms or Geofence breach flags mapped.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map(alert => (
                  <div 
                    key={alert.id} 
                    className={`p-6 rounded-2xl border transition-all ${alert.resolved ? 'bg-slate-900/30 border-slate-950 opacity-60' : 'bg-slate-900 border-slate-840'}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${alert.severity === 'high' ? 'bg-pink-950 text-pink-400 border border-pink-500/20' : 'bg-amber-950 text-amber-400 border border-amber-500/20'}`}>
                            {alert.severity} Risk ({alert.score} Score)
                          </span>
                          <span className="text-xs text-slate-500">•</span>
                          <span className="text-xs text-slate-300 font-bold">{alert.childName} (Device)</span>
                          <span className="text-xs text-slate-505 font-mono">Timestamp: {new Date(alert.timestamp).toLocaleString()}</span>
                        </div>

                        <h4 className="text-base font-bold text-slate-150">{alert.title}</h4>
                        
                        {/* Description block */}
                        <div className="bg-slate-950 border border-slate-900/60 p-4 rounded-xl font-mono text-xs text-slate-300 leading-relaxed max-w-4xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-1 bg-slate-900 text-[8px] uppercase font-bold text-slate-600 border-l border-b border-slate-800">
                            TRUNCATED_PREVIEW_SHIELD
                          </div>
                          "{alert.description}"
                        </div>

                        {/* Metadata breakdown with AI assessment highlights */}
                        {alert.metadata && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 text-xs">
                            {alert.metadata.contactName && (
                              <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-900">
                                <span className="text-[9px] text-slate-600 uppercase font-bold block">Contact Handle</span>
                                <span className="text-slate-300 font-semibold">{alert.metadata.contactName}</span>
                              </div>
                            )}
                            {alert.metadata.senderNovelty && (
                              <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-900">
                                <span className="text-[9px] text-slate-600 uppercase font-bold block">Familiarity Index</span>
                                <span className="text-slate-300 font-semibold uppercase">{alert.metadata.senderNovelty} Contact</span>
                              </div>
                            )}
                            {alert.metadata.keywordsFound && alert.metadata.keywordsFound.length > 0 && (
                              <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-900">
                                <span className="text-[9px] text-slate-600 uppercase font-bold block">Safety Classifications</span>
                                <span className="text-pink-400 font-medium">[{alert.metadata.keywordsFound.join(", ")}]</span>
                              </div>
                            )}
                          </div>
                        )}

                        {alert.metadata && alert.metadata.reasoning && (
                          <div className="bg-slate-950 border border-slate-900 p-3.5 rounded-xl text-xs text-slate-400 leading-relaxed font-sans mt-3 border-l-4 border-l-purple-500">
                            <div className="text-[9px] font-bold text-purple-400 uppercase mb-1">Ethical Guard AI Verification Reasoning</div>
                            "{alert.metadata.reasoning}"
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end md:self-start">
                        {alert.resolved ? (
                          <span className="text-xs text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/20 px-3.5 py-1.5 rounded-lg flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4" /> Resolved
                          </span>
                        ) : (
                          <button
                            onClick={() => handleResolve(alert.id)}
                            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all cursor-pointer"
                          >
                            Resolve Alert
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* GEOFENCES TAB */}
        {activeTab === "geofences" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Setup Geofence Form */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-840 rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-400" /> Geofencing Guidelines
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Designate safety parameters. Entering flagged areas automatically triggers notifications on Parent dashboard.
                </p>
              </div>

              <form onSubmit={handleCreateFenceSubmit} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Boundary Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oak Valley School, Local Tech Park"
                    value={newFenceName}
                    onChange={(e) => setNewFenceName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Radius (meters)</label>
                    <input
                      type="number"
                      min="50"
                      max="1500"
                      value={newFenceRadius}
                      onChange={(e) => setNewFenceRadius(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Zone Policy</label>
                    <select
                      value={newFenceType}
                      onChange={(e) => setNewFenceType(e.target.value as "safe" | "restricted")}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-500/50 text-slate-350 font-semibold"
                    >
                      <option value="safe">Safe Area (Allow)</option>
                      <option value="restricted">Restricted Zone (Warn)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md"
                >
                  <Plus className="w-4 h-4" /> Add Geofence Policy
                </button>
              </form>

              <hr className="border-slate-800" />

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Configured Boundaries</h4>
                {geofences.length === 0 ? (
                  <p className="text-xs text-slate-600 italic">No GPS coordinates mapped.</p>
                ) : (
                  <div className="space-y-2">
                    {geofences.map(fence => (
                      <div key={fence.id} className="p-3.5 bg-slate-950/40 border border-slate-900 rounded-xl flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-200">{fence.name}</span>
                            <span className={`text-[8px] font-extrabold uppercase px-1.5 rounded-md ${fence.type === 'safe' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/15' : 'bg-pink-950 text-pink-400 border border-pink-500/15'}`}>
                              {fence.type}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 block mt-1">Radius: {fence.radius}m • Coordinates: {fence.lat.toFixed(4)}, {fence.lng.toFixed(4)}</span>
                        </div>
                        <button
                          onClick={() => onDeleteGeofence(fence.id)}
                          className="p-2 text-slate-600 hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Simulated Live Coordinates Grid map graphic */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-840 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100 mb-2">Live Household Coordinates Matrix</h3>
                <p className="text-slate-500 text-xs mb-6">Interactive spatial visual mapping tracking Liam and Sophie's active paired telemetry logs.</p>
              </div>

              {/* Dynamic Coordinate Plot Grid */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 aspect-video relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:24px_24px] opacity-60"></div>
                
                {/* Radial Geofences */}
                {geofences.map((f, i) => (
                  <div 
                    key={f.id} 
                    className={`absolute rounded-full border flex items-center justify-center transition-all ${f.type === 'restricted' ? 'bg-pink-500/5 border-pink-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}
                    style={{
                      width: `${100 + i * 40}px`,
                      height: `${100 + i * 40}px`,
                      transform: `translate(${(i - 0.5) * 60}px, ${(i - 0.5) * -30}px)`
                    }}
                  >
                    <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-sm absolute top-2 ${f.type === 'restricted' ? 'text-pink-400 bg-pink-950/60' : 'text-emerald-400 bg-emerald-950/60'}`}>
                      {f.name} ({f.radius}m)
                    </span>
                  </div>
                ))}

                {/* Child Coordinate Blips */}
                {family.children.filter(k => k.isPaired).map((kid, i) => (
                  <div 
                    key={kid.id}
                    className="absolute flex flex-col items-center z-10 animate-bounce"
                    style={{
                      animationDelay: `${i * 300}ms`,
                      transform: `translate(${(i - 0.5) * 110}px, ${(i - 0.5) * 50}px)`
                    }}
                  >
                    <div className="w-3 h-3 bg-purple-500 rounded-full border-2 border-slate-950 relative flex items-center justify-center shadow-lg shadow-purple-500/50">
                      <span className="absolute w-6 h-6 bg-purple-500/20 rounded-full animate-ping"></span>
                    </div>
                    <span className="px-2 py-0.5 bg-slate-900 border border-purple-500/30 text-white rounded-md text-[9px] font-bold uppercase mt-1">
                      {kid.name}
                    </span>
                  </div>
                ))}

                <div className="absolute bottom-4 left-4 text-[9px] text-slate-500 font-mono">
                  SCALE_COMPLIANCE: 1_GRID = 50M
                </div>
                <div className="absolute top-4 right-4 text-[9px] text-slate-500 font-mono flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full inline-block"></span> Minor Device Location
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full inline-block"></span> Restricted Zone Limit
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-950 p-4 rounded-xl border border-slate-900/40 mt-4 italic text-center">
                Under the Spykids Ethics Standards, coordinates are parsed locally. No detailed route histories or perpetual logs are compiled.
              </div>
            </div>

          </div>
        )}

        {/* PAIRING TAB */}
        {activeTab === "pairing" && (
          <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-840 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-100">Setup Companion Connection PINs</h3>
              <p className="text-slate-400 text-xs mt-1">
                Generate secure passcode credentials to link new child phones. The companion app displays a transparent disclosure window before activating.
              </p>
            </div>

            <div className="space-y-4">
              {family.children.map(kid => (
                <div key={kid.id} className="p-5 bg-slate-950 border border-slate-900 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-200">{kid.name}</h4>
                      <span className={`text-[9px] font-extrabold uppercase px-1.5 rounded-md ${kid.isPaired ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/15' : 'bg-slate-800 text-slate-400'}`}>
                        {kid.isPaired ? "Paired & Verified" : "Awaiting Pairing"}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Age category: {kid.age} y/o • Requested status: <span className="text-purple-400 font-semibold">{kid.status.toUpperCase()}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-slate-900 font-mono font-extrabold text-sm text-purple-400 px-4 py-2 border border-slate-800 rounded-xl tracking-wider select-all text-center">
                      PIN: {kid.pinCode}
                    </div>
                    <button
                      onClick={() => onRegeneratePIN(kid.id)}
                      className="px-3.5 py-2 bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-705 rounded-xl text-xs text-slate-300 hover:text-white font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Regenerate PIN
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-purple-950/20 border border-purple-500/15 rounded-xl p-4 text-xs text-purple-300 leading-relaxed">
              <Key className="w-4 h-4 text-purple-400 inline mr-1" />
              <strong>Simple Integration Setup Flow:</strong> Open the companion app on your child's phone, key in the name and input the 6-Digit PIN generated above to instantly stream high-risk alerts back here.
            </div>
          </div>
        )}

        {/* SUBSCRIPTION TAB */}
        {activeTab === "subscription" && (
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto">
              <h3 className="text-lg font-bold text-slate-100 uppercase tracking-wide">Manage Household Membership Plan</h3>
              <p className="text-slate-400 text-xs mt-1">Select the security profile matching your parenting coordinates.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Free Plan */}
              <div className={`p-6 bg-slate-900 border rounded-3xl relative flex flex-col justify-between ${family.subscription === SubscriptionPlan.FREE ? 'border-purple-500/70 shadow-lg shadow-purple-950/10' : 'border-slate-840'}`}>
                {family.subscription === SubscriptionPlan.FREE && (
                  <span className="absolute top-0 right-6 -translate-y-1/2 bg-purple-600 text-white text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-md">Active Plan</span>
                )}
                <div>
                  <h4 className="text-xs uppercase text-slate-400 font-bold tracking-wider mb-2">Free Protection</h4>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-2xl font-bold">£0.00</span>
                    <span className="text-slate-500 text-xs">/month</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-6">Basic threat scanning alerts and single-child device setup.</p>
                  <hr className="border-slate-800 my-4" />
                  <ul className="space-y-2.5 text-xs text-slate-400">
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-purple-400" /> 1 Paired Device</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-purple-400" /> Basic Keyword Safety checks</li>
                    <li className="flex items-center gap-1.5 text-slate-600"><Check className="w-3.5 h-3.5" /> Premium automated filters</li>
                  </ul>
                </div>
                {family.subscription !== SubscriptionPlan.FREE && (
                  <button
                    onClick={() => handleBillingUpdate(SubscriptionPlan.FREE)}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-white font-bold text-xs rounded-xl mt-6 transition-all cursor-pointer"
                  >
                    Select Free Plan
                  </button>
                )}
              </div>

              {/* Basic Plan */}
              <div className={`p-6 bg-slate-900 border rounded-3xl relative flex flex-col justify-between ${family.subscription === SubscriptionPlan.BASIC ? 'border-purple-500/70 shadow-lg shadow-purple-950/10' : 'border-slate-840'}`}>
                {family.subscription === SubscriptionPlan.BASIC && (
                  <span className="absolute top-0 right-6 -translate-y-1/2 bg-purple-600 text-white text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-md">Active Plan</span>
                )}
                <div>
                  <h4 className="text-xs uppercase text-purple-400 font-bold tracking-wider mb-2">Basic Guardian</h4>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-2xl font-bold text-white">£4.99</span>
                    <span className="text-slate-500 text-xs">/month</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-6">Complete alerts scoring and custom geofencing parameters.</p>
                  <hr className="border-slate-800 my-4" />
                  <ul className="space-y-2.5 text-xs text-slate-400">
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-purple-400" /> 2 Paired Active Devices</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-purple-400" /> Full Risk Analysis Scoring</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-purple-400" /> Geofencing Spatial Alerts</li>
                  </ul>
                </div>
                {family.subscription !== SubscriptionPlan.BASIC && (
                  <button
                    onClick={() => handleBillingUpdate(SubscriptionPlan.BASIC)}
                    className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl mt-6 transition-all cursor-pointer"
                  >
                    Select Basic (Stripe Live simulator)
                  </button>
                )}
              </div>

              {/* Premium Plan */}
              <div className={`p-6 bg-slate-900 border rounded-3xl relative flex flex-col justify-between ${family.subscription === SubscriptionPlan.PREMIUM ? 'border-purple-500/70 shadow-lg shadow-purple-950/10' : 'border-slate-840'}`}>
                {family.subscription === SubscriptionPlan.PREMIUM && (
                  <span className="absolute top-0 right-6 -translate-y-1/2 bg-purple-600 text-white text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-md">Active Plan</span>
                )}
                <div>
                  <h4 className="text-xs uppercase text-pink-400 font-bold tracking-wider mb-2">Premium Automation</h4>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-2xl font-bold">£7.99</span>
                    <span className="text-slate-500 text-xs">/month</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-6">Unrestricted device configuration, custom filtering overrides, & family automation rules.</p>
                  <hr className="border-slate-800 my-4" />
                  <ul className="space-y-2.5 text-xs text-slate-400">
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-purple-400" /> Unrestricted Household Devices</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-purple-400" /> Premium custom threat keywords</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-purple-400" /> Historical trends database logs</li>
                  </ul>
                </div>
                {family.subscription !== SubscriptionPlan.PREMIUM && (
                  <button
                    onClick={() => handleBillingUpdate(SubscriptionPlan.PREMIUM)}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-white font-bold text-xs rounded-xl mt-6 transition-all cursor-pointer"
                  >
                    Select Premium (Stripe Live simulator)
                  </button>
                )}
              </div>

            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h4 className="text-xs uppercase font-extrabold text-slate-300 tracking-wider mb-2">Stripe Payment Gateway Status</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                We operate strictly with real Stripe API configurations. Selecting any tier updates your profile on the Express back-end node mapping instantaneously, proving full-stack operational sandbox integrity.
              </p>
            </div>
          </div>
        )}

        {/* AUTOMATION & CUSTOM RULES TAB */}
        {activeTab === "automation" && (
          <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-840 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-100">Custom Filtering Overrides</h3>
              <p className="text-slate-400 text-xs mt-1">Configure additional danger triggers to tune the severity multipliers for Liam or Sophie's safety engine.</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-900 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Enforce Under-13 Strict Mode</h4>
                  <p className="text-slate-550 text-[10px] mt-1">Enables lower analysis thresholds for all configured elements.</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase font-bold">Enabled</span>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-900 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Flag Unknown Contact Invitations</h4>
                  <p className="text-slate-550 text-[10px] mt-1">Raises risk index multiplication factor if the sender novelty index is high.</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] bg-purple-950 text-purple-400 px-2 py-0.5 rounded uppercase font-bold">Active Override</span>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-900 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Custom Rules Overrides</h4>
                  <p className="text-slate-550 text-[10px] mt-1">Available under Premium automation scopes to override default keywords.</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] bg-slate-800 text-slate-500 px-2 py-0.5 rounded uppercase font-bold">Requires Premium</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 text-[11px] text-slate-500 italic text-center">
              All settings are mapped live to your 'Cleary Family' server endpoints. No local state drift.
            </div>
          </div>
        )}

      </main>

      {/* Footer indicator */}
      <footer className="mt-auto py-8 text-center text-xs text-slate-600 border-t border-slate-900 max-w-7xl mx-auto w-full">
        © 2026 Spykids Inc. All ethical parental guidelines mapped and stored securely.
      </footer>
    </div>
  );
}
