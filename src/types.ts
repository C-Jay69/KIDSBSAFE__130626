/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum SubscriptionPlan {
  FREE = "FREE",
  BASIC = "BASIC",
  PREMIUM = "PREMIUM"
}

export interface User {
  id: string;
  email: string;
  role: "parent" | "child";
  name: string;
  familyId?: string;
}

export interface Family {
  id: string;
  name: string;
  parentId: string;
  children: ChildDevice[];
  subscription: SubscriptionPlan;
  subscribedAt?: string;
}

export interface ChildDevice {
  id: string;
  name: string;
  age: number;
  isPaired: boolean;
  pairedAt?: string;
  pinCode: string;
  status: "active" | "paused" | "opted_out"; // For 13+ pause/opt-out status
  optOutRequestDate?: string;
  lastActive?: string;
}

export interface Geofence {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number; // in meters
  type: "safe" | "restricted";
}

export interface RiskAlert {
  id: string;
  childId: string;
  childName: string;
  type: "message" | "gps" | "action";
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  score: number;
  timestamp: string;
  metadata: {
    messagePreview?: string;
    senderNovelty?: "new" | "known";
    keywordsFound?: string[];
    locationName?: string;
    contactName?: string;
    reasoning?: string;
  };
  resolved: boolean;
}

export interface SafetyQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MessageSimulation {
  id: string;
  sender: string;
  content: string;
  novelty: "new" | "known";
  timestamp: string;
}
