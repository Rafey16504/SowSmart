import { useEffect, useState } from "react";
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
      const res = await fetch("https://sowsmart.onrender.com/ask-ai", {
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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="font-grotesk relative min-h-screen flex flex-col overflow-hidden bg-[#FFE0CC]">
      <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-white to-green-200 z-0" />
      <div className="absolute inset-0 from-green-400/40 via-white/0 to-green-600/10 z-0" />
      <div className="absolute top-0 left-0 w-full h-full bg-noise-pattern opacity-5 z-0 pointer-events-none" />

      <header className="relative px-4 sm:px-8 flex justify-center w-full animate-fade-in">
        <a
          href="/home"
          className="absolute left-2 top-1/2 -translate-y-1/2 text-black bg-green-300/80 rounded-full p-1  hover:text-green-200 transition"
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
        <img
          src="/SowSmart-logo-notext.png"
          alt="SowSmart Logo"
          className="w-40 h-40 object-cover "
        />
      </header>

      <main className="relative flex-grow px-6 flex flex-col items-center z-10 space-y-8 -mt-8">
        <h1 className="text-black text-5xl md:text-5xl font-bold text-center underline animate-slide-up">
          CropMind
        </h1>
        <div className="bg-white border-l-8 border-green-600 shadow-xl rounded-3xl p-8 max-w-3xl text-center animate-fade-in">
          <h2 className="text-3xl font-bold text-green-800 mb-4">
            Your Crop Assistant
          </h2>
          <p className="text-gray-700 text-lg">
            CropMind is your intelligent crop chatbot designed to help farmers
            and enthusiasts. Ask about crop diseases, pest control, soil health,
            and more.
          </p>
        </div>
        <div className="w-full max-w-3xl p-8 space-y-8">
          <h2 className="text-3xl font-bold text-center text-green-900">
            🧠 Ask SowSmart AI
          </h2>

          <textarea
            className="w-full p-4 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none min-h-[120px] bg-white/60 placeholder:text-gray-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something like 'How do I prevent crop diseases?'"
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
        <p className="text-gray-700 text-lg opacity-60">
          Note: AI responses are subject to change, and may not always be
          accurate or reliable. Always seek professional advice before making
          decisions based on AI-generated information.{" "}
        </p>
      </main>

      <footer className="relative py-4 text-center text-black z-10">
        <p>&copy; {new Date().getFullYear()} SowSmart. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AIChatPage;
