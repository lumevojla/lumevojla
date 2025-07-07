"use client";
import { useState } from "react";

type Mode = "waitlist" | "interview";

export default function Home() {
  const [mode, setMode] = useState<Mode>("waitlist");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    try {
      await fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: mode }),
      });
      setStatus("ok");
      setForm({ name: "", email: "", phone: "" });
    } catch {
      setStatus("err");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#5B34FF] text-white px-4">
      <div className="w-full max-w-md">
        {/* Tab Switcher */}
        <div className="mb-6 flex rounded-xl bg-white/10 p-1">
          {(["waitlist", "interview"] as const).map((m) => (
            <button
              key={m}
              className={`w-1/2 rounded-lg py-2 text-sm font-semibold transition ${
                mode === m ? "bg-white text-[#5B34FF]" : "text-white/70"
              }`}
              onClick={() => {
                setMode(m);
                setStatus("idle");
              }}
            >
              {m === "waitlist" ? "Join Wait-list" : "Request Interview"}
            </button>
          ))}
        </div>

        {/* Headline */}
        <h1 className="mb-4 text-center font-serif text-3xl leading-snug">
          {mode === "waitlist"
            ? "Get a life that gets you."
            : "Let’s see if we’re aligned."}
        </h1>
        <p className="mb-6 text-center text-white/80">
          {mode === "waitlist"
            ? "Early members unlock founding perks."
            : "Tell us how to reach you and we’ll schedule a 10-min call."}
        </p>

        {/* Success / Error messages */}
        {status === "ok" && (
          <p className="mb-4 rounded-lg bg-green-600/20 p-3 text-center text-green-200">
            Thank you! We’ll be in touch.
          </p>
        )}
        {status === "err" && (
          <p className="mb-4 rounded-lg bg-red-600/20 p-3 text-center text-red-200">
            Oops — please try again.
          </p>
        )}

        {/* Form */}
        {status !== "ok" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "interview" && (
              <>
                <input
                  required
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border-0 px-4 py-3 text-black"
                />
                <input
                  required
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-lg border-0 px-4 py-3 text-black"
                />
              </>
            )}

            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border-0 px-4 py-3 text-black"
            />

            <button
              type="submit"
              className="w-full rounded-lg bg-white py-3 font-semibold text-[#5B34FF] transition hover:bg-white/90"
            >
              {mode === "waitlist" ? "Join Wait-list" : "Send Request"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}