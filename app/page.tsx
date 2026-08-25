"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

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
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-linear-to-br from-purple-300 via-white to-pink-300 px-4 py-8 text-slate-950 sm:px-8 sm:py-12 lg:px-12 xl:px-20 2xl:px-28 3xl:px-40">
      <div className="pointer-events-none absolute -left-24 top-12 h-56 w-56 rounded-full bg-cyan-300/35 blur-3xl sm:h-72 sm:w-72 lg:-left-20 lg:top-20 xl:h-96 xl:w-96 2xl:h-120 2xl:w-120" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-amber-200/60 blur-3xl sm:h-80 sm:w-80 lg:-right-16 xl:h-104 xl:w-104 2xl:h-136 2xl:w-136" />

      <section className="relative w-full max-w-xl text-center sm:max-w-2xl lg:max-w-3xl xl:max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/55 px-3 py-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-cyan-700 shadow-sm backdrop-blur-sm sm:mb-7 sm:px-4 sm:text-xs xl:mb-9 xl:px-5 xl:py-2.5 2xl:mb-10">
          <span className="h-2 w-2 rounded-full bg-cyan-500" />
          Quick link maker
        </div>

        <h1 className="font-sans text-4xl font-black tracking-tight text-slate-900 sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl 2xl:text-9xl 3xl:text-[10rem]">
          Make links <span className="text-cyan-600">lighter.</span>
        </h1>
        <form
          onSubmit={handleSave}
          aria-busy={isLoading}
          className="mx-auto mt-7 w-full max-w-xl rounded-3xl border-2 border-cyan-400/70 bg-white/85 p-3 text-left shadow-2xl shadow-cyan-900/15 ring-4 ring-white/60 backdrop-blur-md sm:mt-10 sm:max-w-2xl sm:p-4 xl:mt-10 xl:max-w-3xl xl:rounded-4xl xl:p-5 2xl:mt-14 2xl:max-w-5xl 2xl:p-6">
          <div className="mb-2 px-1 sm:px-2">
            <label
              htmlFor="url-input"
              className="text-sm font-bold text-slate-800 sm:text-base">
              URL
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
              className="h-16 min-w-0 flex-1 rounded-2xl border-2 border-purple-200 bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 sm:h-14 sm:px-5 sm:text-base xl:h-15 xl:px-6 xl:text-lg 2xl:h-18"
            />
            <button
              type="submit"
              disabled={!url.trim() || isLoading}
              className="h-14 rounded-2xl bg-cyan-600 px-7 text-base font-bold text-white shadow-lg shadow-cyan-600/20 transition hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none md:min-w-36 xl:h-15 xl:px-9 xl:text-lg 2xl:h-18">
              {isLoading ? "Shortening..." : "Shorten URL"}
            </button>
          </div>
          <p
            aria-live="polite"
            className="mt-3 min-h-5 px-1 text-xs font-semibold text-rose-600 sm:px-2 sm:text-sm">
            {error}
          </p>
        </form>

        <div className="mx-auto mt-5 min-h-36 w-full max-w-xl sm:min-h-28 sm:max-w-2xl xl:max-w-3xl">
          {shortUrl && (
            <section
              className="w-full rounded-3xl border border-amber-300/80 bg-amber-50/90 p-3 text-left shadow-xl shadow-amber-900/10 sm:p-4 xl:p-5"
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
    </main>
  );
}
