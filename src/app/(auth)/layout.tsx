'use client';
import Footer from '@/components/footer';
import Link from 'next/link';
import { ReactNode } from 'react';

const TitleContent = () => (
  <div className="text-center lg:text-left">
    <span className="text-white text-[28px] sm:text-[36px] md:text-[48px] lg:text-[78px] leading-[100%] font-sansation-bold">
      Register your
    </span>
    <br />
    <span className="text-white text-[28px] sm:text-[36px] md:text-[48px] lg:text-[78px] leading-[100%] font-sansation-bold">
      Club with
    </span>
    <div className="flex items-center justify-center lg:justify-start mt-2 sm:mt-3 lg:mt-4 space-x-1 sm:space-x-2">
      <div className="rounded-[12px] sm:rounded-[14px] lg:rounded-[16px] bg-[#4EF162] px-2 sm:px-3 md:px-4 lg:px-6 flex items-center">
        <span className="font-sansation-italic-bold text-black text-[28px] sm:text-[36px] md:text-[48px] lg:text-[78px]">
          A
        </span>
        <span className="font-sansation-bold text-black text-[28px] sm:text-[36px] md:text-[48px] lg:text-[78px]">
          thlitics
        </span>
      </div>
      <span className="text-white text-[28px] sm:text-[36px] md:text-[48px] lg:text-[78px] font-sansation-bold leading-[100%]">
        now
      </span>
    </div>
  </div>
);

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-black relative">
      {/* Background image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/images/home-bg-gradient.svg"
          alt="Background Gradient"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Header */}
      <header className="relative top-0 left-0 w-full z-5 p-4 sm:p-6 md:p-8 lg:p-[40px_100px_40px_100px]">
        <Link href="/">
          <img
            src="/images/logo.svg"
            alt="Logo"
            className="w-[80px] sm:w-[90px] md:w-[100px] lg:w-[118.82px] h-[24px] sm:h-[28px] md:h-[32px] lg:h-[37px]"
          />
        </Link>
      </header>

      {/* Main Content - with bottom padding to account for footer */}
      <main className="flex flex-1 z-10 justify-center items-start md:items-center px-4 sm:px-6 md:px-8 lg:px-10 pb-4 sm:pb-4 md:pb-4 lg:pb-12 pt-2 sm:pt-4 lg:pt-0">
        <div className="w-full max-w-7xl flex flex-col lg:flex-row justify-center items-center gap-3 sm:gap-4 lg:gap-0">
          {/* Left Title Section (Show on mobile/tablet but with different styling) */}
          <div className="flex lg:hidden w-full justify-center items-center mb-3 sm:mb-4">
            <TitleContent />
          </div>

          {/* Left Title Section (Hidden on small screens, shown on desktop) */}
          <div className="hidden lg:flex lg:w-1/2 justify-center items-center">
            <TitleContent />
          </div>

          {/* Right Form Section */}
          <div className="w-full lg:w-1/2 flex justify-center items-start lg:items-center">
            <div className="w-full max-w-[350px] sm:max-w-[400px] lg:max-w-[480px]">{children}</div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
