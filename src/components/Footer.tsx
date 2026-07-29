import { Logo } from "./Icons";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-2">
            <Logo className="w-10 h-10" />
            <div>
              <p className="font-bold text-white text-lg">BlackfoxAI</p>
              <p className="text-xs text-slate-400">
                Have a question? Let&apos;s chat!
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <a href="#compare" className="hover:text-white transition">
              Compare
            </a>
            <a href="#feedback" className="hover:text-white transition">
              Feedback
            </a>
            <a href="#support" className="hover:text-white transition">
              Support
            </a>
            <a href="#terms" className="hover:text-white transition">
              Terms & Conditions
            </a>
            <a href="#privacy" className="hover:text-white transition">
              Privacy Policy
            </a>
            <a href="#refund" className="hover:text-white transition">
              Refund Policy
            </a>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© BlackfoxAI 2025. All Rights Reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">
              Blog
            </a>
            <a href="#" className="hover:text-white">
              YouTube
            </a>
            <a href="#" className="hover:text-white">
              LinkedIn
            </a>
            <a href="#" className="hover:text-white">
              Instagram
            </a>
            <a href="#" className="hover:text-white">
              Facebook
            </a>
            <a href="#" className="hover:text-white">
              TikTok
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
