"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is bunexdiv?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "bunexdiv is a URL shortener that helps people turn long links into cleaner, shareable links for posts, campaigns, and everyday communication.",
      },
    },
    {
      "@type": "Question",
      name: "How does it work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Users paste a long URL, the system generates a short link, and they can copy it for sharing.",
      },
    },
    {
      "@type": "Question",
      name: "Why use a URL shortener?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Shortened links are cleaner, easier to share, and more readable across social platforms, messaging apps, and marketing campaigns.",
      },
    },
  ],
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const copyButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const pastedText = event.clipboardData?.getData("text").trim();
      if (pastedText) {
        event.preventDefault();
        setUrl(pastedText);
        setShortUrl("");
        setError("");
        setCopied(false);
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  useEffect(() => {
    if (shortUrl) {
      copyButtonRef.current?.focus();
    }
  }, [shortUrl]);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!url.trim() || isLoading) return;

    setError("");
    setShortUrl("");
    setCopied(false);
    setIsLoading(true);

    try {
      const response = await fetch(
        String(process.env.NEXT_PUBLIC_GENERATION_API_URL),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: url.trim() }),
        },
      );
      const result = (await response.json()) as {
        message?: string;
        data?: { shortUrl?: string };
      };

      if (!response.ok || !result.data?.shortUrl) {
        throw new Error(result.message ?? "Unable to shorten this URL.");
      }

      setShortUrl(result.data.shortUrl);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to shorten this URL.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shortUrl) return;
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main
      className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-slate-950 px-4 text-slate-100 select-none"
      aria-label="bunexdiv home page">
      {/* Background Gradients & Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-160 rounded-full bg-cyan-500/15 blur-[128px]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 -translate-x-1/2 h-96 w-160 rounded-full bg-indigo-500/15 blur-[128px]" />

      <section className="relative z-10 flex w-full max-w-xl flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3.5 py-1.5 text-xs font-medium text-slate-300 shadow-inner backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
          </span>
          URL Shortner
        </div>

        {/* Heading */}
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
          Shorten links with{" "}
          <span className="bg-linear-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
            precision.
          </span>
        </h1>

        <p className="mt-3 max-w-md text-sm text-slate-400 sm:text-base">
          Convert bulky URLs into clean, secure, and lightning-fast links.
        </p>

        {/* Input Form */}
        <form
          onSubmit={handleSave}
          aria-busy={isLoading}
          aria-label="Shorten a URL"
          className="mt-8 w-full">
          <div className="relative flex items-center rounded-2xl border border-slate-800 bg-slate-900/60 p-1.5 shadow-2xl backdrop-blur-xl transition-all focus-within:border-cyan-500/50 focus-within:ring-2 focus-within:ring-cyan-500/20">
            <input
              id="url-input"
              type="url"
              autoComplete="off"
              inputMode="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setShortUrl("");
                setError("");
                setCopied(false);
              }}
              placeholder="Paste your long link here..."
              className="h-12 w-full min-w-0 bg-transparent px-4 text-sm text-white placeholder-slate-500 outline-none sm:text-base"
            />
            <button
              type="submit"
              disabled={!url.trim() || isLoading}
              className="relative inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500 px-5 text-sm font-semibold text-slate-950 transition-all hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 active:scale-95 disabled:pointer-events-none disabled:opacity-40">
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin text-slate-950"
                    viewBox="0 0 24 24"
                    fill="none">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Shortening
                </span>
              ) : (
                "Shorten"
              )}
            </button>
          </div>
        </form>

        {/* Dynamic Non-Jumping Slot */}
        <div className="mt-5 flex h-20 w-full items-center justify-center">
          {error ? (
            <div
              role="alert"
              aria-live="polite"
              className="flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-xs font-medium text-rose-400 backdrop-blur-sm sm:text-sm">
              <svg
                className="h-4 w-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          ) : shortUrl ? (
            /* Cyber Deck Link Card */
            <div
              className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl border border-cyan-500/40 bg-slate-900/90 p-2.5 pl-4 shadow-[0_0_25px_rgba(6,182,212,0.15)] backdrop-blur-xl transition-all hover:border-cyan-400/70"
              aria-live="polite">
              {/* Background scanning ambient light */}
              <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-cyan-500/5 to-transparent opacity-50 transition-opacity group-hover:opacity-100" />

              {/* URL Display Area */}
              <div className="relative flex min-w-0 items-center gap-2.5 pr-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.828 14.828a4 4 0 015.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </div>
                <span className="truncate font-mono text-sm font-semibold tracking-tight text-cyan-300">
                  {shortUrl}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="relative flex shrink-0 items-center gap-1.5">
                {/* External Tab Icon */}
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="Open link in new tab"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-800/80 text-slate-300 transition-all hover:border-slate-700 hover:bg-slate-700 hover:text-white active:scale-95">
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>

                {/* Dynamic Copy Button */}
                <button
                  type="button"
                  onClick={handleCopy}
                  ref={copyButtonRef}
                  aria-label="Copy short URL"
                  className={`inline-flex h-9 items-center gap-1.5 rounded-xl px-3.5 text-xs font-semibold tracking-wide transition-all active:scale-95 ${
                    copied
                      ? "border border-emerald-500/40 bg-emerald-500/15 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                      : "border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:text-white"
                  }`}>
                  {copied ? (
                    <>
                      <svg
                        className="h-3.5 w-3.5 text-emerald-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-3.5 w-3.5 opacity-70"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2">
                        <rect
                          width="14"
                          height="14"
                          x="8"
                          y="8"
                          rx="2"
                          ry="2"
                        />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-600">
              Press{" "}
              <kbd className="rounded bg-slate-900 px-1.5 py-0.5 text-slate-400 border border-slate-800">
                Ctrl
              </kbd>{" "}
              +{" "}
              <kbd className="rounded bg-slate-900 px-1.5 py-0.5 text-slate-400 border border-slate-800">
                V
              </kbd>{" "}
              anywhere to auto-paste
            </p>
          )}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </main>
  );
}
