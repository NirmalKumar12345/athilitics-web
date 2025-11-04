'use client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AthliticsLogo from '../../../../public/images/athliticsLogo.svg';

export default function TermsPage() {
  const router = useRouter();
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-white">
      <div className="flex flex-col items-center mb-4">
        <Image src={AthliticsLogo} alt="Athlitics Logo" width={80} height={80} />
      </div>
      <h1 className="text-3xl font-bold mb-8 text-center">Terms &amp; Conditions</h1>
      <p className="mb-2">Effective Date: [Insert Launch Date]</p>
      <p className="mb-2">Last Updated: [Insert Date]</p>
      <p className="mb-6">
        Welcome to Athlitics.com (“we”, “our”, “us”). By creating an account, registering for an
        event, or organizing a tournament on our platform, you (“you”, “user”, “player”, or
        “organizer”) agree to the following Terms &amp; Conditions.
      </p>
      <ol className="list-decimal pl-6 space-y-4">
        <li>
          <strong>Acceptance of Terms</strong>
          <p>
            By using Athlitics.com, you agree to abide by these Terms &amp; Conditions, our Refund
            Policy, and other applicable policies. If you do not agree, you must stop using the
            platform.
          </p>
        </li>
        <li>
          <strong>Eligibility</strong>
          <ul className="list-disc pl-6">
            <li>
              Players must meet the age, gender, and category requirements set for each tournament.
            </li>
            <li>Organizers must be legally capable of hosting events in India.</li>
            <li>
              By registering, you confirm the information you provide is accurate and truthful.
            </li>
          </ul>
        </li>
        <li>
          <strong>Accounts &amp; Responsibilities</strong>
          <ul className="list-disc pl-6">
            <li>
              You are responsible for maintaining the confidentiality of your login credentials.
            </li>
            <li>You agree not to impersonate, misrepresent, or create fraudulent accounts.</li>
            <li>
              Organizers must provide accurate event details, schedules, categories, and prize
              information.
            </li>
          </ul>
        </li>
        <li>
          <strong>Tournament Creation (Organizers)</strong>
          <ul className="list-disc pl-6">
            <li>Organizers may create tournaments subject to our approval process.</li>
            <li>
              Organizers must comply with all local laws, venue requirements, and sports
              regulations.
            </li>
            <li>
              Logos, banners, and descriptions uploaded by organizers remain their property, but
              Athlitics.com reserves the right to display and promote tournaments on our platform
              and marketing materials.
            </li>
          </ul>
        </li>
        <li>
          <strong>Player Participation</strong>
          <ul className="list-disc pl-6">
            <li>Players must ensure they are medically fit and eligible for participation.</li>
            <li>
              By registering, you agree to participate fairly and in accordance with tournament
              rules.
            </li>
            <li>
              Misrepresentation of age, gender, or skill category may result in disqualification.
            </li>
          </ul>
        </li>
        <li>
          <strong>Payments &amp; Refunds</strong>
          <ul className="list-disc pl-6">
            <li>
              All payments for registrations and tournament fees are processed securely through our
              platform.
            </li>
            <li>
              Our Refund Policy applies to both players and organizers. Refunds are provided in case
              of cancellations, postponements, or other eligible reasons as outlined in the Refund
              Policy.
            </li>
            <li>Refunds, if approved, will be processed within a reasonable timeframe.</li>
          </ul>
        </li>
        <li>
          <strong>Fair Play &amp; Code of Conduct</strong>
          <ul className="list-disc pl-6">
            <li>Any form of cheating, abuse, or misconduct will not be tolerated.</li>
            <li>Players and organizers must maintain sportsmanship and respect towards others.</li>
            <li>
              Athlitics.com reserves the right to suspend or terminate accounts for violations.
            </li>
          </ul>
        </li>
        <li>
          <strong>Liability &amp; Safety</strong>
          <ul className="list-disc pl-6">
            <li>
              Athlitics.com is an online platform and does not physically organize or supervise
              events.
            </li>
            <li>
              We are not responsible for injuries, accidents, or disputes that occur at tournaments.
            </li>
            <li>
              Players participate at their own risk, and organizers are solely responsible for
              providing safe and compliant facilities.
            </li>
          </ul>
        </li>
        <li>
          <strong>Content &amp; Intellectual Property</strong>
          <ul className="list-disc pl-6">
            <li>
              Organizers retain ownership of their content (logos, banners, text), but grant
              Athlitics.com a non-exclusive license to use such content for promotion.
            </li>
            <li>
              Athlitics.com retains ownership of its platform, technology, branding, and content.
            </li>
          </ul>
        </li>
        <li>
          <strong>Termination &amp; Suspension</strong>
          <ul className="list-disc pl-6">
            <li>
              Athlitics.com reserves the right to suspend or terminate accounts or tournaments that
              violate these Terms.
            </li>
            <li>We may also remove events that are fraudulent, unsafe, or misleading.</li>
          </ul>
        </li>
        <li>
          <strong>Governing Law &amp; Disputes</strong>
          <ul className="list-disc pl-6">
            <li>These Terms are governed by the laws of India.</li>
            <li>
              In case of disputes, the courts of [Insert City, e.g., Bengaluru / Delhi] shall have
              exclusive jurisdiction.
            </li>
            <li>We encourage amicable resolution before legal escalation.</li>
          </ul>
        </li>
        <li>
          <strong>Updates to Terms</strong>
          <p>
            We may update these Terms &amp; Conditions periodically. Continued use of the platform
            after updates constitutes acceptance of the revised Terms.
          </p>
        </li>
      </ol>
      <div className="flex justify-center mt-8">
        <Button
          className="bg-[#4EF162] text-black font-semibold px-6 py-2 rounded shadow hover:bg-[#3ec14e] transition-colors cursor-pointer"
          onClick={() => router.back()}
        >
          I Agree
        </Button>
      </div>
    </div>
  );
}
