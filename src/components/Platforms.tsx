import { PlayIcon } from "./Icons";

const platforms = [
  { name: "Zoom", color: "bg-blue-500" },
  { name: "Google Meet", color: "bg-green-500" },
  { name: "Microsoft Teams", color: "bg-indigo-500" },
  { name: "LeetCode", color: "bg-orange-500" },
  { name: "HackerRank", color: "bg-emerald-600" },
  { name: "CoderPad", color: "bg-purple-500" },
];

export default function Platforms() {
  return (
    <section id="features" className="py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="green-card rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
                Works with any interview platform
              </h2>
              <p className="text-green-100 text-lg mb-6 leading-relaxed">
                You can use Blackfox with any video or coding platform including
                Zoom, Google Meet, Microsoft Teams, HackerRank, and LeetCode.
              </p>
              <a
                href="#tutorial"
                className="inline-flex items-center gap-2 bg-white text-green-800 font-semibold px-5 py-2.5 rounded-full text-sm hover:bg-green-50 transition"
              >
                <PlayIcon />
                Video tutorial · How to connect
              </a>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {platforms.map((p) => (
                <div
                  key={p.name}
                  className="bg-white/10 backdrop-blur rounded-xl p-4 text-center border border-white/10 hover:bg-white/20 transition"
                >
                  <div
                    className={`w-10 h-10 ${p.color} rounded-lg mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm`}
                  >
                    {p.name[0]}
                  </div>
                  <span className="text-xs font-medium text-white/90">
                    {p.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
