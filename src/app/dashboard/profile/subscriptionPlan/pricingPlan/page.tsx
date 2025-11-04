'use client';
import PricingPlanSelector from '@/components/PricingPlanSelector';

export default function SelectPlan() {
  return (
    <div className="min-h-screen w-screen bg-[#16171B]">
      <div className="px-2 sm:px-4 md:px-8 lg:px-12 xl:px-24 2xl:px-[150px] flex-1 w-full flex flex-col items-start justify-start gap-4 py-4 sm:py-5 md:py-[20px] mt-18 sm:mt-8 md:mt-[102px]">
        <div className="w-full max-w-[1200px] mx-auto">
          <PricingPlanSelector />
        </div>
      </div>
    </div>
  );
}
