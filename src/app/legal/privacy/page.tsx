'use client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AthliticsLogo from '../../../../public/images/athliticsLogo.svg';
import Link from 'next/link';

export default function PrivacyPage() {
  const router = useRouter();
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-white">
      <div className="flex flex-col items-center mb-4">
        <Image src={AthliticsLogo} alt="Athlitics Logo" width={80} height={80} />
      </div>
      <h1 className="text-3xl font-bold mb-8 text-center">Privacy Policy</h1>
      <p className="mb-2">Effective Date: [Insert Launch Date]</p>
      <p className="mb-2">Last Updated: [Insert Date]</p>
      <p className="mb-6">
        Athlitics.com (“we”, “our”, “us”) values your privacy. This Privacy Policy explains how we
        collect, use, and protect your personal information when you use our platform, whether as a
        player, parent/guardian, or organizer.
      </p>
      <ol className="list-decimal pl-6 space-y-4">
        <li>
          <strong>Information We Collect</strong>
          <ul className="list-disc pl-6">
            <li>
              Account Information: Name, email, phone number, date of birth, gender, and profile
              picture.
            </li>
            <li>Player Information: Tournament participation, category, rankings, and results.</li>
            <li>
              Organizer Information: Organization details, uploaded logos, tournament data, and
              payment details.
            </li>
            <li>
              Payment Information: UPI, bank, or card details (handled via secure third-party
              payment providers).
            </li>
            <li>Technical Data: Device type, IP address, location, and app usage statistics.</li>
            <li>
              Child Accounts: Parents/guardians may create and manage accounts for children under
              18.
            </li>
          </ul>
        </li>
        <li>
          <strong>Use of Information</strong>
          <ul className="list-disc pl-6">
            <li>Provide and improve our services.</li>
            <li>Register players for tournaments and manage results.</li>
            <li>Enable organizers to create and manage tournaments.</li>
            <li>Process payments and refunds.</li>
            <li>Prevent fraud, cheating, and abuse.</li>
            <li>Communicate updates, schedules, and notifications.</li>
            <li>Comply with legal obligations.</li>
          </ul>
        </li>
        <li>
          <strong>Children’s Privacy</strong>
          <ul className="list-disc pl-6">
            <li>Children under 18 years of age cannot directly create accounts.</li>
            <li>A parent or legal guardian must register and manage their child’s account.</li>
            <li>We do not knowingly collect personal data directly from minors.</li>
            <li className="mt-2">
              Parents may at any time review, update, or request deletion of their child’s account
              by contacting us at{' '}
              <Link href="mailto:founder@athlitics.com" className="underline text-[#4EF162]">
                founder@athlitics.com
              </Link>
              .
            </li>
          </ul>
        </li>
        <li>
          <strong>Sharing of Information</strong>
          <p>We do not sell or rent your personal data. </p> 
          <p>We may share information only with:</p>
          <ul className="list-disc pl-6">
            <li>
              Tournament Organizers: Limited to registered player details needed for participation.
            </li>
            <li>Payment Providers: For secure transaction processing.</li>
            <li>Legal Authorities: If required by law.</li>
            <li>
              Service Providers: Trusted partners who assist in hosting, analytics, or customer
              support.
            </li>
          </ul>
        </li>
        <li>
          <strong>Data Security</strong>
          <ul className="list-disc pl-6">
            <li>We use encryption and secure servers to protect your data.</li>
            <li>Access to sensitive data is restricted to authorized personnel.</li>
            <li>While we take strong measures, no online system is 100% secure.</li>
          </ul>
        </li>
        <li>
          <strong>Data Retention</strong>
          <ul className="list-disc pl-6">
            <li>
              We retain personal data only as long as necessary for providing services or as
              required by law.
            </li>
            <li>Players and parents can request deletion of their data by contacting us.</li>
          </ul>
        </li>
        <li>
          <strong>Your Rights</strong>
          <ul className="list-disc pl-6">
            <li>Access and review your data.</li>
            <li>Correct or update inaccurate information.</li>
            <li>Request deletion of your account.</li>
            <li>Withdraw consent for processing (subject to legal and contractual obligations).</li>
          </ul>
        </li>
        <li>
          <strong>Communications</strong>
          <p>
            By registering, you consent to receive transactional notifications (e.g., match updates,
            results). You may opt out of marketing communications at any time.
          </p>
        </li>
        <li>
          <strong>Changes to this Policy</strong>
          <p>
            We may update this Privacy Policy from time to time. Continued use of our platform
            constitutes acceptance of the updated policy.
          </p>
        </li>
        <li>
          <strong>Contact Us</strong>
          <p>
            If you have any questions about privacy or wish to exercise your rights, please contact
            us at:{' '}
            <Link href="mailto:founder@athlitics.com" className="underline text-[#4EF162]">
              founder@athlitics.com
            </Link>
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
