'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';
import HeaderLogo from '../../public/images/logo.svg';

export default function Header({ className }: { className?: string }) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      className={`w-full h-auto flex flex-col items-center md:flex-row md:justify-between md:items-center relative z-[10000] ${className || ''}`}
      ref={menuRef}
    >
      <div className="w-full flex justify-center md:justify-start md:w-auto pt-2 md:pt-0">
        <Link href="/" className="cursor-pointer">
          <Image src={HeaderLogo} height={37} alt="logo" />
        </Link>
      </div>

      <div className="flex flex-row items-center relative z-[10000] mt-2 md:mt-0 pointer-events-auto">
        <Link
          href="/"
          className={`text-[16px] sm:text-[18px] font-[700] cursor-pointer hover:opacity-80 transition-opacity ${
            pathname === '/' ? 'text-white' : 'text-green'
          }`}
        >
          Home
        </Link>
        <Link
          href="/pricing"
          className={`text-[16px] sm:text-[18px] font-[700] cursor-pointer pl-[3vw] hover:opacity-80 transition-opacity ${
            pathname.includes('pricing') ? 'text-white' : 'text-green'
          }`}
        >
          Pricing Plan
        </Link>
        <div className="flex pl-[3vw]">
          <Link className="text-green font-satoshi-bold hover:underline hover:opacity-80 transition-opacity" href="/login">
            Login/
          </Link>
          <Link className="text-green font-satoshi-bold hover:underline hover:opacity-80 transition-opacity" href="/register">
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
}
