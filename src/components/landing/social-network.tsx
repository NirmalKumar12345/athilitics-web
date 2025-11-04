'use client';
import { SocialNetworksList } from '@/app/constants/social-networks';
import Image from 'next/image';
import { useState } from 'react';

export default function SocialNetworks() {
  const [active, setActive] = useState(0);
  const selectedItem = SocialNetworksList[active];
  return (
    <div className="w-[calc(100vw-15vw)] m-auto mt-[20vh]">
      <div className="flex justify-center items-center">
        <Image
          src="/images/football.svg"
          alt="football"
          width={80}
          height={80}
          className="w-[70px] md:w-[80px] lg:w-auto"
        />
        <div className="mx-[5vw]">
          <div
            className={`flex items-center justify-center text-white font-sansation-bold font-[700] text-[4.2vw] sm:text-[4vw] md:text-[3.7vw] text-center`}
          >
            Social Network &
            <div className="bg-green text-black px-[10px] rounded-[7px] ml-[10px]">Community</div>
          </div>

          <div
            className={`text-white font-sansation-bold font-[700] text-[4.2vw] sm:text-[4vw] md:text-[3.7vw] text-center -mt-[10px]`}
          >
            at Its Core
          </div>
        </div>
        <Image
          src="/images/football.svg"
          alt="football"
          width={80}
          height={80}
          className="w-[70px] md:w-[80px] lg:w-auto"
        />
      </div>

      <div className="m-auto flex flex-col-reverse md:flex-row flex-wrap items-center justify-center mt-[40px]">
        {selectedItem?.image && (
          <Image
            src={selectedItem.image}
            alt="player-profile"
            width={380}
            height={380}
            className="w-[100%] md:w-[280px] lg:w-[380px] xl:w-[500px] my-[50px]"
          />
        )}
        <div className="w-[100%] md:w-[350px] lg:w-[380px] md:ml-[20px] lg:ml-[100px]">
          {SocialNetworksList.map((item, index) => {
            return (
              <div
                key={item.key}
                className={`cursor-pointer mb-[15px] ${
                  active === index ? 'opacity-[1]' : 'opacity-[0.3]'
                }`}
                onClick={() => setActive(index)}
              >
                <div className="text-green text-[24px] mb-[3px]">{item.label}</div>
                <div className="text-white text-[18px] leading-[22.6px]">{item.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
