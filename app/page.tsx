"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Sparkles, BarChart3, Users, Zap } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, login } = useStore();
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  if (isAuthenticated) {
    router.push("/dashboard");
    return null;
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!apiKey.trim()) { setError("Please enter your API key"); return; }
    const success = login(apiKey);
    if (success) { router.push("/dashboard"); } else { setError("Invalid API key"); }
  }

  function handleDemoAccess() {
    login("pk_demo_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="text-xl font-bold tracking-tight">
            Partner<span className="font-normal text-gray-400">AI</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowLogin(true)} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Log in</button>
            <Button onClick={handleDemoAccess} size="sm">Try Demo <ArrowRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700 mb-8">
            <Sparkles className="h-4 w-4" /> AI-Powered Attribution
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-gray-900 mb-6">
            Partner Attribution,{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Reimagined</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Track every touchpoint, calculate fair credit splits with 5 attribution models, and automate partner payouts — all powered by AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={handleDemoAccess}>Explore Live Demo <ArrowRight className="h-5 w-5" /></Button>
            <Button variant="secondary" size="lg" onClick={() => setShowLogin(true)}>Sign in with API key</Button>
          </div>
          <p className="text-sm text-gray-400 mt-4">Free to start · No credit card required</p>
        </div>
      </section>

      {/* Demo Preview */}
      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto relative">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-br from-indigo-400/20 via-purple-400/20 to-pink-400/20 blur-[100px] rounded-full" />
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 text-center text-xs text-gray-400">app.partnerai.com/dashboard</div>
            </div>
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div><p className="text-sm text-gray-500">Total Attributed Revenue</p><p className="text-3xl font-bold text-gray-900">$480,000</p></div>
                <div className="text-right"><p className="text-sm text-gray-500">Win Rate</p><p className="text-3xl font-bold text-emerald-600">71%</p></div>
              </div>
              <div className="space-y-3">
                {[
                  { name: "Sarah Anderson", pct: 40, amount: "$48,000" },
                  { name: "Marcus Johnson", pct: 35, amount: "$42,000" },
                  { name: "Elena Rodriguez", pct: 25, amount: "$30,000" },
                ].map((p) => (
                  <div key={p.name} className="flex items-center gap-4">
                    <div className="w-32 text-sm font-medium text-gray-700">{p.name}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${p.pct}%` }} />
                    </div>
                    <div className="w-16 text-sm font-semibold text-gray-900 text-right">{p.pct}%</div>
                    <div className="w-20 text-sm text-gray-500 text-right">{p.amount}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Attribution powers everything</h2>
            <p className="text-lg text-gray-500">Five models, one platform. Know exactly who deserves credit.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: BarChart3, title: "5 Attribution Models", desc: "Equal Split, First Touch, Last Touch, Time Decay, and Role-Based — compare them side-by-side." },
              { icon: Users, title: "Partner Management", desc: "Onboard partners, track performance, manage commissions — all in one place." },
              { icon: Zap, title: "Real-Time Pipeline", desc: "Every touchpoint tracked automatically. Attribution calculated instantly when deals close." },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-8 border border-gray-100">
                <div className="rounded-lg bg-indigo-50 p-3 w-fit mb-5"><f.icon className="h-6 w-6 text-indigo-600" /></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to see your partner impact?</h2>
          <p className="text-lg text-gray-500 mb-8">Start with the live demo. No sign-up required.</p>
          <Button size="lg" onClick={handleDemoAccess}>Launch Demo Dashboard <ArrowRight className="h-5 w-5" /></Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-sm text-gray-400">© 2026 PartnerAI, Inc.</div>
          <div className="text-xl font-bold tracking-tight">Partner<span className="font-normal text-gray-400">AI</span></div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) setShowLogin(false); }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
            <div className="text-center mb-8">
              <div className="text-2xl font-bold tracking-tight mb-2">Partner<span className="font-normal text-gray-400">AI</span></div>
              <p className="text-sm text-gray-500">Enter your API key to access the dashboard</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input label="API Key" placeholder="pk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" value={apiKey} onChange={(e) => { setApiKey(e.target.value); setError(""); }} error={error} />
              <Button type="submit" className="w-full">Sign In</Button>
            </form>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-gray-400">or</span></div>
            </div>
            <Button variant="secondary" className="w-full" onClick={handleDemoAccess}>
              <Sparkles className="h-4 w-4" /> Access Demo (No Key Required)
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
