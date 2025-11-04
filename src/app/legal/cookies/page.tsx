'use client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AthliticsLogo from '../../../../public/images/athliticsLogo.svg';
import Link from 'next/link';

export default function CookiePolicyPage() {
  const router = useRouter();
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-white">
      <div className="flex flex-col items-center mb-4">
        <Image src={AthliticsLogo} alt="Athlitics Logo" width={80} height={80} />
      </div>
      <h1 className="text-3xl font-bold mb-8 text-center">Cookie Policy</h1>
      <p className="mb-2">Effective Date: [Insert Date]</p>
      <p className="mb-6">
        Athlitics uses cookies and similar technologies to give you a smoother, safer, and more
        personalized experience on our platform.
      </p>
      <h2 className="text-xl font-semibold mb-2">🔍 What are cookies?</h2>
      <p className="mb-6">
        Cookies are small text files placed on your device when you visit our site. They help us
        remember you, so you don’t have to log in again and again, and they also help us understand
        how you use our platform.
      </p>
      <h2 className="text-xl font-semibold mb-2">🛠️ Types of Cookies We Use</h2>
      <ol className="list-decimal pl-6 space-y-4 mb-6">
        <li>
          <strong>Essential Cookies</strong>
          <ul className="list-disc pl-6">
            <li>Required for login, security, and basic site features.</li>
            <li>Without these, the platform won’t work properly.</li>
          </ul>
        </li>
        <li>
          <strong>Performance &amp; Analytics Cookies</strong>
          <ul className="list-disc pl-6">
            <li>Help us understand how tournaments are discovered and used.</li>
            <li>Example: tracking which pages are popular, or where players drop off.</li>
          </ul>
        </li>
        <li>
          <strong>Functionality Cookies</strong>
          <ul className="list-disc pl-6">
            <li>Remember your preferences (e.g., language, saved tournaments).</li>
          </ul>
        </li>
        <li>
          <strong>Advertising Cookies (Optional / Limited)</strong>
          <ul className="list-disc pl-6">
            <li>Used only if we run promotions or sponsorships.</li>
            <li>Never used to target children under 18.</li>
          </ul>
        </li>
      </ol>
      <h2 className="text-xl font-semibold mb-2">👨‍👩‍👧 Children’s Data &amp; Cookies</h2>
      <ul className="list-disc pl-6 mb-6">
        <li>If a parent manages a child account, only essential cookies are used.</li>
        <li>We do not use tracking or advertising cookies for child accounts.</li>
      </ul>
      <h2 className="text-xl font-semibold mb-2">⚙️ Managing Your Cookie Choices</h2>
      <ul className="list-disc pl-6 mb-6">
        <li>You can manage or disable cookies through your browser settings.</li>
        <li>
          If you disable essential cookies, some parts of the platform may not function correctly.
        </li>
      </ul>
      <h2 className="text-xl font-semibold mb-2">📞 Contact Us</h2>
      <p className="mb-6">
        For any questions about cookies, write to us at{' '}
        <Link href="mailto:support@athlitics.com" className="underline text-[#4EF162]">
          support@athlitics.com
        </Link>
        .
      </p>
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
