/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import ParentDashboard from "./components/ParentDashboard";
import ChildHome from "./components/ChildHome";
import { Family, RiskAlert, Geofence, SubscriptionPlan, ChildDevice } from "./types";
import { Shield } from "lucide-react";

export default function App() {
  const [currentView, setCurrentView] = useState<"landing" | "parent" | "child">("landing");
  
  // App state sync'd with Server JSON
  const [family, setFamily] = useState<Family | null>(null);
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [isGeminiConnected, setIsGeminiConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Child-specific state
  const [currentChild, setCurrentChild] = useState<ChildDevice | null>(null);

  // Sync state from server on startup
  const fetchServerState = async () => {
    try {
      const res = await fetch("/api/state");
      if (res.ok) {
        const data = await res.json();
        setFamily(data.family);
        setAlerts(data.alerts);
        setGeofences(data.geofences);
        setIsGeminiConnected(data.isGeminiConnected);

        // Map child-state if already paired
        if (currentChild) {
          const freshChild = data.family.children.find((c: ChildDevice) => c.id === currentChild.id);
          if (freshChild) {
            setCurrentChild(freshChild);
          }
        }
      }
    } catch (err) {
      console.error("Error communicating with Spykids backend:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServerState();
    
    // Auto-refresh interval of 10s to reflect background simulations
    const interval = setInterval(() => {
      fetchServerState();
    }, 10000);

    return () => clearInterval(interval);
  }, [currentChild?.id]);

  // Handle Resolve Alert
  const handleResolveAlert = async (alertId: string) => {
    try {
      const res = await fetch("/api/alerts/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setAlerts(data.alerts);
        }
      }
    } catch (err) {
      console.error("Failed to resolve alert:", err);
    }
  };

  // Handle Create Geofence
  const handleCreateGeofence = async (name: string, radius: number, type: "safe" | "restricted") => {
    try {
      const res = await fetch("/api/geofences/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, radius, type })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setGeofences(data.geofences);
        }
      }
    } catch (err) {
      console.error("Failed to create geofence boundary:", err);
    }
  };

  // Handle Delete Geofence
  const handleDeleteGeofence = async (id: string) => {
    try {
      const res = await fetch("/api/geofences/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setGeofences(data.geofences);
        }
      }
    } catch (err) {
      console.error("Failed to delete geofence boundary:", err);
    }
  };

  // Handle PIN generation
  const handleRegeneratePIN = async (childId: string) => {
    try {
      const res = await fetch("/api/pairing/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setFamily(data.family);
        }
      }
    } catch (err) {
      console.error("Failed to regenerate passcode PIN:", err);
    }
  };

  // Handle Subscription Plan updates
  const handleUpdateSubscription = async (plan: SubscriptionPlan) => {
    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setFamily(data.family);
        }
      }
    } catch (err) {
      console.error("Failed to update subscription:", err);
    }
  };

  // Handle Child Pairing submission from child companion app
  const handlePairChild = async (name: string, age: number, pin: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/pairing/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childName: name, childAge: age, pinCode: pin })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.child) {
          setCurrentChild(data.child);
          await fetchServerState();
          return true;
        }
      }
    } catch (err) {
      console.error("Errors pairing child companion:", err);
    }
    return false;
  };

  // Teen Opt-out & pause request dispatcher
  const handleTriggerOptOut = async (childId: string, isPause: boolean) => {
    try {
      const res = await fetch("/api/opt-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId, requestedPause: isPause })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setFamily(data.family);
          setAlerts(data.alerts);
          if (currentChild) {
            const updated = data.family.children.find((c: ChildDevice) => c.id === childId);
            if (updated) setCurrentChild(updated);
          }
        }
      }
    } catch (err) {
      console.error("Failed executing teen opt out request:", err);
    }
  };

  // Live GPS Breach tester/simulator dispatcher
  const handleTriggerGpsBreach = async (childId: string, geofenceName: string, fenceType: "safe" | "restricted") => {
    try {
      const res = await fetch("/api/simulation/gps-breach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId, geofenceName, fenceType })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setAlerts(data.alerts);
        }
      }
    } catch (err) {
      console.error("Failed executing coordinates breach simulation:", err);
    }
  };

  if (loading) {
    return (
      <div id="loading-screen" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <Shield className="w-12 h-12 text-purple-500 animate-spin" />
          <div>
            <h1 className="text-xl font-extrabold uppercase tracking-widest text-center">SPYKIDS GUARDIAN</h1>
            <p className="text-slate-500 text-xs text-center mt-1">Initializing Secure Fullstack Ethical Security Portals...</p>
          </div>
        </div>
      </div>
    );
  }

  // View dispatchers
  if (currentView === "parent" && family) {
    return (
      <ParentDashboard
        family={family}
        alerts={alerts}
        geofences={geofences}
        isGeminiConnected={isGeminiConnected}
        onResolveAlert={handleResolveAlert}
        onCreateGeofence={handleCreateGeofence}
        onDeleteGeofence={handleDeleteGeofence}
        onRegeneratePIN={handleRegeneratePIN}
        onUpdateSubscription={handleUpdateSubscription}
        onTriggerGpsBreach={handleTriggerGpsBreach}
        onRefreshAll={fetchServerState}
        onBackToLanding={() => setCurrentView("landing")}
      />
    );
  }

  if (currentView === "child") {
    return (
      <ChildHome
        currentChild={currentChild}
        onPairChild={handlePairChild}
        onTriggerOptOut={handleTriggerOptOut}
        onBackToLanding={() => setCurrentView("landing")}
      />
    );
  }

  // Defaul: Landing Page View
  return (
    <LandingPage
      onStartParent={() => setCurrentView("parent")}
      onStartChild={() => setCurrentView("child")}
      subscription={family ? family.subscription : SubscriptionPlan.FREE}
    />
  );
}
