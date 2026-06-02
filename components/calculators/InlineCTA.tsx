import Link from "next/link";

interface InlineCTAProps {
  heading?: string;
  body?: string;
  cta?: string;
}

export default function InlineCTA({
  heading = "Want to see how this was built?",
  body = "This entire calculator suite is open source — 16 tools built with Next.js 14, Recharts, and Tailwind CSS.",
  cta = "View Source on GitHub →",
}: InlineCTAProps) {
  return (
    <div className="my-8 rounded-xl bg-blue-600 px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex-1">
        <p className="text-white font-semibold text-base mb-1">{heading}</p>
        <p className="text-blue-100 text-sm">{body}</p>
      </div>
      <a
        href="https://github.com/jakejoseph"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 bg-white text-blue-700 font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
      >
        {cta}
      </a>
    </div>
  );
}
