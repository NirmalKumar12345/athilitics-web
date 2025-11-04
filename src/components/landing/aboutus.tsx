import Image from 'next/image';
import AllSports from '../../../public/images/all-sports.webp';
import Automatic from '../../../public/images/automatic.svg';
import Atheltes_Players from '../../../public/images/athletes-players.webp';
import Highlight from '../../../public/images/highlight.svg';
import InstantDataEntry from '../../../public/images/instant-data-entry.svg';
import MobileFrame from '../../../public/images/mobile-frame.webp';
import NoMoreClicks from '../../../public/images/no-more-clicks.svg';
import Onboarding from '../../../public/images/onboarding.svg';
import Recommendations from '../../../public/images/recommendations.svg';
import Scheduling from '../../../public/images/scheduling.svg';
import {
  automaticText,
  automaticTitle,
  communityLabel,
  heading1,
  heading2,
  heading3,
  heading4,
  instantDataEntryText,
  instantDataEntryTitle,
  noMoreClicksText,
  noMoreClicksTitle,
  onboardingText,
  onboardingTitle,
  recommendationsText,
  recommendationsTitle,
  schedulingText,
  schedulingTitle,
  subheading1,
  subheading2,
} from '../../constants/aboutus';

export default function Aboutus() {
  return (
    <div className="w-full">
      <div className="bg-[#16171B] w-[calc(100vw-15vw)] px-[4vw] mx-auto mt-[10%] rounded-[24px] py-[5vh]">
        <div
          className={`flex items-center justify-center text-white font-sansation-bold font-[700] text-[4.2vw] sm:text-[4vw] md:text-[3.7vw] text-center`}
        >
          {heading1}
          <div className="bg-green text-black px-[10px] rounded-[7px] ml-[10px] font-sansation-bold">
            Club and Community
          </div>
        </div>
        <div
          className={`text-white font-sansation-bold font-[700] text-[4.2vw] sm:text-[4vw] md:text-[3.7vw] text-center`}
        >
          {heading2}
        </div>

        <div className="text-gray text-[14px] sm:text-[16px] md:text-[18px] text-center max-w-[90%] md:max-w-[70%] m-auto mt-[10px] leading-[3.5vh]">
          {subheading1}
        </div>

        <div className="flex justify-center relative mt-[7.5vh]">
          <Image src={MobileFrame} alt="mobile-frame" className="relative bottom-[0px] z-[999] w-auto h-auto sm:w-[620px] sm:h-[320px]" />
          <Image
            src={Atheltes_Players}
            alt="Atheltes_Players"
            className="absolute left-1/2 top-1/2 z-[9999] translate-x-[-50%] translate-y-[-50%] w-[891px] h-[381px]"
            style={{ objectFit: 'contain' }}
          />
          <div
            className={`absolute -top-[40px] font-sansation-bold font-[700] text-[10vw] text-[#313030]`}
          >
            {communityLabel}
          </div>
        </div>
      </div>

      <div className="bg-[#16171B] w-[calc(100vw-15vw)] px-[4vw] mx-auto mt-[6%] rounded-[24px] py-[5vh]">
        <div
          className={`text-white font-sansation-bold font-[700] text-[4.2vw] sm:text-[4vw] md:text-[3.7vw] text-center`}
        >
          {heading3}
        </div>
        <div
          className={`flex items-center justify-center text-white font-sansation-bold font-[700] text-[4.2vw] sm:text-[4vw] md:text-[3.7vw] text-center`}
        >
          {heading4}
          <div className="bg-green text-black px-[10px] rounded-[7px] ml-[10px] font-sansation-bold">
            Tournament Management
          </div>
        </div>

        <div className="text-gray text-[14px] sm:text-[16px] md:text-[18px] text-center max-w-[90%] md:max-w-[70%] m-auto mt-[25px] leading-[3.5vh]">
          {subheading2}
        </div>

        <Image
          src={AllSports}
          alt="all-sports"
          className="w-[calc(100vw-10vw)]  max-w-[calc(100vw-10vw)] m-auto relative -left-[6vw]"
        />

        <div
          className={`mt-[10vh] mb-[5vh] w-[fit-content] m-auto relative flex items-center justify-center text-white font-sansation-bold font-[700] text-[4.2vw] sm:text-[4vw] md:text-[3.7vw] text-center`}
        >
          Voice-Powered
          <div className="bg-green text-black px-[10px] rounded-[7px] ml-[10px] mr-[5px] font-sansation-bold">
            AI
          </div>
          Assistance
          <div className="absolute -right-[55px] top-[10px]">
            <Image src={Highlight} alt="highlight" />
          </div>
        </div>

        <div className="flex flex-wrap justify-center">
          <div className="max-w-[360px] flex flex-col items-center bg-black p-[25px] py-[40px] rounded-[12px] my-[5px] mx-[5px]">
            <Image src={NoMoreClicks} className=" text-center" alt="no-more-clicks" />
            <div className="text-green text-center my-[10px] text-[22px] font-sansation-bold">
              {noMoreClicksTitle}
            </div>
            <div className="text-white text-center text-[18px]">{noMoreClicksText}</div>
          </div>
          <div className="max-w-[360px] flex flex-col items-center bg-black p-[25px] py-[40px] rounded-[12px] my-[5px] mx-[5px]">
            <Image src={InstantDataEntry} alt="instant-data-entry" />
            <div className="text-green text-center my-[10px] text-[22px] font-sansation-bold">
              {instantDataEntryTitle}
            </div>
            <div className="text-white text-center text-[18px]">{instantDataEntryText}</div>
          </div>
          <div className="max-w-[360px] flex flex-col items-center bg-black p-[25px] py-[40px] rounded-[12px] my-[5px] mx-[5px]">
            <Image src={Onboarding} alt="onboarding" />
            <div className="text-green text-center my-[10px] text-[22px] font-sansation-bold">
              {onboardingTitle}
            </div>
            <div className="text-white text-center text-[18px]">{onboardingText}</div>
          </div>
          <div className="max-w-[360px] flex flex-col items-center bg-black p-[25px] py-[40px] rounded-[12px] my-[5px] mx-[5px]">
            <Image src={Automatic} alt="automatic" />
            <div className="text-green text-center my-[10px] text-[22px] font-sansation-bold">
              {automaticTitle}
            </div>
            <div className="text-white text-center text-[18px]">{automaticText}</div>
          </div>
          <div className="max-w-[360px] flex flex-col items-center bg-black p-[25px] py-[40px] rounded-[12px] my-[5px] mx-[5px]">
            <Image src={Recommendations} alt="recommendations" />
            <div className="text-green text-center my-[10px] text-[22px] font-sansation-bold">
              {recommendationsTitle}
            </div>
            <div className="text-white text-center text-[18px]">{recommendationsText}</div>
          </div>
          <div className="max-w-[360px] flex flex-col items-center bg-black p-[25px] py-[40px] rounded-[12px] my-[5px] mx-[5px]">
            <Image src={Scheduling} alt="scheduling" />
            <div className="text-green text-center my-[10px] text-[22px] font-sansation-bold">
              {schedulingTitle}
            </div>
            <div className="text-white text-center text-[18px]">{schedulingText}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
