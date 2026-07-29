import { PlayIcon } from "./Icons";

export default function FeatureCards() {
  return (
    <section className="py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Coding support */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6 sm:p-8 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary bg-green-50 px-2.5 py-1 rounded-md mb-3">
              Programming
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Full Coding Interview Support
            </h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              You can use BlackfoxAI for coding interviews. It can both listen
              for coding questions and capture the screen if a LeetCode-style
              question is being shared with you.
            </p>
            <a
              href="#tutorial"
              className="inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:underline"
            >
              <PlayIcon /> Video Tutorial · Programming
            </a>
          </div>
          <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto shadow-inner">
            <pre className="whitespace-pre-wrap">{`function generatePrimeNumbers(n) {
  const primes = [];
  for (let i = 2; primes.length < n; i++) {
    if (isPrime(i)) primes.push(i);
  }
  return primes;
}

function isPrime(num) {
  for (let i = 2; i * i <= num; i++) {
    if (num % i === 0) return false;
  }
  return num > 1;
}`}</pre>
          </div>
        </div>

        {/* Two smaller cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md mb-3">
              Speech Recognition
            </span>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Blazing Fast Transcription
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              We use a state-of-the-art transcription model that provides a
              highly accurate transcription in record-breaking speed.
            </p>
            <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-3 border border-border">
              <div className="flex gap-0.5 items-end h-8">
                {[3, 5, 8, 4, 7, 9, 5, 6, 8, 4, 3, 6].map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-primary rounded-full"
                    style={{ height: `${h * 3}px` }}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Live transcript…
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2.5 py-1 rounded-md mb-3">
              AI Answers
            </span>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              100% Accurate Responses
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              You choose between GPT-5, GPT-4o and Claude 4.0 Sonnet, the best
              LLMs available, to provide the most accurate answers.
            </p>
            <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-sm text-slate-700">
              <p className="font-medium text-green-800 mb-1">Sample answer</p>
              <p className="text-xs leading-relaxed">
                Kafka with idempotent producers and transactional consumers
                ensures exactly-once semantics across the pipeline…
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
