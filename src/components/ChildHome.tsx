/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Shield, Lock, Eye, CheckCircle, AlertCircle, RefreshCw, Award, Heart, HelpCircle, Key, ArrowRight } from "lucide-react";
import { ChildDevice, SafetyQuizQuestion } from "../types";

interface ChildHomeProps {
  currentChild: ChildDevice | null;
  onPairChild: (name: string, age: number, pin: string) => Promise<boolean>;
  onTriggerOptOut: (childId: string, isPause: boolean) => Promise<void>;
  onBackToLanding: () => void;
}

const SAFETY_QUIZ: SafetyQuizQuestion[] = [
  {
    id: "q1",
    question: "An online gaming friend you met last week asks you to keep a conversation secret from your parents. What should you do?",
    options: [
      "Keep the secret so they don't get upset.",
      "Tell a parent or trusted adult immediately. Real friends don't ask you to hide things.",
      "Just ignore it and continue playing games.",
      "Give them your telephone number instead."
    ],
    correctIndex: 1,
    explanation: "Whenever someone online asks you to keep secrets from your parents, it is a big warning sign (grooming). Safe people will never ask you to hide your friendship."
  },
  {
    id: "q2",
    question: "A contact you don't know well asks you to 'trade pictures' or send a selfie. How should you respond?",
    options: [
      "Send a normal photo just to be polite.",
      "Trade a photo if they send yours first.",
      "Say NO, stop chatting, and tell a parent. Never send photos to anyone you don't know in real life.",
      "Block them but don't tell anyone about it."
    ],
    correctIndex: 2,
    explanation: "Never send photos of yourself, your family, or your home to online acquaintances. Keep your media private!"
  },
  {
    id: "q3",
    question: "Someone is repeatedly posting mean comments about your classmate in a group chat. What is the best action?",
    options: [
      "Help your classmate by posting equally mean comments back.",
      "Ignore it so you don't become the next target.",
      "Save screenshots and tell a teacher or parent. Stand up against cyberbullying safely.",
      "Leave the group chat and delete your account."
    ],
    correctIndex: 3,
    explanation: "Documenting cyberbullying and raising it to a supervisor or parent prevents spread of digital harassment."
  }
];

export default function ChildHome({ currentChild, onPairChild, onTriggerOptOut, onBackToLanding }: ChildHomeProps) {
  // Pairing screen form state
  const [pinInput, setPinInput] = useState("");
  const [kidName, setKidName] = useState("");
  const [kidAge, setKidAge] = useState(13);
  const [pairingError, setPairingError] = useState("");
  const [isSubmittingPair, setIsSubmittingPair] = useState(false);

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  // Opt-out requests status
  const [optOutActionTriggered, setOptOutActionTriggered] = useState<string | null>(null);

  const handlePairSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPairingError("");
    
    if (!pinInput.trim() || !kidName.trim()) {
      setPairingError("Please fill in both the child name and pairing PIN code.");
      return;
    }

    setIsSubmittingPair(true);
    const success = await onPairChild(kidName.trim(), kidAge, pinInput.trim());
    setIsSubmittingPair(false);

    if (!success) {
      setPairingError("Invalid static PIN code. Creating a customized runtime simulator account for testing instead.");
    }
  };

  const handleQuizAnswer = (optionIdx: number) => {
    if (selectedOption !== null) return; // Answered already
    setSelectedOption(optionIdx);
    setShowExplanation(true);
    if (optionIdx === SAFETY_QUIZ[currentQuizIndex].correctIndex) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    if (currentQuizIndex < SAFETY_QUIZ.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setQuizScore(0);
    setShowExplanation(false);
    setQuizFinished(false);
  };

  const handleTriggerOptOutClick = async (isPause: boolean) => {
    if (!currentChild) return;
    setOptOutActionTriggered(isPause ? "pause" : "optout");
    await onTriggerOptOut(currentChild.id, isPause);
    setTimeout(() => {
      setOptOutActionTriggered(null);
    }, 5000);
  };

  return (
    <div id="child-view" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Mini Header / Navigation */}
      <nav className="border-b border-slate-900 bg-slate-950/90 py-4 px-6 sticky top-0 z-50 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-pink-500 animate-pulse" />
          <span className="font-bold tracking-wider text-sm uppercase">SPYKIDS <span className="text-pink-500">COMPANION</span></span>
        </div>
        <button
          onClick={onBackToLanding}
          className="px-3.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs font-semibold cursor-pointer transition-colors"
        >
          Return to Portal
        </button>
      </nav>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {!currentChild ? (
          /* UNPAIRED DEVICE REGISTRATION VIEW */
          <div className="max-w-md mx-auto bg-slate-900 border border-slate-840 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute -top-12 -left-12 w-40 h-40 bg-pink-500/10 rounded-full blur-2xl"></div>
            
            <div className="text-center mb-6 relative">
              <div className="w-14 h-14 bg-pink-500/10 text-pink-500 rounded-2xl border border-pink-500/20 flex items-center justify-center mx-auto mb-4">
                <Key className="w-7 h-7" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold uppercase text-slate-100">Pair Companion Device</h2>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Enter your pairing credentials. Regular chats are encrypted & private. Only threat alerts notify parents.
              </p>
            </div>

            {pairingError && (
              <div className="p-3.5 bg-amber-950/40 border border-amber-500/20 rounded-xl text-amber-200 text-xs mb-4">
                {pairingError}
              </div>
            )}

            <form onSubmit={handlePairSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Child's Name</label>
                <input
                  type="text"
                  placeholder="e.g. Liam"
                  value={kidName}
                  onChange={(e) => setKidName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-pink-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Child's Age</label>
                <input
                  type="number"
                  min="5"
                  max="17"
                  value={kidAge}
                  onChange={(e) => setKidAge(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-pink-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Device Pairing Code PIN</label>
                <input
                  type="text"
                  placeholder="6-Digit PIN (e.g., 582914)"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm tracking-wide font-mono text-center focus:outline-hidden focus:ring-2 focus:ring-pink-500/50 placeholder-slate-700"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-1.5 block">
                  Copy Liam's PIN (<span className="font-mono text-purple-400">582914</span>) or Sophie's PIN (<span className="font-mono text-purple-400">123654</span>) from the Parent Portal.
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmittingPair}
                className="w-full py-3 rounded-xl bg-pink-600 hover:bg-pink-500 disabled:bg-slate-800 text-white font-semibold text-sm flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                {isSubmittingPair ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-pink-200" />
                ) : (
                  <>
                    Connect Device <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* ACTIVE COMPANION WORKSPACE (PAIRED STATUS) */
          <div className="space-y-6">
            
            {/* Companion Status Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="absolute top-0 right-0 w-36 h-36 bg-pink-500/5 rounded-full blur-2xl"></div>
              
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h2 className="text-xl font-bold text-slate-100">Companion Protection is Active</h2>
                    <span className="px-2.5 py-0.5 bg-emerald-950 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      Protected
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">
                    Device: <span className="text-slate-200 font-semibold">{currentChild.name}</span> (Age {currentChild.age}) • Paired in Family Safe Space
                  </p>
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-400 font-medium text-center sm:text-right">
                <div className="text-[10px] font-bold uppercase text-slate-500">PARENTS ACCOUNT</div>
                <div className="text-slate-200 mt-0.5">Simon J. Cleary</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Privacy Disclosures and Opt-Out (Teenagers 13-17) */}
              <div className="md:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-pink-400" /> Transparent Ethics Disclosure
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Spykids Guardian has strict hard safeguards to respect minor privacy. Unlike stealthy stalkerware, your security tools are completely open:
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800/40">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">Anti-Stealth Mandate</h4>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        This application is permanently visible and cannot run in hidden mode. No secret screenshots or keylogger scripts are active.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800/40">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">Zero Full Archives</h4>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        We NEVER record or send entire chat logs. Your casual conversations remain entirely private. Only dangerous elements (scores &gt;= 70) generate parent alerts.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800/40">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">Dual Geofence Guard</h4>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        The app validates coordinates against family safety guidelines. Leaving school or entering designated hazardous zones warns parents.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Teenagers (13-17) Opt-Out request and pause flow */}
                {currentChild.age >= 13 ? (
                  <div className="border-t border-slate-800 pt-6 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-pink-400 uppercase tracking-wider">Teen Privacy Action Drawer (Ages 13-17)</h4>
                      <p className="text-slate-400 text-xs mt-1">
                        As a teenager, you have the right to request changes to monitoring. Requesting a pause or opt-out will update your status and notify parents instantly.
                      </p>
                    </div>

                    {optOutActionTriggered ? (
                      <div className="p-4 bg-purple-950/40 border border-purple-500/20 text-purple-200 rounded-xl text-xs flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-purple-400 shrink-0 animate-ping" />
                        <div>
                          <p className="font-bold">Privacy Request Sent to Parents Dashboard!</p>
                          <p className="text-[11px] mt-0.5 text-purple-300">
                            Status updated. Spykids encourages an open discussion between parents and teens regarding online guardrails.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleTriggerOptOutClick(true)}
                          className="py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-300 hover:text-white transition-colors text-xs font-semibold cursor-pointer"
                        >
                          Request 1-Hour Pause
                        </button>
                        <button
                          onClick={() => handleTriggerOptOutClick(false)}
                          className="py-2.5 px-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-purple-400 hover:text-purple-300 transition-colors text-xs font-bold cursor-pointer"
                        >
                          Submit Opt-Out Request
                        </button>
                      </div>
                    )}
                    <div className="text-[10px] text-slate-500 italic">
                      Current Device Status: <span className="font-semibold text-slate-300 uppercase">{currentChild.status || "active"}</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-950 border border-slate-900 rounded-xl p-3.5 text-[11px] text-slate-500 leading-relaxed italic text-center">
                    Note: Younger family members (Under 13) are automatically fully parent-managed for strict child-safety compliance.
                  </div>
                )}
              </div>

              {/* Interactive Cyber Academy Card (Educational Module) */}
              <div className="md:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-xl"></div>
                
                <div>
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
                    <Award className="w-5 h-5 text-pink-400 animate-bounce" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-200">Cyber Safety Academy</h3>
                      <p className="text-slate-500 text-[10px]">Learn to navigate online safely & unlock badges.</p>
                    </div>
                  </div>

                  {!quizFinished ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <span>Question {currentQuizIndex + 1} of {SAFETY_QUIZ.length}</span>
                        <span className="text-pink-400">Score: {quizScore}</span>
                      </div>

                      <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                        {SAFETY_QUIZ[currentQuizIndex].question}
                      </p>

                      <div className="space-y-2 pt-2">
                        {SAFETY_QUIZ[currentQuizIndex].options.map((option, idx) => {
                          let btnStyle = "bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300";
                          if (selectedOption !== null) {
                            if (idx === SAFETY_QUIZ[currentQuizIndex].correctIndex) {
                              btnStyle = "bg-emerald-950 border border-emerald-500/40 text-emerald-300";
                            } else if (idx === selectedOption) {
                              btnStyle = "bg-rose-950 border border-rose-500/40 text-rose-300";
                            } else {
                              btnStyle = "bg-slate-950/40 border border-slate-900 text-slate-600 cursor-not-allowed";
                            }
                          }
                          return (
                            <button
                              key={idx}
                              onClick={() => handleQuizAnswer(idx)}
                              disabled={selectedOption !== null}
                              className={`w-full text-left p-3 rounded-xl text-xs font-medium transition-colors cursor-pointer ${btnStyle}`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>

                      {showExplanation && (
                        <div className="p-3 bg-purple-950/30 border border-purple-500/15 rounded-xl text-[11px] text-purple-300 leading-relaxed mt-2.5">
                          <HelpCircle className="w-3.5 h-3.5 inline mr-1 text-purple-400 align-text-bottom" />
                          {SAFETY_QUIZ[currentQuizIndex].explanation}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 space-y-4">
                      <div className="w-16 h-16 bg-pink-500/10 border-2 border-pink-500/30 text-pink-400 rounded-full flex items-center justify-center mx-auto mb-3 animate-spin duration-1000">
                        <Award className="w-8 h-8" />
                      </div>
                      <h4 className="text-base font-bold text-slate-100 uppercase">Quiz Complete!</h4>
                      <p className="text-slate-400 text-xs px-2 leading-relaxed">
                        Excellent job! You correctly identified <span className="font-bold text-white">{quizScore} out of {SAFETY_QUIZ.length}</span> safety strategies. You have unlocked your Cyber Safety Badge!
                      </p>
                      <button
                        onClick={resetQuiz}
                        className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs transition-colors cursor-pointer mt-2"
                      >
                        Retake Safety Quiz
                      </button>
                    </div>
                  )}
                </div>

                {!quizFinished && selectedOption !== null && (
                  <button
                    onClick={handleNextQuiz}
                    className="w-full mt-4 py-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    Next Question <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>

          </div>
        )}
      </main>

      {/* Spykids Privacy Footer badge */}
      <footer className="py-6 mt-auto text-center border-t border-slate-900 bg-slate-950">
        <p className="text-[10px] text-slate-600 tracking-wider font-bold uppercase flex items-center justify-center gap-1.5">
          <Heart className="w-3 h-3 text-pink-500 fill-pink-500" /> Protected by Spykids Guardian Software Systems, Inc.
        </p>
      </footer>
    </div>
  );
}
