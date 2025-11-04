'use client';

import { FAQList } from '@/app/constants/faqs';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import DownArrow from '../../../public/images/down-arrow.svg';

export default function FAQS() {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div className="w-[100%] p-[8%] flex flex-wrap justify-between bg-[#16171B]">
      <div className="w-[100%] md:w-[40%]">
        <div className={`text-white font-sansation-bold font-[700] text-[52px] leading-[60px]`}>
          Frequently asked questions
        </div>
        <div className="text-white text-[18px] mt-[15px] mb-[30px]">
          Can't find the answer you are looking for?
        </div>
      </div>

      <div className="w-[100%] md:w-[55%]">
        {FAQList.map((item) => {
          const isSelected = selected === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`w-full text-left cursor-pointer border-b border-b-[#424242] py-[25px] bg-transparent outline-none`}
              onClick={() => setSelected(isSelected ? null : item.id)}
            >
              <div className={`text-[22px] text-white flex justify-between`}>
                {item.question}
                <Image
                  className={`transition delay duration-500 ${
                    isSelected ? 'rotate-180' : 'rotate-0'
                  }`}
                  src={DownArrow}
                  alt="down-arrow"
                />
              </div>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={isSelected ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className={`font-sansation-light !text-[16px] text-white mt-[10px] max-w-[500px]`}
              >
                {item.answer}
              </motion.div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
