import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PlaceholderTag } from "@/components/PlaceholderTag";
import { COMPANY } from "@/lib/site";

const SECTIONS = [
  {
    title: "What we collect",
    body: "When you submit the project inquiry form we collect the contact name, company name, business email, optional phone number, the service you selected, your project description, optional quantity and timeline, and any files you attach.",
  },
  {
    title: "Why we collect it",
    body: "The information is used solely to review your inquiry, prepare a response and contact you about your project.",
  },
  {
    title: "How it is stored",
    body: "Inquiries are stored in our database and attachments are stored in secured object storage. A notification is sent to the company inbox and an acknowledgement is sent to the email address you supplied.",
  },
  {
    title: "Retention and your rights",
    body: "Retention periods, data transfers, the identity of the data controller and the process for requesting access, correction or deletion are to be confirmed by the company and published here.",
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background" data-testid="privacy-page">
      <div className="mx-auto max-w-[760px] px-5 py-20 sm:px-8 md:py-28">
        <Link
          to="/"
          data-testid="privacy-back-link"
          className="flex items-center gap-2 font-tech text-[10px] uppercase tracking-[0.18em] text-[color:var(--slate)] transition-colors hover:text-[color:var(--gold-deep)]"
        >
          <ArrowLeft size={12} /> Back to website
        </Link>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <h1 className="font-display text-3xl font-light tracking-tight text-[color:var(--graphite)] md:text-4xl">
            Privacy Policy
          </h1>
          <PlaceholderTag absolute={false} label="Draft — for owner review" />
        </div>

        <p className="mt-6 text-sm leading-relaxed text-[color:var(--slate)]">
          This is a working draft prepared so the inquiry form can reference a policy. It has not been
          reviewed by {COMPANY.name} or by a legal adviser and must be replaced with the company&apos;s
          approved wording before launch.
        </p>

        <div className="mt-12 space-y-10">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="font-display text-xl font-normal tracking-tight text-[color:var(--graphite)]">
                {s.title}
              </h2>
              <span className="mt-4 block h-px w-10 rule-gold" aria-hidden="true" />
              <p className="mt-5 text-sm leading-relaxed text-[color:var(--slate)]">{s.body}</p>
            </section>
          ))}
        </div>

        <p className="mt-14 border-t border-[color:var(--hairline)] pt-7 font-tech text-[10px] uppercase tracking-[0.16em] text-[color:var(--slate)]">
          {COMPANY.name} · {COMPANY.address.join(", ")}
        </p>
      </div>
    </div>
  );
}
