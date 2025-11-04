'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Facebook from '../../public/images/facebook.svg';
import Instagram from '../../public/images/instagram.svg';
import Linkedin from '../../public/images/linkedin.svg';
import HeaderLogo from '../../public/images/logo.svg';
import Twitter from '../../public/images/twitter.svg';

const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61579430248037';
const TWITTER_URL = 'https://x.com/athlitics25';
const INSTAGRAM_URL = 'https://www.instagram.com/?hl=en';
const LINKEDIN_URL = ' https://www.linkedin.com/company/108624726/admin/dashboard/';

interface FooterProps {
  bg?: string;
  height?: string;
}

export default function Footer({
  bg = 'bg-[#16171B]',
  height = 'h-[100px] sm:h-[115px] lg:h-[130px]',
}: FooterProps) {
  const route = useRouter();
  return (
    <div
      className={`w-full ${bg} ${height} flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 md:px-8 lg:px-[5vw] py-2 sm:py-0 gap-0 sm:gap-0`}
    >
      <div className="flex flex-col items-center order-1 sm:order-none w-full sm:w-auto">
        <Link className="cursor-pointer" href="/">
          <Image
            src={HeaderLogo}
            height={40}
            className="sm:h-[45px] lg:h-[53px] w-auto"
            alt="logo"
          />
        </Link>
        <div className="flex flex-wrap gap-1 sm:gap-2 items-center justify-center sm:mt-1 text-center">
          <Link href="/legal/terms">
            <span className="text-white text-[10px] sm:text-[11px] lg:text-xs cursor-pointer underline whitespace-nowrap">
              Terms and Conditions
            </span>
          </Link>
          <span className="w-px h-3 sm:h-4 bg-white"></span>
          <Link href="/legal/privacy">
            <span className="text-white text-[10px] sm:text-[11px] lg:text-xs cursor-pointer underline whitespace-nowrap">
              Privacy Policy
            </span>
          </Link>
          <span className="w-px h-3 sm:h-4 bg-white"></span>
          <Link href="/legal/cookies">
            <span className="text-white text-[10px] sm:text-[11px] lg:text-xs cursor-pointer underline whitespace-nowrap">
              Cookie Policy
            </span>
          </Link>
          <span className="w-px h-3 sm:h-4 bg-white"></span>
          <Link href="/legal/support">
            <span className="text-white text-[10px] sm:text-[11px] lg:text-xs cursor-pointer underline whitespace-nowrap">
              Support
            </span>
          </Link>
          <span className="w-px h-3 sm:h-4 bg-white"></span>
          <Link href="/legal/data-deletion-request">
            <span className="text-white text-[10px] sm:text-[11px] lg:text-xs cursor-pointer underline whitespace-nowrap">
              Delete My Data
            </span>
          </Link>
        </div>
        <div className="flex w-full justify-between items-center  sm:hidden">
          <span className="text-[14px] text-white">Follow us</span>
          <div className="flex items-center gap-2">
            <a
              href={FACEBOOK_URL}
              className="cursor-pointer"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Facebook"
            >
              <Image src={Facebook} alt="Facebook logo" className="w-5 h-5" />
            </a>
            <a
              href={TWITTER_URL}
              className="cursor-pointer"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Twitter"
            >
              <Image src={Twitter} alt="Twitter logo" className="w-5 h-5" />
            </a>
            <a
              href={INSTAGRAM_URL}
              className="cursor-pointer"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
            >
              <Image src={Instagram} alt="Instagram logo" className="w-5 h-5" />
            </a>
            <a
              href={LINKEDIN_URL}
              className="cursor-pointer"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on LinkedIn"
            >
              <Image src={Linkedin} alt="LinkedIn logo" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
      {/* Tablet/Desktop: Follow us and icons as before */}
      <div className="order-2 sm:order-none hidden sm:block">
        <div className="text-[16px] lg:text-[18px] text-white mb-2 text-left">Follow us</div>
        <div className="flex items-center gap-0">
          <a
            href={FACEBOOK_URL}
            className="cursor-pointer sm:mr-3 lg:mr-4"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow us on Facebook"
          >
            <Image src={Facebook} alt="Facebook logo" className="w-6 h-6" />
          </a>
          <a
            href={TWITTER_URL}
            className="cursor-pointer sm:mr-3 lg:mr-4"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow us on Twitter"
          >
            <Image src={Twitter} alt="Twitter logo" className="w-6 h-6" />
          </a>
          <a
            href={INSTAGRAM_URL}
            className="cursor-pointer sm:mr-3 lg:mr-4"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow us on Instagram"
          >
            <Image src={Instagram} alt="Instagram logo" className="w-6 h-6" />
          </a>
          <a
            href={LINKEDIN_URL}
            className="cursor-pointer sm:mr-3 lg:mr-4"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow us on LinkedIn"
          >
            <Image src={Linkedin} alt="LinkedIn logo" className="w-6 h-6" />
          </a>
        </div>
      </div>
    </div>
  );
}
