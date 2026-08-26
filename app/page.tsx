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
    setError("");
    setShortUrl("");
    setCopied(false);
    setIsLoading(true);

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_GENERATION_API_URL ??
          "http://localhost:3001/api/v1/shorten",
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
  };

  return (
    <main
      className="relative flex h-screen max-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-purple-300 via-white to-pink-300 px-4 py-6 text-slate-950 sm:px-8 lg:px-12"
      aria-label="bunexdiv home page">
      <div className="pointer-events-none absolute -left-24 top-12 h-56 w-56 rounded-full bg-cyan-300/35 blur-3xl sm:h-72 sm:w-72 lg:-left-20 lg:top-20" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-amber-200/60 blur-3xl sm:h-80 sm:w-80 lg:-right-16" />

      <section className="relative w-full max-w-4xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/55 px-3 py-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-cyan-700 shadow-sm backdrop-blur-sm sm:px-4 sm:text-xs">
          <span className="h-2 w-2 rounded-full bg-cyan-500" />
          Quick link maker
        </div>

        <h1 className="font-sans text-[clamp(3rem,7vw,5.5rem)] font-black tracking-tight text-slate-900 leading-[0.9]">
          Shorten long URLs into{" "}
          <span className="text-cyan-600">cleaner links.</span>
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-700 sm:text-base lg:text-lg">
          bunexdiv helps you shorten long links for social posts, campaigns, and
          everyday sharing without losing clarity.
        </p>

        <form
          onSubmit={handleSave}
          aria-busy={isLoading}
          aria-label="Shorten a URL"
          className="mx-auto mt-7 w-full max-w-xl rounded-3xl border-2 border-cyan-400/70 bg-white/85 p-3 text-left shadow-2xl shadow-cyan-900/15 ring-4 ring-white/60 backdrop-blur-md sm:p-4 xl:rounded-4xl xl:p-5">
          <div className="mb-2 px-1 sm:px-2">
            <label
              htmlFor="url-input"
              className="text-sm font-bold text-slate-800 sm:text-base">
              Paste a long URL
            </label>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:gap-4">
            <input
              id="url-input"
              type="url"
              autoComplete="url"
              inputMode="url"
              value={url}
              onChange={(event) => {
                setUrl(event.target.value);
                setShortUrl("");
                setError("");
                setCopied(false);
              }}
              placeholder="https://your-long-url.com/..."
              className="h-16 min-w-0 flex-1 rounded-2xl border-2 border-purple-200 bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 sm:h-14 sm:px-5 sm:text-base"
            />
            <button
              type="submit"
              disabled={!url.trim() || isLoading}
              className="h-14 rounded-2xl bg-cyan-600 px-7 text-base font-bold text-white shadow-lg shadow-cyan-600/20 transition hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none md:min-w-36">
              {isLoading ? "Shortening..." : "Shorten URL"}
            </button>
          </div>
          <p
            aria-live="polite"
            className="mt-3 min-h-5 px-1 text-xs font-semibold text-rose-600 sm:px-2 sm:text-sm">
            {error}
          </p>
        </form>

        <div className="mx-auto mt-5 min-h-36 w-full max-w-xl sm:max-w-2xl">
          {shortUrl && (
            <section
              className="w-full rounded-3xl border border-amber-300/80 bg-amber-50/90 p-3 text-left shadow-xl shadow-amber-900/10 sm:p-4"
              aria-live="polite">
              <p className="mb-2 px-1 text-xs font-bold uppercase tracking-[0.18em] text-amber-700 sm:px-2">
                Your short URL
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="min-w-0 flex-1 truncate rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-cyan-700 underline decoration-cyan-300 underline-offset-4 sm:px-5 sm:text-base">
                  {shortUrl}
                </a>
                <button
                  type="button"
                  onClick={handleCopy}
                  ref={copyButtonRef}
                  aria-label="Copy short URL"
                  className="h-12 rounded-2xl bg-amber-400 px-6 text-sm font-bold text-amber-950 transition hover:bg-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-200 sm:min-w-28 sm:text-base">
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </section>
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
