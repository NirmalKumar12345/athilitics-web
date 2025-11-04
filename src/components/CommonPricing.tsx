import { PRICING_OPTIONS, PRICING_OPTIONS_COMPARISON } from '@/app/constants/pricing';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useState } from 'react';
import CheckImage from '../../public/images/check.svg';

interface CommonPricingProps {
  showCardWrapper?: boolean;
  wrapperClassName?: string;
  showComparison?: boolean;
  savePercentageText?: string;
  showPricingTiers?: boolean;
  showTitle?: boolean;
  comparisonBgColor?: string;
  pricingTiersJustify?: string;
  frequencySelectorJustify?: string;
}

export default function CommonPricing({
  showCardWrapper = false,
  wrapperClassName = '',
  showComparison = true,
  savePercentageText = 'Save 10%',
  showPricingTiers = true,
  showTitle = true,
  comparisonBgColor = 'bg-black',
  pricingTiersJustify = 'justify-between',
  frequencySelectorJustify = 'justify-start',
}: CommonPricingProps) {
  const [frequency, setFrequency] = useState('yearly');

  const PricingContent = () => (
    <>
      {showTitle && !showCardWrapper && (
        <div className="mb-4 sm:mb-6">
          <span className="text-lg sm:text-xl md:text-[22px] font-satoshi-bold text-white text-center sm:text-left w-full block">
            Select Subscription Plan
          </span>
        </div>
      )}

      {showPricingTiers && (
        <div
          className={`flex flex-col sm:flex-row items-center ${frequencySelectorJustify} mb-6 sm:mb-8 gap-3 sm:gap-4`}
        >
          <div className="w-[200px] sm:w-[220px] h-[45px] sm:h-[50px] bg-[#51F162] rounded-[60px] flex items-center justify-center text-base sm:text-[18px] transition-all duration-300 ease-in-out hover:bg-[#4EF162] hover:shadow-lg hover:shadow-green-400/30">
            <div
              onClick={() => setFrequency('monthly')}
              className={`font-satoshi-medium w-[95px] sm:w-[105px] h-[35px] sm:h-[40px] flex justify-center items-center cursor-pointer rounded-[60px] transition-all duration-300 ease-in-out hover:scale-105 ${
                frequency === 'monthly'
                  ? 'bg-[#000000] text-[#51F162] shadow-lg shadow-black/50'
                  : 'text-black hover:bg-black/10 hover:text-gray-800'
              }`}
              role="radio"
              aria-checked={frequency === 'monthly'}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setFrequency('monthly');
                }
              }}
            >
              Monthly
            </div>
            <div
              onClick={() => setFrequency('yearly')}
              className={`font-satoshi-medium w-[95px] sm:w-[105px] h-[35px] sm:h-[40px] flex justify-center items-center cursor-pointer rounded-[60px] transition-all duration-300 ease-in-out hover:scale-105 ${
                frequency === 'yearly'
                  ? 'bg-[#000000] text-[#51F162] shadow-lg shadow-black/50'
                  : 'text-black hover:bg-black/10 hover:text-gray-800'
              }`}
              role="radio"
              aria-checked={frequency === 'yearly'}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setFrequency('yearly');
                }
              }}
            >
              Yearly
            </div>
          </div>
          <div
            className="font-satoshi-regular text-sm sm:text-[14px] text-white transition-all duration-300 hover:text-[#4EF162] hover:drop-shadow-[0_0_4px_rgba(78,241,98,0.4)]"
            role="text"
            aria-label={`Save percentage: ${savePercentageText}`}
          >
            {savePercentageText}
          </div>
        </div>
      )}

      {showPricingTiers && (
        <div
          className={`flex flex-col md:flex-row ${pricingTiersJustify} items-stretch w-full gap-3 sm:gap-4 md:gap-[15px] mb-4 sm:mb-6`}
        >
          {PRICING_OPTIONS.map((plan) => (
            <div
              key={plan.id}
              className="flex-1 max-w-full sm:max-w-[350px] md:max-w-[370px] w-full px-3 sm:px-4 md:px-6 lg:px-[16px] py-6 sm:py-8 md:py-[32px] rounded-[16px] sm:rounded-[18px] md:rounded-[20px] bg-black transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-green-500/10"
              role="article"
              aria-labelledby={`plan-${plan.id}-title`}
            >
              <div
                id={`plan-${plan.id}-title`}
                className={`${plan.bg} font-satoshi-medium w-fit h-[32px] sm:h-[35px] md:h-[38px] flex items-center text-[#000000] text-base sm:text-[17px] md:text-[18px] rounded-[6px] sm:rounded-[7px] md:rounded-[8px] px-2 sm:px-3 md:px-[10px] transition-all duration-300 ease-in-out`}
              >
                {plan.name}
              </div>
              <div
                className="font-satoshi-medium text-2xl sm:text-[26px] md:text-[28px] text-white mt-3 sm:mt-4 md:mt-[15px]"
                aria-label={`Price: ${frequency === 'monthly' ? plan.price : plan.yearly_price}`}
              >
                {frequency === 'monthly' ? plan.price : plan.yearly_price}
              </div>
              <div className="font-satoshi-regular text-white text-xs sm:text-[12px] md:text-[13px]">
  {frequency === 'monthly' ? plan.frequency : 'Per Year '}
  {(plan.id === 2 || plan.id === 3) && (
    <span className="font-satoshi-regular text-sm sm:text-[14px] md:text-[13px] text-white">+ GST</span>
  )}
</div>
              <div
                className="w-full h-[1px] bg-[#343434] my-2 sm:my-3 md:my-[10px]"
                role="separator"
              />
              <div
                className={`font-satoshi-regular ${plan.color} text-sm sm:text-[14px] md:text-[15px]`}
              >
                {plan.free_events}
              </div>
              <div className="font-satoshi-regular text-white text-xs sm:text-[12px] md:text-[13px] mb-2 sm:mb-3 md:mb-[10px]">
                Number of Events per Year
              </div>
              <div
                className={`font-satoshi-regular ${plan.color} text-sm sm:text-[14px] md:text-[15px]`}
              >
                {plan.publishing_pay} {plan.id === 1 && (
  <span className="font-satoshi-regular text-sm sm:text-[14px] md:text-[15px] text-white">+ GST</span>
)}
              </div>
              <div className="font-satoshi-regular text-white text-xs sm:text-[12px] md:text-[13px] mb-4 sm:mb-5 md:mb-[15px]">
                Pay-per-Event Publishing
              </div>
              <div className={`font-satoshi-regular ${plan.color} text-xs sm:text-[12px] md:text-[13px] mb-3 sm:mb-3 md:mb-[10px]`}>
                Platform fee for player - 10% or 50
              </div>
              <div className={`font-satoshi-regular ${plan.color} text-xs sm:text-[12px] md:text-[13px] mb-4 sm:mb-5 md:mb-[15px]`}>
                whichever <span className={`font-satoshi-bold text-black ${plan.bg} text-[14px] rounded-[8px] px-2 py-1`}>{plan.gst}</span>
              </div>
              <div className="font-satoshi-regular text-white text-xs sm:text-[12px] md:text-[13px]">
                {plan.payement_gst}
              </div>
              <div className="font-satoshi-regular text-white text-xs sm:text-[12px] md:text-[13px] mb-4 sm:mb-5 md:mb-[15px]">
                {plan.total}
              </div>
              <Button
                type="button"
                className="w-full h-[48px] sm:h-[52px] md:h-[56px] rounded-[6px] sm:rounded-[7px] md:rounded-[8px] border border-[#ffffff] flex items-center justify-center cursor-pointer py-3 sm:py-4 md:py-[16px] bg-black transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-green-500/20 hover:border-[#4EF162] group focus:ring-2 focus:ring-[#4EF162] focus:ring-offset-2 focus:ring-offset-black"
                aria-label={
                  plan.invite_only ? `${plan.name} - Invite Only` : `Get Started with ${plan.name}`
                }
              >
                {plan.invite_only ? (
                  <span className="font-satoshi-bold text-sm sm:text-[15px] md:text-base text-[#4EF162] transition-all duration-300 group-hover:text-[#51F162] group-hover:drop-shadow-[0_0_8px_rgba(78,241,98,0.6)]">
                    Invite Only
                  </span>
                ) : (
                  <span className="font-satoshi-bold text-sm sm:text-[15px] md:text-base text-[#ffffff] transition-all duration-300 group-hover:text-[#4EF162] group-hover:drop-shadow-[0_0_8px_rgba(78,241,98,0.4)]">
                    Get Started
                  </span>
                )}
              </Button>
            </div>
          ))}
        </div>
      )}

      {showComparison && (
        <div
          className={`px-2 sm:px-4 md:px-6 lg:px-[26px] py-6 sm:py-8 md:py-[30px] ${comparisonBgColor} rounded-[6px] sm:rounded-[7px] md:rounded-[8px] transition-all duration-300 ease-in-out`}
        >
          <div className="font-sansation-bold text-xl sm:text-[22px] md:text-[24px] text-[#4EF162] mb-2">
            Compare features by plan
          </div>
          <div className="font-satoshi-regular text-sm sm:text-[16px] md:text-[17px] text-[#C7C7C8] mb-8 sm:mb-10 md:mb-[40px]">
            The larger your club, the better the rewards. Scale up, compete more, and dominate the
            leaderboard!
          </div>

          <div className="overflow-x-auto -mx-2 sm:-mx-4 md:-mx-6 lg:-mx-[26px]">
            <div className="min-w-[450px] px-2 sm:px-4 md:px-6 lg:px-[26px]">
              <div className="grid grid-cols-4 gap-3 sm:gap-4 md:gap-[15px] items-center mb-3 sm:mb-4 md:mb-[10px]">
                <div className="col-span-1 font-satoshi-medium text-sm sm:text-[15px] md:text-[16px] text-[#4EF162]">
                  Features
                </div>
                <div className="col-span-1 flex items-center justify-center">
                  <div
                    className={`text-center ${PRICING_OPTIONS[0].bg} font-satoshi-medium h-[26px] sm:h-[28px] md:h-[30px] flex items-center text-[#000000] text-xs sm:text-[14px] md:text-[16px] rounded-[6px] sm:rounded-[7px] md:rounded-[8px] px-2 sm:px-3 md:px-[10px] transition-all duration-300 ease-in-out`}
                  >
                    Free Tier
                  </div>
                </div>
                <div className="col-span-1 flex items-center justify-center">
                  <div
                    className={`text-center ${PRICING_OPTIONS[1].bg} font-satoshi-medium h-[26px] sm:h-[28px] md:h-[30px] flex items-center text-[#000000] text-xs sm:text-[14px] md:text-[16px] rounded-[6px] sm:rounded-[7px] md:rounded-[8px] px-2 sm:px-3 md:px-[10px] transition-all duration-300 ease-in-out`}
                  >
                    Pro Tier
                  </div>
                </div>
                <div className="col-span-1 flex items-center justify-center">
                  <div
                    className={`text-center ${PRICING_OPTIONS[2].bg} font-satoshi-medium h-[26px] sm:h-[28px] md:h-[30px] flex items-center text-[#000000] text-xs sm:text-[14px] md:text-[16px] rounded-[6px] sm:rounded-[7px] md:rounded-[8px] px-2 sm:px-3 md:px-[10px] transition-all duration-300 ease-in-out`}
                  >
                    Pro Plus Tier
                  </div>
                </div>
              </div>

              {PRICING_OPTIONS_COMPARISON.map((option) => (
                <div
                  className={`font-satoshi-regular text-sm sm:text-[15px] md:text-[16px] text-white grid grid-cols-4 gap-3 sm:gap-4 md:gap-[15px] items-center ${
                    option.id === PRICING_OPTIONS_COMPARISON.length ? '' : 'border-b'
                  } border-b-[#4C4C4C] py-3 sm:py-4 md:py-[15px] transition-all duration-200 hover:bg-[#1a1a1a] hover:bg-opacity-50`}
                  key={option.id}
                  role="row"
                >
                  <div className="col-span-1" role="cell">
                    <span className="text-sm sm:text-[15px] md:text-[16px] leading-tight">
                      {option.feature}
                    </span>
                  </div>
                  <div
                    className="col-span-1 flex items-center justify-center text-center"
                    role="cell"
                  >
                    {option.free_tier && (
                      <Image
                        src={CheckImage}
                        alt="Included"
                        width={20}
                        height={20}
                        className="sm:w-[22px] sm:h-[22px] md:w-[24px] md:h-[24px] mx-2 sm:mx-3 md:mx-[10px] transition-all duration-300 ease-in-out hover:scale-110"
                      />
                    )}
                    {option.free_tier_text && (
                      <span className="text-xs sm:text-sm md:text-[14px]">
                        {option.free_tier_text}
                      </span>
                    )}
                  </div>
                  <div
                    className="col-span-1 flex items-center justify-center text-center"
                    role="cell"
                  >
                    {option.pro_tier && (
                      <Image
                        src={CheckImage}
                        alt="Included"
                        width={20}
                        height={20}
                        className="sm:w-[22px] sm:h-[22px] md:w-[24px] md:h-[24px] mx-2 sm:mx-3 md:mx-[10px] transition-all duration-300 ease-in-out hover:scale-110"
                      />
                    )}
                    {option.pro_tier_text && (
                      <span className="text-xs sm:text-sm md:text-[14px]">
                        {option.pro_tier_text}
                      </span>
                    )}
                  </div>
                  <div
                    className="col-span-1 flex items-center justify-center text-center"
                    role="cell"
                  >
                    {option.pro_plus_tier && (
                      <Image
                        src={CheckImage}
                        alt="Included"
                        width={20}
                        height={20}
                        className="sm:w-[22px] sm:h-[22px] md:w-[24px] md:h-[24px] mx-2 sm:mx-3 md:mx-[10px] transition-all duration-300 ease-in-out hover:scale-110"
                      />
                    )}
                    {option.pro_plus_tier_text && (
                      <span className="text-xs sm:text-sm md:text-[14px]">
                        {option.pro_plus_tier_text}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-4 gap-3 sm:gap-4 md:gap-[15px] items-end justify-items-center mt-6 sm:mt-7 md:mt-8 mb-3 sm:mb-4">
                <div></div>
                <div className="w-full max-w-[120px] sm:max-w-[150px] md:max-w-[190px] flex justify-center">
                  <Button
                    className="w-full h-[44px] sm:h-[50px] md:h-[56px] rounded-[6px] sm:rounded-[7px] md:rounded-[8px] border border-[#ffffff] bg-[#16171B] font-satoshi-bold text-sm sm:text-[15px] md:text-[16px] text-white cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-white/20 hover:bg-[#1a1b1f] hover:border-[#4EF162] hover:text-[#4EF162] hover:drop-shadow-[0_0_8px_rgba(78,241,98,0.4)] focus:ring-2 focus:ring-[#4EF162] focus:ring-offset-2 focus:ring-offset-[#16171B]"
                    variant="outline"
                    aria-label="Get Started with Free Tier"
                  >
                    Get Started
                  </Button>
                </div>
                <div className="w-full max-w-[120px] sm:max-w-[150px] md:max-w-[190px] flex justify-center">
                  <Button
                    className="w-full h-[44px] sm:h-[50px] md:h-[56px] rounded-[6px] sm:rounded-[7px] md:rounded-[8px] border border-[#ffffff] bg-[#16171B] font-satoshi-bold text-sm sm:text-[15px] md:text-[16px] text-white cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-white/20 hover:bg-[#1a1b1f] hover:border-[#4EF162] hover:text-[#4EF162] hover:drop-shadow-[0_0_8px_rgba(78,241,98,0.4)] focus:ring-2 focus:ring-[#4EF162] focus:ring-offset-2 focus:ring-offset-[#16171B]"
                    variant="outline"
                    aria-label="Get Started with Pro Tier"
                  >
                    Get Started
                  </Button>
                </div>
                <div className="w-full max-w-[120px] sm:max-w-[150px] md:max-w-[190px] flex justify-center">
                  <Button
                    className="w-full h-[44px] sm:h-[50px] md:h-[56px] rounded-[6px] sm:rounded-[7px] md:rounded-[8px] border border-[#ffffff] bg-[#16171B] font-satoshi-bold text-sm sm:text-[15px] md:text-[16px] text-[#4EF162] cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-green-500/30 hover:bg-[#1a1b1f] hover:border-[#51F162] hover:text-[#51F162] hover:drop-shadow-[0_0_12px_rgba(78,241,98,0.6)] focus:ring-2 focus:ring-[#4EF162] focus:ring-offset-2 focus:ring-offset-[#16171B]"
                    variant="outline"
                    aria-label="Pro Plus Tier - Invite Only"
                  >
                    Invite Only
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  if (showCardWrapper) {
    return (
      <div
        className={`w-full bg-[#16171B] rounded-[40px] p-4 sm:p-6 md:p-[25px] pb-[10px] transition-all duration-300 ease-in-out ${wrapperClassName}`}
      >
        <PricingContent />
      </div>
    );
  }

  return (
    <div
      className={`bg-[#16171B] rounded-[20px] py-[46px] px-4 sm:px-8 md:px-12 lg:px-16 xl:px-[85px] w-full transition-all duration-300 ease-in-out ${wrapperClassName}`}
    >
      <PricingContent />
    </div>
  );
}
