'use client';
import Image from 'next/image';
import DataBackedDecisions from '../../../public/images/data-backed-decisions.svg';
import InspiringLeaderboards from '../../../public/images/inspiring-leaderboards.webp';
import PersonalizedExperience from '../../../public/images/personalised-experience.svg';
import PowerfulStats from '../../../public/images/powerful-status.svg';
import TableTennis from '../../../public/images/table-tennis.svg';

export default function DataDrivenInsights() {
  return (
    <div className="w-full bg-[#0F0F0F] m-auto mt-[10vh] py-[15vh] px-[10vw]">
      <div className="flex justify-between items-center">
        <Image src={TableTennis} alt="table tennis" className="w-[70px] md:w-[80px] lg:w-auto" />
        <div className="mx-[5vw]">
          <div
            className={`flex items-center justify-center text-white font-sansation-bold font-[700] text-[4.2vw] sm:text-[4vw] md:text-[3.7vw] text-center`}
          >
            <div className="bg-green text-black px-[10px] rounded-[7px] mr-[10px]">Data-Driven</div>
            Insights &
          </div>

          <div
            className={`text-white font-sansation-bold font-[700] text-[4.2vw] sm:text-[4vw] md:text-[3.7vw] text-center`}
          >
            Engagement
          </div>
        </div>
        <Image src={TableTennis} alt="table tennis" className="w-[70px] md:w-[80px] lg:w-auto" />
      </div>

      <div className="flex flex-wrap justify-between mt-[50px]">
        <div className="w-[100%] lg:w-[38.5%] bg-[#16171B] px-[25px] pt-[35px] rounded-[24px] mb-[25px] flex flex-col justify-between">
          <div>
            <div className={`text-white font-sansation-bold font-[500] text-[40px]`}>
              Powerful Stats & Analytics
            </div>
            <div className="text-[#F3F3F3] text-[18px] mt-[10px] mb-[40px] leading-[22.6px]">
              Track performances, highlight rising stars, and reveal friendly rivalries. Your
              players stay motivated and inspired.
            </div>
          </div>

          <div className="bg-black w-[90%] h-[180px] relative bottom-[0px] mx-auto rounded-t-[10px]">
            <Image src={PowerfulStats} className="w-[100%] h-[100%]" alt="powerfulstats" />
          </div>
        </div>

        <div className="w-[100%] lg:w-[58.5%] bg-[#16171B] px-[25px] pt-[35px] rounded-[24px] mb-[25px] flex flex-col justify-between">
          <div>
            <div className={`text-white font-sansation-bold font-[500] text-[40px]`}>
              Personalized Experience
            </div>
            <div className="text-[#F3F3F3] text-[18px] mt-[10px] mb-[40px] leading-[22.6px]">
              Offer targeted event invitations and challenges based on each player’s activity, skill
              level, and interests.
            </div>
          </div>

          <div className="bg-black w-[90%] h-[250px] relative bottom-[0px] mx-auto rounded-t-[10px]">
            <Image
              className="w-[100%] h-[100%]"
              src={PersonalizedExperience}
              alt="personalized-experience"
            />
          </div>
        </div>

        <div className="w-[100%] lg:w-[58.5%] bg-[#16171B] px-[25px] pt-[35px] rounded-[24px] mb-[25px] flex flex-col justify-between">
          <div>
            <div className={`text-white font-sansation-bold font-[500] text-[40px]`}>
              Inspiring Leaderboards
            </div>
            <div className="text-[#F3F3F3] text-[18px] mt-[10px] mb-[40px] leading-[22.6px]">
              Engage your members with seasonal rankings, club championships, and “player of the
              week” spotlights.
            </div>
          </div>

          <div className="bg-black w-[90%] h-[250px] relative bottom-[0px] mx-auto rounded-t-[30px]">
            <Image
              className="w-[100%] h-[100%]"
              src={InspiringLeaderboards}
              alt="inspiring-leaderboards"
            />
          </div>
        </div>

        <div className="w-[100%] lg:w-[38.5%] bg-[#16171B] px-[25px] pt-[35px] rounded-[24px] mb-[25px] flex flex-col justify-between">
          <div>
            <div className={`text-white font-sansation-bold font-[500] text-[40px]`}>
              Data-Backed Decisions
            </div>
            <div className="text-[#F3F3F3] text-[18px] mt-[10px] mb-[40px] leading-[22.6px]">
              Make strategic moves—like expanding club operations or adding new events—based on
              AI-driven insights.
            </div>
          </div>

          <div className="bg-black w-[90%] h-[180px] relative bottom-[0px] mx-auto rounded-t-[10px]">
            <Image
              className="w-[100%] h-[100%]"
              src={DataBackedDecisions}
              alt="data-backed-decisions"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
