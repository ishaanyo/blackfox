import { ArrowRight, PlayIcon, StarIcon } from "./Icons";

export default function Hero() {
  return (
    <section className="hero-gradient pt-12 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Mode tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white rounded-full p-1 shadow-sm border border-border">
            <button className="px-5 py-1.5 rounded-full text-sm font-semibold bg-primary text-white shadow">
              Non-Coding
            </button>
            <button className="px-5 py-1.5 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900">
              Coding
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left copy */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-green-100">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              FULL CODING INTERVIEW SUPPORT
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-4">
              Your Real-Time{" "}
              <span className="text-primary">AI Interview Assistant</span>
            </h1>

            <p className="text-slate-600 text-lg max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
              Automatically get an answer to every interview question with
              ChatGPT AI software. An AI interview copilot. Real-time and
              private.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start mb-6">
              <a
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-full shadow-lg shadow-green-200/60 transition"
              >
                Dashboard
                <ArrowRight />
              </a>
              <span className="text-sm text-slate-500">
                Or subscription/lifetime
              </span>
            </div>

            <div className="flex items-center gap-3 justify-center lg:justify-start text-sm text-slate-500">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-green-300 to-green-600 border-2 border-white"
                  />
                ))}
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <span>
                Used by <strong className="text-slate-800">1,534,135+</strong>{" "}
                people
              </span>
            </div>
          </div>

          {/* Right — demo mockup */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl shadow-green-100/50 border border-border overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-border">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="text-xs text-slate-400 ml-2">
                  BlackfoxAI demo
                </span>
              </div>

              <div className="grid sm:grid-cols-2">
                {/* Video side */}
                <div className="relative bg-slate-900 aspect-video sm:aspect-auto min-h-[200px] flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3 backdrop-blur text-white">
                      <PlayIcon />
                    </div>
                    <p className="text-white/80 text-sm font-medium">
                      Demo video
                    </p>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                    <span className="text-[10px] bg-black/50 text-white px-2 py-0.5 rounded">
                      Live
                    </span>
                  </div>
                </div>

                {/* Chat side */}
                <div className="p-4 space-y-3 bg-slate-50/80">
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-border text-xs">
                    <p className="text-slate-500 mb-1 font-medium">
                      Interviewer
                    </p>
                    <p className="text-slate-800">
                      What are the three highest mountains in Africa?
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-100 text-xs">
                    <p className="text-green-700 mb-1 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      BlackfoxAI
                    </p>
                    <p className="text-slate-800 leading-relaxed">
                      1. Mount Kilimanjaro in Tanzania (5,895 m)
                      <br />
                      2. Mount Kenya in Kenya (5,199 m)
                      <br />
                      3. Mount Stanley in Uganda (5,109 m)
                    </p>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button className="flex-1 text-[10px] font-medium bg-primary text-white py-1.5 rounded-md">
                      Generate Response
                    </button>
                    <button className="text-[10px] font-medium border border-border px-2 py-1.5 rounded-md text-slate-600">
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white border border-border shadow-lg rounded-full px-4 py-1.5 text-xs font-medium text-slate-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              View video for mobile
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
