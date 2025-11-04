import { Label } from '@radix-ui/react-label';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';

type DownloadPopUpCardProps = {
  onCancel: () => void;
  onDownload: () => void;
};

export default function DownloadPopUpCard({ onCancel, onDownload }: DownloadPopUpCardProps) {
  return (
    <Card className="w-full max-w-[702px] sm:w-[400px] md:w-[600px] lg:w-[702px] bg-[#16171B] border border-[#3C3B3B] rounded-[8px] flex flex-col justify-between">
      <div className="flex flex-col justify-between h-full p-3 sm:p-4 md:p-6 gap-4 sm:gap-6">
        <CardHeader>
          <CardTitle className="text-white font-satoshi-bold text-[15px] sm:text-[16px]">
            Download Player Data
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:gap-[20px]">
          <div>
            <Label className="text-white font-satoshi-regular text-[13px] sm:text-[14px] mb-2 block">
              No of Group
            </Label>
            <Input
              type="number"
              placeholder="Enter Number"
              className="bg-black text-white border border-[#3C3B3B] rounded-[8px] h-[44px] sm:h-[50px] md:h-[56px] text-[16px] sm:text-[18px] px-3 sm:px-4"
            />
          </div>
          <div>
            <Label className="text-white font-satoshi-regular text-[13px] sm:text-[14px] mb-2 block">
              No of Player in Group
            </Label>
            <Input
              type="number"
              placeholder="Enter Number"
              className="bg-black text-white border border-[#3C3B3B] rounded-[8px] h-[44px] sm:h-[50px] md:h-[56px] text-[16px] sm:text-[18px] px-3 sm:px-4"
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-[20px] w-full">
            <Button
              className="px-4 sm:px-6 py-2 bg-[#16171B] cursor-pointer rounded-md border border-[#4EF162] text-[#43FF7B] hover:bg-[#232323] font-satoshi-bold text-[13px] sm:text-[14px] w-full sm:w-[74px] h-[38px] sm:h-[40px]"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              className="px-4 sm:px-6 py-2 rounded-md bg-[#43FF7B] cursor-pointer text-black hover:bg-[#36cc62] font-satoshi-bold text-[13px] sm:text-[14px] w-full sm:w-[94px] h-[38px] sm:h-[40px]"
              onClick={onDownload}
            >
              Download
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
