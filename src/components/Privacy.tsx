import { PlayIcon } from "./Icons";

const features = [
  "Invisible on Screen Share",
  "Invisible in Dock",
  "Invisible in Task Switching",
  "Cursor Undetectability",
];

const demos = [
  { name: "Zoom", status: "Undetectable" },
  { name: "Microsoft Teams", status: "Undetectable" },
  { name: "Google Meet", status: "Undetectable" },
  { name: "Webex", status: "Undetectable" },
  { name: "Amazon Chime", status: "Undetectable" },
  { name: "CoderPad", status: "Undetectable" },
  { name: "HackerRank", status: "Undetectable" },
];

export default function Privacy() {
  return (
    <section id="privacy" className="py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="green-card rounded-3xl p-8 sm:p-10 text-white mb-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-3">
                100% Private and Undetectable
              </h2>
              <p className="text-green-100 mb-6 leading-relaxed">
                A short video explaining the privacy features of BlackfoxAI and
                what to do if the caller asks you to share your screen.
              </p>
              <a
                href="#privacy-video"
                className="inline-flex items-center gap-2 bg-white text-green-800 font-semibold px-5 py-2.5 rounded-full text-sm"
              >
                <PlayIcon /> Video tutorial · Privacy
              </a>
            </div>
            <div className="space-y-2">
              {features.map((f) => (
                <div
                  key={f}
                  className="flex items-center justify-between bg-white/10 backdrop-blur rounded-xl px-4 py-3 border border-white/10"
                >
                  <span className="text-sm font-medium">{f}</span>
                  <span className="text-xs bg-green-400/20 text-green-200 px-2 py-0.5 rounded-full">
                    ✓ On
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h3 className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">
          Privacy Demo Videos
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {demos.map((d) => (
            <div
              key={d.name}
              className="bg-white border border-border rounded-xl p-4 text-center hover:border-green-300 hover:shadow-sm transition cursor-pointer"
            >
              <p className="font-medium text-sm text-slate-800">{d.name}</p>
              <p className="text-xs text-green-600 mt-1 flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                {d.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
