import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function TournamentInfoSkeleton() {
  return (
    <div className="w-full max-w-[796px] rounded-[8px] px-[16px] sm:px-[20px] py-[20px] sm:py-[25px] bg-[#282A28]">
      <Card className="rounded-[8px] bg-black h-full min-h-[300px] sm:min-h-[389px] animate-pulse">
        <CardHeader className="pb-0 flex flex-col items-start">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 w-full">
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="bg-gray-700 rounded-full w-[120px] h-[120px] sm:w-[138px] sm:h-[138px]" />
              <div className="h-6 w-24 bg-gray-700 rounded mt-4" />
            </div>
            <div className="flex flex-col justify-start pt-0 sm:pt-8 text-center sm:text-left flex-1">
              <div className="h-6 sm:h-8 w-48 bg-gray-700 rounded mb-4" />
              <div className="flex gap-2 justify-center sm:justify-start">
                <div className="h-6 w-20 bg-gray-700 rounded" />
                <div className="h-6 w-20 bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-[10px] pt-4 sm:pt-0">
          <div className="h-6 w-32 bg-gray-700 rounded mb-2" />
          <div className="h-20 w-full bg-gray-700 rounded" />
        </CardContent>
      </Card>
    </div>
  );
}
