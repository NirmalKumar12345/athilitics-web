import React from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';

interface AccountPopupCardProps {
  onClose: () => void;
}

const AccountPopupCard: React.FC<AccountPopupCardProps> = ({ onClose }) => {
  return (
    <div className="w-full max-w-[531px] mx-auto px-4 sm:px-6 md:px-0">
      <div className="h-[180px] sm:h-[200px] md:h-[226px] bg-[#F4C01E] rounded-tl-[10px] rounded-tr-[10px] relative flex flex-col items-center justify-center p-4 sm:p-6 md:p-0">
        <div className="absolute top-[12px] right-[12px] sm:top-[20px] sm:right-[20px] md:top-[25px] md:right-[25px]">
          <Button
            className="bg-black rounded-full flex items-center justify-center cursor-pointer w-7 h-7 sm:w-8 sm:h-8"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-[12px] h-[12px] sm:w-[14px] sm:h-[14px] md:w-[16px] md:h-[16px] cursor-pointer" fill="black" color="white" />
          </Button>
        </div>
        <img src="/images/bank.svg" alt="Success" className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] md:w-[95px] md:h-[94.12px] mb-3 sm:mb-4" />
        <span className="text-[#1C2833] font-satoshi-bold text-[18px] sm:text-[22px] md:text-[26px] text-center">
         Link your bank account
        </span>
      </div>

      <div className="bg-[#16171B] h-[90px] sm:h-[100px] md:h-[108px] rounded-bl-[10px] rounded-br-[10px]">
        <div className="flex flex-col items-center justify-center space-y-1 sm:space-y-2 py-[16px] sm:py-[20px] md:py-[23px] px-2 sm:px-4 md:px-0">
          <span className="text-white font-tt-norms-pro-medium text-[13px] sm:text-[15px] md:text-[16px] text-center">
            We need your bank details send your money.
          </span>
          <span className="text-white font-tt-norms-pro font-[400] text-[12px] sm:text-[13px] md:text-[14px] text-center">
            just one more step still before publish your first tournament.
          </span>
        </div>
      </div>
    </div>
  );
};

export default AccountPopupCard;
