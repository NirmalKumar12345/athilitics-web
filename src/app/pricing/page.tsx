'use client';
import CommonPricing from '@/components/CommonPricing';
import Footer from '@/components/footer';
import Header from '@/components/header';
import Image from 'next/image';
import HomeBgGradient from '../../../public/images/home-bg-gradient.svg';

export default function Pricing() {
  return (
    <div className="bg-black-400 w-full min-h-[100vh] relative">
      <Header className="px-2 sm:px-4 md:px-[5vw] mt-[25px]" />

      <Image
        src={HomeBgGradient}
        className="absolute right-[0px] top-[0px] z-[9998] opacity-20"
        alt="home-bg-gradient"
      />

      <div className="w-[95%] sm:w-[90%] md:w-[85%] px-2 sm:px-4 md:px-[2vw] pt-4 sm:pt-8 md:pt-[20px] pb-[20px] m-auto relative z-[9999] flex flex-col items-center">
        <div
          className={`font-sansation-bold font-[700] text-[32px] sm:text-[48px] md:text-[58px] lg:text-[78px] text-white text-center mb-[10px] drop-shadow-lg`}
        >
          Pricing Plan
        </div>
        <CommonPricing
          showCardWrapper={true}
          showComparison={false}
          pricingTiersJustify="justify-evenly"
          frequencySelectorJustify="justify-center"
          showPricingTiers={true}
          showTitle={false}
          savePercentageText="Save 10%"
          wrapperClassName="mb-[20px] shadow-2xl shadow-black/20"
        />
        <div className="w-[100%] overflow-x-auto bg-[#16171B] rounded-[40px] shadow-2xl shadow-black/20">
          <CommonPricing
            showCardWrapper={false}
            comparisonBgColor="bg-[#16171B]"
            showComparison={true}
            showPricingTiers={false}
            showTitle={false}
            wrapperClassName="bg-transparent p-0"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
