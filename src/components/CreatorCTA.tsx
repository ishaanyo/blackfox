import { ArrowRight, CheckIcon, PlayIcon } from "./Icons";

export default function CreatorCTA() {
  return (
    <section className="py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto green-card rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full" />
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-green-200 mb-2 block">
              Create & Earn
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
              Become a BlackfoxAI Creator and earn $600 – $4000+ per month.
            </h2>
            <ul className="space-y-2 mb-6 text-green-50 text-sm">
              <li className="flex items-start gap-2">
                <CheckIcon /> Get paid for every video you post — even if you
                have not posted a video before.
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon /> Earn bonuses for every view your video gets up to
                $200+ per viral video.
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon /> Step-by-step instructions from us — we&apos;ve
                made 50,000+ videos with 1B+ views.
              </li>
            </ul>
            <a
              href="#creator"
              className="inline-flex items-center gap-2 bg-white text-green-800 font-semibold px-6 py-3 rounded-full text-sm hover:bg-green-50 transition"
            >
              Learn More
              <ArrowRight />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-video bg-white/10 rounded-xl border border-white/10 flex items-center justify-center"
              >
                <PlayIcon />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
