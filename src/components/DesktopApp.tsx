export default function DesktopApp() {
  return (
    <section id="desktop" className="py-16 px-4 sm:px-6 bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-green-400 mb-2 block">
            Desktop App
          </span>
          <h2 className="text-3xl font-bold mb-4">
            Make sure you&apos;re getting the most from BlackfoxAI.
          </h2>
          <p className="text-slate-300 leading-relaxed mb-6">
            The desktop app runs quietly in the background, listening to your
            conversation. It can answer questions and auto-detect meetings so
            you never miss a beat — even when switching windows.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#download"
              className="inline-flex items-center gap-2 bg-white text-slate-900 font-semibold px-5 py-2.5 rounded-full text-sm hover:bg-slate-100 transition"
            >
              Download for Mac
            </a>
            <a
              href="#download"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-5 py-2.5 rounded-full text-sm hover:bg-white/10 transition"
            >
              Download for Windows
            </a>
          </div>
        </div>
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4 shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs text-slate-400 ml-2">
              BlackfoxAI · Desktop
            </span>
          </div>
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Listening…
            </div>
            <div className="bg-slate-900 rounded-lg p-3 text-slate-300">
              Q: Explain the difference between TCP and UDP.
            </div>
            <div className="bg-green-950/50 border border-green-800/50 rounded-lg p-3 text-green-300">
              A: TCP is connection-oriented and guarantees delivery; UDP is
              connectionless and faster but unreliable…
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
