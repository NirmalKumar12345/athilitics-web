'use client';
import Image from 'next/image';
import BasketBall from '../../../public/images/basketball.svg';

export default function Clubs() {
  return (
    <div className="w-full bg-[#0F0F0F] py-[8.5vh]">
      <div className="w-[calc(100%-60px)] m-auto bg-[#16171B] rounded-[24px] py-[7vh] px-[5vw]">
        <div className="flex justify-center items-center">
          <Image src={BasketBall} alt="basketball" className="w-[70px] md:w-[80px] lg:w-auto" />
          <div className="mx-[5vw] flex items-center">
            <div
              className={`flex items-center justify-center text-white font-sansation-bold font-[700] text-[4.2vw] sm:text-[4vw] md:text-[3.7vw] text-center`}
            >
              For Clubs of
            </div>

            <div
              className={`w-[fit-content] font-sansation-bold font-[700] text-[4.2vw] sm:text-[4vw] md:text-[3.7vw] text-center bg-green text-black px-[10px] rounded-[7px] ml-[20px]`}
            >
              Every Size
            </div>
          </div>
          <Image src={BasketBall} alt="basketball" className="w-[70px] md:w-[80px] lg:w-auto" />
        </div>

        <div className="mt-[10vh] overflow-x-auto no-scrollbar">
          <div className="w-[max-content] flex items-center justify-center">
            <div className="w-[150px] text-white text-[26px] flex flex-col justify-between">
              <div className="h-[150px] flex items-center">Club Size</div>
              <div className="h-[120px] flex items-center">Focus</div>
              <div className="h-[120px] flex items-center">Key Features</div>
              <div className="h-[120px] flex items-center">AI Role</div>
              <div className="h-[120px] flex items-center">Player Engagement</div>
            </div>

            <div className="bg-[#F7FFE3] w-[340px] max-w-[350px] rounded-[20px] mx-[10px] text-[20px]">
              <div className="h-[150px] flex flex-col justify-center px-[25px] border-b border-b-[#C0C0C0]">
                <div className={`text-black font-[900] text-[36px]`}>Small Clubs</div>
                <div className="text-[#00C418] font-[700] text-[26px]">30+ Players</div>
              </div>
              <div className="h-[120px] flex items-center px-[25px] border-b border-b-[#C0C0C0]">
                Reduce admin overhead, stay organized, and focus on fun
              </div>
              <div className="h-[120px] flex items-center px-[25px] border-b border-b-[#C0C0C0]">
                Simple interface, system handles admin tasks
              </div>
              <div className="h-[120px] flex items-center px-[25px] border-b border-b-[#C0C0C0]">
                Handles admin tasks, allows focus on community building
              </div>
              <div className="h-[120px] flex items-center px-[25px]">
                Focus on fun and community building
              </div>
            </div>

            <div className="bg-[#F7FFE3] w-[340px] max-w-[350px] rounded-[20px] mx-[10px] text-[20px]">
              <div className="h-[150px] flex flex-col justify-center px-[25px] border-b border-b-[#C0C0C0]">
                <div className={`text-black font-[900] text-[36px]`}>Medium Clubs</div>
                <div className="text-[#00C418] font-[700] text-[26px]">64+ Players</div>
              </div>
              <div className="h-[120px] flex items-center px-[25px] border-b border-b-[#C0C0C0]">
                Embrace advanced features for engagement and structure
              </div>
              <div className="h-[120px] flex items-center px-[25px] border-b border-b-[#C0C0C0]">
                Group stages, multi-tier brackets, AI scheduling
              </div>
              <div className="h-[120px] flex items-center px-[25px] border-b border-b-[#C0C0C0]">
                AI schedules, updates, and announces everything
              </div>
              <div className="h-[120px] flex items-center px-[25px]">
                Boosts engagement through advanced features
              </div>
            </div>

            <div className="bg-[#F7FFE3] w-[340px] max-w-[350px] rounded-[20px] mx-[10px] text-[20px]">
              <div className="h-[150px] flex flex-col justify-center px-[25px] border-b border-b-[#C0C0C0]">
                <div className={`text-black font-[900] text-[36px]`}>Large Clubs</div>
                <div className="text-[#00C418] font-[700] text-[26px]">200+ Players</div>
              </div>
              <div className="h-[120px] flex items-center px-[25px] border-b border-b-[#C0C0C0]">
                Streamline multiple tournaments and manage a large network
              </div>
              <div className="h-[120px] flex items-center px-[25px] border-b border-b-[#C0C0C0]">
                Real-time match updates, personalized game suggestions
              </div>
              <div className="h-[120px] flex items-center px-[25px] border-b border-b-[#C0C0C0]">
                AI keeps everyone informed, manages multiple tournaments
              </div>
              <div className="h-[120px] flex items-center px-[25px]">
                Keeps everyone connected under one roof
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
