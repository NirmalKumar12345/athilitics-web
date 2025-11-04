'use client';
import { GraphAIList } from '@/app/constants/graph-ai';
import Image from 'next/image';
import { useState } from 'react';
import CricketBall from '../../../public/images/cricket-ball.svg';
import Highlight from '../../../public/images/highlight.svg';

export default function GraphAI() {
  const [active, setActive] = useState('seamless-data-exploration');
  const selectedItem = GraphAIList.find((item) => item.key === active);
  return (
    <div className="w-full bg-[#0F0F0F]">
      <div className="w-[calc(100%-60px)] m-auto bg-[#F7FFE3] rounded-[24px] py-[7vh] px-[5vw]">
        <div className="flex justify-center items-center">
          <Image src={CricketBall} alt="cricket ball" className="w-[70px] md:w-[80px] lg:w-auto" />
          <div className="mx-[5vw] flex flex-col items-center">
            <div
              className={`flex items-center justify-center text-black font-sansation-bold font-[700] text-[4.2vw] sm:text-[4vw] md:text-[3.7vw] text-center`}
            >
              Hyper Futuristic Graph + AI
              <div className="ml-[20px]">
                <Image src={Highlight} alt="highlight" />
              </div>
            </div>

            <div
              className={`w-[fit-content] font-sansation-bold font-[700] text-[4.2vw] sm:text-[4vw] md:text-[3.7vw] text-center bg-green text-black px-[10px] rounded-[7px]`}
            >
              Unmatched Power
            </div>
          </div>
          <Image src={CricketBall} alt="cricket ball" className="w-[70px] md:w-[80px] lg:w-auto" />
        </div>

        <div className="m-auto flex flex-col-reverse md:flex-row flex-wrap items-center justify-center mt-[40px]">
          <Image
            src={selectedItem?.image || CricketBall}
            alt="player-profile"
            className="w-[100%] lg:w-[380px] md:w-[450px] xl:w-[500px] my-[50px]"
            width={500}
            height={500}
          />

          <div className="w-[100%] md:w-[350px] lg:w-[380px] md:ml-[50px] lg:ml-[100px]">
            {GraphAIList.map((item) => {
              return (
                <div
                  key={item.key}
                  className={`cursor-pointer mb-[15px] ${
                    active === item.key ? 'opacity-[1]' : 'opacity-[0.3]'
                  }`}
                  onClick={() => setActive(item.key)}
                >
                  <div
                    className={`text-[24px] mb-[3px] text-[#00C418] ${
                      active === item.key ? 'font-[700]' : 'font-[400]'
                    }`}
                  >
                    {item.label}
                  </div>
                  <div
                    className={`text-black text-[18px] leading-[22.6px] ${
                      active === item.key ? 'font-[700]' : 'font-[400]'
                    }`}
                  >
                    {item.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
