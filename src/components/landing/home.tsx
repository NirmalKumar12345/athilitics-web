'use client';

import { CarouselImages } from '@/constants/carouselImages';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import HomeBgGradient from '../../../public/images/home-bg-gradient.svg';
import Highlights from '../../../public/images/home-highlights.svg';
import HomeLines from '../../../public/images/home-lines.svg';
import HomeMobileFrame from '../../../public/images/home-mobile-frame.webp';
import Header from '../header';

const SportsIcons = () => (
  <div className="flex space-x-[3vw] lg:space-x-40 absolute left-[2vw]">
    {['pickleBall', 'tennis-ball', 'chess', 'badminton', 'tt'].map((sport) => (
      <div key={sport} className="flex items-center justify-center">
        <Image
          src={`/images/${sport}.svg`}
          alt={`${sport} Icon`}
          width={55}
          height={55}
          className="w-[clamp(35px,4vw,45px)] lg:w-[clamp(45px,5vw,55px)] h-[clamp(35px,4vw,45px)] lg:h-[clamp(45px,5vw,55px)]"
        />
      </div>
    ))}
  </div>
);

export default function Home() {
  const [active, setActive] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const interval = setInterval(() => {
      setActive((prevIndex) => (prevIndex + 1) % CarouselImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="w-full h-screen max-h-screen relative overflow-hidden">
      <div className="px-[5vw] pt-[25px] relative h-full">
        <Header />

        <div className="flex justify-between h-[calc(100vh-120px)] min-h-[500px]">
          <div className="max-w-[100%] md:max-w-[50%] lg:max-w-[45%] mx-auto md:mx-0 mr-[0] md:mr-auto flex flex-col  items-center bottom-auto md:bottom-10 lg:bottom-[100px] md:items-start justify-center relative z-[10] py-4">
            <div
              className="flex items-center text-white font-sansation-bold font-[700] mb-2"
              style={{ fontSize: 'clamp(1.2rem, 4vw, 2.8rem)' }}
            >
              <div 
                className="bg-green text-black rounded-[7px] mr-[0.5vw]"
                style={{ 
                  padding: 'clamp(3px, 0.8vw, 10px) clamp(5px, 1.2vw, 12px)',
                  fontSize: 'clamp(1.2rem, 4vw, 2.8rem)'
                }}
              >
                Ultimate home
              </div>
              for
            </div>
            <div
              className="text-white font-sansation-bold font-[700] mb-3"
              style={{ fontSize: 'clamp(1.2rem, 4vw, 2.8rem)' }}
            >
              athletes, organizers, & clubs
            </div>
            <div 
              className="text-[#C5C3C3] text-center md:text-left max-w-[95%] md:max-w-none"
              style={{ 
                fontSize: 'clamp(0.7rem, 2vw, 1.1rem)',
                lineHeight: 'clamp(1.1, 1.3, 1.5)'
              }}
            >
              Where Competition Meets Community and Every Game Finds Its Spotlight
            </div>
          </div>

          <div className="max-w-[50%] lg:max-w-[45%] h-full mr-[3vw] lg:mr-[2vw] hidden md:flex items-center justify-center relative z-[9999]">
            <div className="absolute w-[min(70vw,600px)] lg:w-[min(70vw,800px)] h-[min(60vh,500px)] lg:h-[min(60vh,600px)] bottom-[8vh] lg:bottom-[3vh] right-[min(80px,35vw)] lg:-right-[min(85px,8vw)] z-[-2] flex justify-end pointer-events-none">
              <div className="relative w-full h-full">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={active}
                    src={CarouselImages[active]}
                    alt={`Tournament carousel image ${active + 1} of ${CarouselImages.length}`}
                    className="absolute top-0 left-0 w-full h-full object-contain"
                    initial={hasMounted ? { rotate: -30, opacity: 0, y: 0, x: 0 } : false}
                    animate={{
                      rotate: 0,
                      opacity: 1,
                      y: -15,
                      x: active === 0 ? 80 : active === 1 ? 140 : active === 2 ? 140 : 0,
                    }}
                    exit={{ rotate: 0, opacity: 0, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    style={{
                      pointerEvents: 'none',
                      objectPosition: 'center center',
                      maxWidth: '100%',
                      maxHeight: '100%',
                    }}
                  />
                </AnimatePresence>
              </div>
            </div>
            <Image
              src={HomeMobileFrame}
              className="w-[100%] h-auto max-h-[75vh] lg:max-h-[84vh] mt-135 left-3 lg:left-4 lg:mt-24 z-10 relative object-contain"
              alt="home-mobile-frame"
            />
          </div>
        </div>
        <div className="w-[calc(100%-8vw)] lg:w-[calc(100%-4vw)] left-[4vw] lg:left-[2vw] absolute bottom-[1vh] lg:bottom-[2vh] mx-auto h-[clamp(70px,8vh,100px)] lg:h-[clamp(80px,10vh,120px)] bg-[#16362B] rounded-b-[24px] z-[9998] hidden md:flex items-center">
          <SportsIcons />
        </div>
      </div>

      <Image
        src={HomeBgGradient}
        className="absolute right-[0px] top-[0px] z-[1]"
        alt="home-bg-gradient"
      />

      <div className="absolute left-[0px] bottom-[1vh] lg:bottom-[12vh] z-[999]">
        <Image 
          src={Highlights} 
          alt="highlights" 
          className="mb-0 md:mb-[100px] lg:mb-[2vh] ml-[4vw] w-auto sm:w-[50px] h-[clamp(40px,8vh,50px)]" 
        />
         <Image src={HomeLines} alt="home-lines" className='mb-4 w-[300px] md:mb-[120px] lg:mb-4 md:w-auto lg:w-[200px] h-[clamp(40px,8vh,px)]' />
      </div>
    </div>
  );
}
