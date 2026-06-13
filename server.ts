/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { SubscriptionPlan, Family, ChildDevice, RiskAlert, Geofence } from "./src/types.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Persistent Mock Database for testing session
let familyState: Family = {
  id: "fam_001",
  name: "Cleary Family",
  parentId: "usr_parent",
  subscription: SubscriptionPlan.FREE,
  children: [
    {
      id: "kid_liam",
      name: "Liam",
      age: 14,
      isPaired: true,
      pairedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      pinCode: "582914",
      status: "active",
      lastActive: new Date().toISOString()
    },
    {
      id: "kid_sophie",
      name: "Sophie",
      age: 11,
      isPaired: false,
      pinCode: "123654",
      status: "active"
    }
  ]
};

let geofencesState: Geofence[] = [
  {
    id: "geo_school",
    name: "Oak Valley Middle School",
    lat: 34.0522,
    lng: -118.2437,
    radius: 150,
    type: "safe"
  },
  {
    id: "geo_restricted",
    name: "Unregulated Industrial Area",
    lat: 34.0622,
    lng: -118.2537,
    radius: 200,
    type: "restricted"
  }
];

let alertsState: RiskAlert[] = [
  {
    id: "alert_001",
    childId: "kid_liam",
    childName: "Liam",
    type: "message",
    title: "Suspicious Contact Patterns",
    description: "High probability grooming indicator detected. Contact requested confidential photo trade.",
    severity: "high",
    score: 88,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    resolved: false,
    metadata: {
      messagePreview: "[Privacy Filtered] requested confidential media trading exchange",
      senderNovelty: "new",
      keywordsFound: ["trade pics", "secret"],
      contactName: "Alex_Tr77",
      reasoning: "The sender (unknown contact) is repeatedly utilizing secrecy terms ('keep this secret', 'trade pics') which are common signatures of digital manipulation and minor grooming."
    }
  },
  {
    id: "alert_002",
    childId: "kid_liam",
    childName: "Liam",
    type: "gps",
    title: "Restricted Geofence Boundary Breach",
    description: "Liam has exited safe boundaries and entered the 'Unregulated Industrial Area'.",
    severity: "medium",
    score: 75,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    resolved: true,
    metadata: {
      locationName: "Unregulated Industrial Area"
    }
  }
];

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
const key = process.env.GEMINI_API_KEY;

if (key && key !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini SDK successfully initialized on Spykids backend");
  } catch (err) {
    console.error("Failed to initialize Gemini Client with provided key, using offline heuristics:", err);
  }
} else {
  console.log("No custom GEMINI_API_KEY detected. Utilizing preloaded heuristic Risk Engine matcher.");
}

// Deterministic Heuristics Risk Analyzer (Offline Fallback & Validation check)
function runOfflineHeuristicAnalyzer(message: string, contact: string, novelty: string, age: number) {
  const normalized = message.toLowerCase();
  
  // Keyword severity weights
  const riskKeywords = [
    { pattern: "asl", weight: 80, cat: "Sexual Solicitation" },
    { pattern: "age sex location", weight: 95, cat: "Sexual Solicitation" },
    { pattern: "send pics", weight: 90, cat: "Sexual Solicitation" },
    { pattern: "send a pic", weight: 85, cat: "Sexual Solicitation" },
    { pattern: "meet alone", weight: 95, cat: "Unsafe Meetup" },
    { pattern: "keep this secret", weight: 90, cat: "Grooming" },
    { pattern: "don't tell your mom", weight: 95, cat: "Grooming" },
    { pattern: "don't tell anyone", weight: 90, cat: "Grooming" },
    { pattern: "trade pics", weight: 95, cat: "Sexual Solicitation" },
    { pattern: "cute for your age", weight: 92, cat: "Grooming" },
    { pattern: "where do you live", weight: 70, cat: "Privacy Leaks" },
    { pattern: "are you home alone", weight: 85, cat: "Privacy Leaks" },
    { pattern: "send money", weight: 80, cat: "Financial Scam" },
    { pattern: "gift card", weight: 75, cat: "Financial Scam" },
    { pattern: "loser", weight: 65, cat: "Bullying" },
    { pattern: "ugly", weight: 60, cat: "Bullying" },
    { pattern: "shut up", weight: 50, cat: "Bullying" }
  ];

  let maxWeight = 0;
  const categories: string[] = [];
  const keywordsFound: string[] = [];

  for (const item of riskKeywords) {
    if (normalized.includes(item.pattern)) {
      keywordsFound.push(item.pattern);
      if (item.weight > maxWeight) {
        maxWeight = item.weight;
      }
      if (!categories.includes(item.cat)) {
        categories.push(item.cat);
      }
    }
  }

  if (maxWeight === 0) {
    return {
      isRisk: false,
      riskScore: 15,
      severity: "low" as const,
      categories: ["None"],
      reasoning: "No flagged keyword sequences or typical digital manipulation risk signatures identified."
    };
  }

  // Calculate modifications
  let score = maxWeight;
  
  // Age modifier: younger children are at higher risk
  if (age < 13) {
    score += 8;
  } else if (age < 15) {
    score += 3;
  }

  // Novelty multiplier: 1.15x for unrecognized contacts
  if (novelty === "new") {
    score *= 1.15;
  }

  score = Math.min(100, Math.round(score));
  const severity = score >= 85 ? "high" : score >= 70 ? "medium" : "low";

  return {
    isRisk: score >= 70,
    riskScore: score,
    severity,
    categories: categories.length > 0 ? categories : ["General Risk"],
    reasoning: `Matched risk signatures including [${keywordsFound.join(", ")}]. Highly suspicious context detected from an unknown or novel sender seeking secrecy or unmediated engagement.`
  };
}

// API: Get App State
app.get("/api/state", (req, res) => {
  res.json({
    family: familyState,
    geofences: geofencesState,
    alerts: alertsState,
    isGeminiConnected: ai !== null
  });
});

// API: Resolve Alert
app.post("/api/alerts/resolve", (req, res) => {
  const { alertId } = req.body;
  alertsState = alertsState.map(alert =>
    alert.id === alertId ? { ...alert, resolved: true } : alert
  );
  res.json({ success: true, alerts: alertsState });
});

// API: Update Custom Geofence
app.post("/api/geofences/create", (req, res) => {
  const { name, radius, type } = req.body;
  const newGeo: Geofence = {
    id: `geo_${Date.now()}`,
    name: name || "Custom Boundary",
    lat: 34.0522 + (Math.random() - 0.5) * 0.02,
    lng: -118.2437 + (Math.random() - 0.5) * 0.02,
    radius: Number(radius) || 100,
    type: type || "safe"
  };
  geofencesState.push(newGeo);
  res.json({ success: true, geofences: geofencesState });
});

// API: Delete Geofence
app.post("/api/geofences/delete", (req, res) => {
  const { id } = req.body;
  geofencesState = geofencesState.filter(g => g.id !== id);
  res.json({ success: true, geofences: geofencesState });
});

// API: Reset Pairing pin or generate
app.post("/api/pairing/generate", (req, res) => {
  const { childId } = req.body;
  const newPin = Math.floor(100000 + Math.random() * 900000).toString();
  familyState.children = familyState.children.map(c =>
    c.id === childId ? { ...c, pinCode: newPin, isPaired: false, status: "active" } : c
  );
  res.json({ success: true, pinCode: newPin, family: familyState });
});

// API: Claim / Submit Pairing Pin
app.post("/api/pairing/claim", (req, res) => {
  const { pinCode, childName, childAge } = req.body;
  const pinTrim = pinCode?.trim();
  
  // Find child with this PIN
  const targetChild = familyState.children.find(c => c.pinCode === pinTrim);
  
  if (targetChild) {
    familyState.children = familyState.children.map(c =>
      c.id === targetChild.id
        ? {
            ...c,
            isPaired: true,
            name: childName || c.name,
            age: childAge ? Number(childAge) : c.age,
            pairedAt: new Date().toISOString(),
            lastActive: new Date().toISOString()
          }
        : c
    );
    res.json({ success: true, child: targetChild });
  } else {
    // If no pin matched, build a dynamic session child specifically for simulated devices
    const newKidId = `kid_${Date.now()}`;
    const newKid: ChildDevice = {
      id: newKidId,
      name: childName || "Simulated Companion",
      age: childAge ? Number(childAge) : 13,
      isPaired: true,
      pinCode: pinTrim,
      pairedAt: new Date().toISOString(),
      status: "active",
      lastActive: new Date().toISOString()
    };
    familyState.children.push(newKid);
    res.json({ success: true, child: newKid });
  }
});

// API: Opt Out Request for 13-17 Teenagers
app.post("/api/opt-out", (req, res) => {
  const { childId, requestedPause } = req.body;
  
  familyState.children = familyState.children.map(c =>
    c.id === childId ? { ...c, status: requestedPause ? "paused" : "opted_out" } : c
  );

  const child = familyState.children.find(c => c.id === childId);

  // Surface a critical Parent Alert regarding the pause/opt-out event
  const isPause = requestedPause;
  const newAlert: RiskAlert = {
    id: `alert_opt_${Date.now()}`,
    childId: childId,
    childName: child?.name || "Teen Device",
    type: "action",
    title: isPause ? "Monitoring Stream Suspended" : "Privacy Opt-Out Requested",
    description: isPause 
      ? `Liam (14) has requested to temporarily PAUSE monitoring activity. A parental confirmation is required.`
      : `Liam (14) has requested full opt-out privacy settings.`,
    severity: "high",
    score: 95,
    timestamp: new Date().toISOString(),
    resolved: false,
    metadata: {
      reasoning: "Under Spykids Ethical Standards, minors aged 13-17 can submit Opt-out or pause triggers. A prompt conversation between parent and child is highly recommended."
    }
  };

  alertsState.unshift(newAlert);
  res.json({ success: true, family: familyState, alerts: alertsState });
});

// API: Update Subscription Plans (Stripe simulated sandbox response)
app.post("/api/subscription", (req, res) => {
  const { plan } = req.body;
  familyState.subscription = plan;
  res.json({ success: true, family: familyState });
});

// API: Live Analyze Risk (Using GEMINI Server Side)
app.post("/api/analyze", async (req, res) => {
  const { message, contact, novelty, age } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Empty message payload" });
  }

  const childAge = age ? Number(age) : 13;
  const senderContact = contact || "External Sender";
  const contactNovelty = novelty || "new";

  // Use Offline rule heuristic as validation or fallback
  const offlineResult = runOfflineHeuristicAnalyzer(message, senderContact, contactNovelty, childAge);

  if (!ai) {
    // Return offline heuristic output when Gemini is not connected
    console.log("No Gemini SDK initialized; using rule-based assessment output.");
    return res.json({
      engine: "heuristic",
      ...offlineResult
    });
  }

  try {
    const prompt = `Analyze this communication and return matching data.
Message details:
- Sender identifier: ${senderContact}
- Contact familiarity index: ${contactNovelty} (either 'new' or 'known')
- Recipients demographic age focus: ${childAge} years old child.
- Message text to analyze: "${message}"`;

    console.log(`Querying Gemini (gemini-3.5-flash) for ethical parental safety analysis of: "${message}"`);

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are the core Spykids Ethical Parental Safety Risk Engine. Your obligation is protecting minor kids online.
        Target threats to flag: Cyber-grooming, predators trying to build relationships/trust, sexual solicitations, child bullying, cyber scams/phishing, safety hazards, dangerous offline meetups.
        
        CRITICAL ETHICAL PRIVACY INSTRUCTIONS:
        Normal chit-chat (e.g., "what's up", "doing homework", "playing roblox") must yield a riskScore below 40. Keep benign logs private.
        Flag high-risk signals with score >= 70 ONLY.
        
        Calculate the riskScore (0 to 100) exactly considering:
        - Severe keyword matching (e.g. "asl", "meet up", "trade pics", "send photos", "secret friend")
        - Contact familiarity: Unknown, new senders demanding privacy increase the trigger factor
        - Child's age: Younger kids have lower safety tolerance thresholds.
        
        Provide structured JSON matching the requested schema. Do not output markdown, preambles, or additional notes. Include 'isRisk' as true if riskScore is >= 70.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isRisk: { type: Type.BOOLEAN },
            riskScore: { type: Type.INTEGER },
            severity: { type: Type.STRING },
            categories: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            reasoning: { type: Type.STRING }
          },
          required: ["isRisk", "riskScore", "severity", "categories", "reasoning"]
        }
      }
    });

    const parsedJsonData = JSON.parse(response.text?.trim() || "{}");
    
    // Safety clamp in-case AI response is missing values
    const finalScore = Number(parsedJsonData.riskScore);
    const resolvedResult = {
      engine: "gemini",
      isRisk: finalScore >= 70,
      riskScore: finalScore,
      severity: parsedJsonData.severity || (finalScore >= 85 ? "high" : finalScore >= 70 ? "medium" : "low"),
      categories: parsedJsonData.categories || ["General threat"],
      reasoning: parsedJsonData.reasoning || "Assessment executed by Spykids AI guardian logic nodes."
    };

    res.json(resolvedResult);

  } catch (error: any) {
    console.error("Failed executing Gemini analysis, defaulting safely to offline heuristic engine:", error);
    res.json({
      engine: "heuristic-fallback",
      error: error.message,
      ...offlineResult
    });
  }
});

// API: Simulate a child's phone event in the background (Creating real Alerts)
app.post("/api/simulation/message", (req, res) => {
  const { childId, sender, content, novelty, riskAssessment } = req.body;
  
  const child = familyState.children.find(c => c.id === childId);
  const childName = child ? child.name : "Device";

  // Create the alert from assessment
  const isHighRisk = riskAssessment.riskScore >= 70;
  
  if (isHighRisk) {
    const newAlert: RiskAlert = {
      id: `alert_msg_${Date.now()}`,
      childId: childId,
      childName: childName,
      type: "message",
      title: "Potential Safety Risk Flagged",
      description: `Risk score (${riskAssessment.riskScore}/100) exceeded threshold. Unmanaged conversation from ${sender}.`,
      severity: riskAssessment.severity,
      score: riskAssessment.riskScore,
      timestamp: new Date().toISOString(),
      resolved: false,
      metadata: {
        messagePreview: `[Privacy Shield Filtered] dangerous triggers detected`,
        senderNovelty: novelty,
        keywordsFound: riskAssessment.categories,
        contactName: sender,
        reasoning: riskAssessment.reasoning
      }
    };
    alertsState.unshift(newAlert);
  }

  // Update Child Active Time
  familyState.children = familyState.children.map(c =>
    c.id === childId ? { ...c, lastActive: new Date().toISOString() } : c
  );

  res.json({
    success: true,
    alertCreated: isHighRisk,
    alerts: alertsState,
    family: familyState
  });
});

// Live Geo Tracking trigger simulator
app.post("/api/simulation/gps-breach", (req, res) => {
  const { childId, geofenceName, fenceType } = req.body;
  
  const child = familyState.children.find(c => c.id === childId);
  const childName = child ? child.name : "Device";

  const newAlert: RiskAlert = {
    id: `alert_gps_${Date.now()}`,
    childId: childId,
    childName: childName,
    type: "gps",
    title: fenceType === "restricted" ? "Restricted Boundary Breach" : "Safe Zone Departed",
    description: `${childName} has entered the restricted '${geofenceName}' zone boundaries.`,
    severity: "medium",
    score: fenceType === "restricted" ? 82 : 72,
    timestamp: new Date().toISOString(),
    resolved: false,
    metadata: {
      locationName: geofenceName,
      reasoning: `Geolocational boundary sensors reported entry coordinates matching restricted spatial zones configured under your safety policy.`
    }
  };

  alertsState.unshift(newAlert);
  res.json({ success: true, alerts: alertsState });
});

// Setup Vite & Static Fallbacks
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Mounting Vite Middleware for local development...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving pre-built assets from /dist in Production mode...");
    
    // Resolve absolute path to dist directory safely across ESM and CommonJS
    let currentDir = process.cwd();
    try {
      currentDir = path.dirname(fileURLToPath(import.meta.url));
    } catch {
      currentDir = __dirname;
    }
    
    const distPath = currentDir.endsWith("dist") ? currentDir : path.join(currentDir, "dist");
    console.log(`Setting up static files from resolved path: ${distPath}`);
    
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`=============================================================`);
    console.log(`Spykids full-stack backend running successfully on http://localhost:${PORT}`);
    console.log(`=============================================================`);
  });
}

startServer();
