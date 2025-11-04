'use client';
import { AdvancedFormats, BasicFormats } from '@/app/constants/generator';
import Image from 'next/image';
import { useState } from 'react';
import VolleyBall from '../../../public/images/volleyball.svg';

export default function Generator() {
  const [format, setFormat] = useState('basic');
  return (
    <div className="w-[100%] min-h-[100vh] generator-bg">
      <div className="w-[100%] bg-[rgba(0,0,0,0.4)] m-auto rounded-[24px] py-[17vh] px-[6vw]">
        <div className="flex justify-center items-center">
          <Image src={VolleyBall} alt="volleyball" className="w-[70px] md:w-[80px] lg:w-auto" />
          <div className="mx-[5vw] flex items-center">
            <div
              className={`flex items-center justify-center text-white font-sansation-bold font-[700] text-[4.2vw] sm:text-[4vw] md:text-[3.7vw] text-center`}
            >
              Tournament
            </div>

            <div
              className={`w-[fit-content] font-sansation-bold font-[700] text-[4.2vw] sm:text-[4vw] md:text-[3.7vw] text-center bg-green text-black px-[10px] rounded-[7px] ml-[20px]`}
            >
              Bracket Generator
            </div>
          </div>
          <Image src={VolleyBall} alt="volleyball" className="w-[70px] md:w-[80px] lg:w-auto" />
        </div>

        <div className="h-[50px] mt-[10vh] w-[max-content] mx-auto bg-black flex justify-center items-center rounded-[17px]">
          <div
            onClick={() => setFormat('basic')}
            className={`cursor-pointer px-[20px] sm:px-[40px] h-[50px] text-[16px] sm:text-[20px] font-[700] rounded-[17px] flex items-center ${
              format === 'basic' ? 'bg-green text-black' : 'bg-black text-white'
            }`}
          >
            Basic Formats
          </div>
          <div
            onClick={() => setFormat('advance')}
            className={`cursor-pointer px-[20px] sm:px-[40px] h-[50px] text-[16px] sm:text-[20px] font-[700] rounded-[17px] flex items-center ${
              format === 'advance' ? 'bg-green text-black' : 'bg-black text-white'
            }`}
          >
            Advanced Formats
          </div>
        </div>

        <div className="flex flex-wrap justify-center mt-[5vh]">
          {(format === 'basic' ? BasicFormats : AdvancedFormats).map((item) => {
            return (
              <div
                key={item.id}
                className="w-[380px] xl:w-[350px] bg-black rounded-[15px] mx-[10px] my-[10px] p-[20px] cursor-pointer"
              >
                <div className="text-[24px] font-[700] text-green mb-[12px]">{item.label}</div>
                <div className="text-[18px] font-[700] text-[#989B99]">{item.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
