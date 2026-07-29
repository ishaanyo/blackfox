const items = [
  {
    title: "Upload your Resume",
    desc: "Upload once and get instant interview answers perfectly matched to your experience and background.",
    tag: "Resume",
  },
  {
    title: "Auto Answer",
    desc: "Our platform integrates with major cloud providers. Do you have a preferred cloud environment?",
    tag: "Instant Answers",
  },
  {
    title: "Knowledge Base Documents",
    desc: "You can upload supporting documents that can be referenced by BlackfoxAI.",
    tag: "Documents",
  },
  {
    title: "Auto-detect meetings",
    desc: "For subscriptions the user can have Blackfox run in the background and enable a setting that will auto-detect meetings.",
    tag: "Auto-detect",
  },
  {
    title: "AI notes",
    desc: "After each call, Blackfox will automatically take notes. Key points, action items, and decisions are clearly summarized.",
    tag: "Notes",
  },
];

export default function ExtraFeatures() {
  return (
    <section className="py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl border border-border p-5 hover:shadow-md hover:border-green-200 transition"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-green-50 px-2 py-0.5 rounded mb-3 inline-block">
                {item.tag}
              </span>
              <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
