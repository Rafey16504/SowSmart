import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const AIChatPage = () => {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setError(null);
    setReply(null);

    try {
      const res = await fetch("http://localhost:8000/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      if (res.ok) {
        setReply(data.reply);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-grotesk relative min-h-screen flex flex-col overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-green-100 z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-green-200/40 via-white/0 to-green-300/10 z-0" />
      <div className="absolute top-0 left-0 w-full h-full bg-noise-pattern opacity-5 z-0 pointer-events-none" />

      <header className="relative bg-green-700 py-6 px-4 sm:px-8 rounded-b-3xl shadow-lg z-10 flex justify-center w-full animate-fade-in">
        <a
          href="/home"
          className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:text-green-200 transition"
          title="Go Back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-7 md:w-8 md:h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </a>
        <h1 className="text-white text-3xl md:text-5xl font-bold text-center">
          Disease Detection AI
        </h1>
      </header>

      <main className="relative flex-grow px-6 py-12 flex flex-col items-center justify-center z-10">
        <div className="w-full max-w-3xl bg-white/70 backdrop-blur-md border border-green-300 shadow-2xl rounded-3xl p-8 space-y-8">
          <h2 className="text-3xl font-bold text-center text-green-900">
            🧠 Ask SowSmart AI
          </h2>

          <textarea
            className="w-full p-4 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none min-h-[120px] bg-white/60 placeholder:text-gray-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask something like 'How do I treat Fusarium wilt?'"
          />

          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Thinking..." : "Ask AI"}
            </button>
          </div>

          {error && (
            <p className="text-red-600 font-medium text-center">{error}</p>
          )}

          {reply && (
            <div className="prose prose-green max-w-none border-t pt-6 border-green-200">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{reply}</ReactMarkdown>
            </div>
          )}
        </div>
      </main>

      <footer className="relative bg-gray-900 py-4 text-center text-white text-sm z-10 rounded-t-3xl">
        <p>&copy; {new Date().getFullYear()} SowSmart. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AIChatPage;
