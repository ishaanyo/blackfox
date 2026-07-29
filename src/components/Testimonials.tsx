const reviews = [
  {
    name: "Avi W",
    handle: "@aviwacks",
    text: "BlackfoxAI is legitimately in its golden age of entrepreneurship.",
    time: "2 months ago",
  },
  {
    name: "Jane D.",
    handle: "jane_digital",
    text: "If I'm honest, there were absolutely zero faults. It is really a game changer. I've already recommended it to all my friends and family. Thank you for creating such an amazing app!",
    time: "Jan 17, 2025",
  },
  {
    name: "Jure S",
    handle: "jure_s",
    text: "BlackfoxAI gives you super fast transcriptions and spot on AI answers! Plus, it's not a subscription just pay as you go. Love it!",
    time: "Feb 14, 2025",
  },
];

export default function Testimonials() {
  return (
    <section id="reviews" className="py-16 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-10">
          People love BlackfoxAI 💚
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="bg-slate-50 rounded-2xl border border-border p-5 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center text-white font-bold text-sm">
                  {r.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-900">
                    {r.name}
                  </p>
                  <p className="text-xs text-slate-400">{r.handle}</p>
                </div>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed mb-3">
                {r.text}
              </p>
              <p className="text-xs text-slate-400">{r.time}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
