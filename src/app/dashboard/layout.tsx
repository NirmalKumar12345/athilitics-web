'use client';
import Avatar from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { InfoSubText } from '@/components/ui/infoSubText';
import LoadingOverlay from '@/components/ui/loadingOverlay';
import { useOrganizer } from '@/hooks/useOrganizer';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Routes } from '../constants/routes';
import { useRazorPay } from '@/hooks/useRazorPay';
import { RazorPayResponse } from '@/api/models/RazorPayDto';

function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const { getLinkedAccountDetails } = useRazorPay();
  const [bankAccount, setBankAccount] = useState<null | RazorPayResponse>(null);

  const { organizer, isLoading } = useOrganizer();

  const tabs = [
    { name: 'Tournaments', path: '/dashboard' },
    { name: 'Profile', path: '/dashboard/profile' },
  ];
  useEffect(() => {
    (async () => {
      const response = await getLinkedAccountDetails();
      if (response?.data) {
        setBankAccount(response);
      } else {
        setBankAccount(null);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getActiveTab = () => {
    if (pathname === '/dashboard') {
      return 'Tournaments';
    }
    if (pathname?.startsWith('/dashboard/profile')) {
      return 'Profile';
    }
    if (pathname?.startsWith('/dashboard/tournament')) {
      return 'Tournaments';
    }
    const currentTab = tabs.find((tab) => (pathname ?? '').startsWith(tab.path));
    return currentTab?.name || 'Tournaments';
  };

  const handleTabClick = (path: string) => {
    if (path === '/dashboard/profile') {
      setLoading(true);
      router.push(path);
      setTimeout(() => setLoading(false), 1000);
    } else if (path === '/dashboard') {
      router.push('/dashboard');
    } else {
      router.push(path);
    }
  };

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = Routes.LOGIN;
    }, 1500);
  };

  const organizerName = organizer?.organization_name || organizer?.organizer_name || '';
  const organizerLogo = organizer?.organization_profile;

  return (
    <>
      {(isLoading || loading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-50">
          <LoadingOverlay />
        </div>
      )}
      <nav className="w-full h-[48px] sm:h-[54px] fixed top-0 left-0 z-10 flex justify-between items-center px-4 sm:px-8 lg:px-[130px] py-[10px] sm:py-[12px] shadow-sm border-b border-b-[#444444] bg-[#16171B]">
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-8">
          <img
            src="/images/logo.svg"
            alt="Logo"
            className="w-[70px] h-[20px] sm:w-[80px] sm:h-[24px] lg:w-[96.34px] lg:h-[28px]"
          />
          <div className="flex h-full pl-2 sm:pl-4 lg:pl-8">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => handleTabClick(tab.path)}
                className={`pr-3 sm:pr-4 lg:pr-8 py-2 text-[12px] sm:text-[14px] lg:text-[16px] font-[700] relative h-full flex items-center transition-all duration-300 ease-in-out font-sansation-bold cursor-pointer hover:scale-105 hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.3)] ${getActiveTab() === tab.name
                  ? 'text-white'
                  : 'text-[#C5C3C3] font-sansation-regular hover:text-gray-300'
                  }`}
              >
                {tab.name}
                {getActiveTab() === tab.name && (
                  <div className="absolute bottom-[-8px] left-0 right-3 sm:right-4 lg:right-8 h-[3px] bg-[#D9D9D9] rounded-t-[2px] transition-all duration-500 ease-in-out animate-in slide-in-from-left-full" />
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
          <div
            className={`flex w-[45px] sm:w-[70px] lg:w-[87px] h-[18px] sm:h-[24px] lg:h-[30px] rounded-[6px] sm:rounded-[8px] text-[8px] sm:text-[12px] lg:text-[14px] items-center justify-center font-medium text-white
              ${organizer?.tier_status === 'Pro Tier' ? 'bg-[#F4C01E]' : organizer?.tier_status === 'Pro Plus Tier' ? 'bg-[#4EF162]' : 'bg-[#9E9E9E]'}
            `}
          >
            <span className="truncate px-0.5 sm:px-1">
              <span className="sm:hidden">
                {organizer?.tier_status === 'Pro Tier'
                  ? 'Pro'
                  : organizer?.tier_status === 'Pro Plus Tier'
                    ? 'Pro+'
                    : 'Free'}
              </span>
              <span className="hidden sm:inline">{organizer?.tier_status || 'Free Tier'}</span>
            </span>
          </div>
          {!bankAccount && (
            <div
              className="hidden sm:flex items-center bg-[#FF7A8A] rounded-[8px] px-2 py-2 text-[10px] lg:text-[14px] font-satoshi-bold text-black"
            >
              Bank details Pending
            </div>
          )}
          <div
            className={`w-auto h-[18px] sm:h-[24px] lg:h-[30px] rounded-[6px] sm:rounded-[8px] text-[8px] sm:text-[10px] lg:text-[14px] items-center flex justify-center px-[4px] sm:px-[6px] lg:px-[10px] py-[2px] sm:py-[4px] lg:py-[7px] font-medium text-black
              ${organizer?.verification_status === 'PENDING'
                ? 'bg-[#FEE440]'
                : organizer?.verification_status === 'APPROVED'
                  ? 'bg-[#4EF162]'
                  : organizer?.verification_status === 'REJECTED'
                    ? 'bg-red-500'
                    : 'bg-[#FEE440]'
              }
            `}
          >
            <span className="flex items-center justify-center gap-0.5 sm:gap-1">
              <span className="sm:hidden text-[7px] font-satoshi-bold">
                {organizer?.verification_status === 'PENDING'
                  ? 'Pending'
                  : organizer?.verification_status === 'APPROVED'
                    ? 'Approved'
                    : organizer?.verification_status === 'REJECTED'
                      ? 'Rejected'
                      : 'Unknown'}
              </span>

              <span className="hidden sm:flex items-center gap-1">
                <span className="lg:inline hidden">Account Status:</span>
                <span className="sm:inline lg:hidden">Status:</span>
                <span className="font-satoshi-bold">
                  <span className="lg:inline hidden">Verification </span>
                  {organizer?.verification_status
                    ?.toLowerCase()
                    .replace(/^\w/, (c) => c.toUpperCase()) || 'Unknown'}
                </span>
                <InfoSubText
                  text=""
                  infoSize={12}
                  fillColor="#FEE440"
                  hoverMessage="You need to verify your physical location with Athlitics representative which will validate your place of business and amenities list."
                />
              </span>
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button">
                <div>
                  <Avatar src={organizerLogo} name={organizerName} size={28} />
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-white text-center font-medium cursor-pointer"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <div className="flex-1 flex flex-col w-full bg-[#16171B]">
        <main className="transition-all duration-300 ease-in-out animate-in fade-in-0 slide-in-from-right-2 pt-0 md:pt-0 lg:pt-0 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
