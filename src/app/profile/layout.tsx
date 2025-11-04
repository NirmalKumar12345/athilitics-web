'use client';
import ProgressPreviewSection from '@/components/registerUser/ProgressPreviewSection';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import LoadingOverlay from '@/components/ui/loadingOverlay';
import { ProgressContext } from '@/contexts/ProgressContext';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Routes } from '../constants/routes';

function Navbar() {
  const router = useRouter();
  const [uploadedLogo, setUploadedLogo] = React.useState<string | null>(null);
  const [orgName, setOrgName] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    const updateLogo = () => {
      const logo = sessionStorage.getItem('uploadedLogo');
      setUploadedLogo(logo && logo !== '' ? logo : null);
      const name = localStorage.getItem('organizerName') || '';
      setOrgName(name);
    };
    updateLogo();
    window.addEventListener('storage', updateLogo);
    window.addEventListener('uploadedLogoChanged', updateLogo);
    return () => {
      window.removeEventListener('storage', updateLogo);
      window.removeEventListener('uploadedLogoChanged', updateLogo);
    };
  }, []);
  function getInitials(name: string) {
    if (!name) return '';
    const words = name.trim().split(' ');
    return words
      .slice(0, 1)
      .map((w) => w[0]?.toUpperCase() || '')
      .join('');
  }
  const handleLogout = () => {
    setLoading(true);
    localStorage.clear();
    sessionStorage.clear();
    setLoading(false);
    router.push(Routes.LOGIN);
  };
  return (
    <>
      {loading && <LoadingOverlay />}
      <nav className="w-full h-[54px] fixed top-0 left-0 z-10 flex justify-between items-center px-4 sm:px-8 lg:px-[130px] py-[12px] shadow-sm border-b border-b-[#444444] bg-[#16171B]">
        <img
          src="/images/logo.svg"
          alt="Logo"
          className="w-[80px] sm:w-[96.34px] h-[24px] sm:h-[28px]"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {uploadedLogo ? (
              <img
                src={uploadedLogo}
                alt="Uploaded logo"
                className="w-[30px] h-[30px] rounded-full object-cover cursor-pointer"
              />
            ) : (
              <div className="bg-[#FEE440] w-[30px] h-[30px] rounded-full text-[14px] items-center flex justify-center font-medium cursor-pointer">
                {getInitials(orgName) || ''}
              </div>
            )}
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
      </nav>
    </>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [formikValues, setFormikValues] = React.useState({});
  const [dynamicProgressValue, setDynamicProgressValue] = React.useState(0);
  const [uploadedImage, setUploadedImage] = React.useState<string | null>(null);

  const contextValue = {
    formikValues,
    dynamicProgressValue,
    uploadedImage,
    setFormikValues,
    setDynamicProgressValue,
    setUploadedImage,
  };

  return (
    <ProgressContext.Provider value={contextValue}>
      <div className="flex flex-col md:flex-row h-screen">
        <Navbar />
        <div className="flex flex-col md:flex-row flex-1 pt-[54px] h-full">
          <div
            className="flex-1 overflow-y-auto"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <main>{children}</main>
          </div>
          <div className="hidden md:block md:w-[350px] lg:w-[400px] h-full bg-[#16171B] border-l border-[#323232] flex-shrink-0">
            <ProgressPreviewSection
              formik={{ values: formikValues } as any}
              dynamicProgressValue={dynamicProgressValue}
              uploadedImage={uploadedImage}
            />
          </div>
        </div>
      </div>
    </ProgressContext.Provider>
  );
}
