import AccountPopupCard from '@/components/accountPopup';
import BillingHistory from '@/components/billingHistory';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useOrganizer } from '@/hooks/useOrganizer';
import { useRazorPay } from '@/hooks/useRazorPay';
import { getBankName } from '@/utils/bankUtils';
import { Label } from '@radix-ui/react-label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function Subscription() {
  const { organizer } = useOrganizer(false);
  const router = useRouter();
  const tierStatus = organizer?.tier_status || 'Free Tier';
  const isProTier = tierStatus === 'Pro Tier';
  const isProPlusTier = tierStatus === 'Pro Plus Tier';
  const canCancelSubscription = isProTier || isProPlusTier;

  const { getLinkedAccountDetails } = useRazorPay();
  const [bankAccount, setBankAccount] = useState<null | {
    name: string;
    ifsc: string;
    account_number: string;
  }>(null);
  const [bankLoading, setBankLoading] = useState(true);

  // Popup state for AccountPopupCard
  const [showAccountPopup, setShowAccountPopup] = useState(false);

  useEffect(() => {
    (async () => {
      setBankLoading(true);
      const response = await getLinkedAccountDetails();
      if (response?.data?.bank_account) {
        setBankAccount(response.data.bank_account);
      } else {
        setBankAccount(null);
      }
      setBankLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancelSubscription = () => {
    if (!canCancelSubscription) {
      toast.error('Subscription cancellation is only available for active subscribers');
      return;
    }
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowAccountPopup(true);
  };

  const handleCloseAccountPopup = () => {
    setShowAccountPopup(false);
    router.push('/dashboard/profile/subscriptionPlan/accountInfo');
  };

  return (
    <Fragment>
      <div className="px-4 sm:px-6 lg:px-[30px] py-4 sm:py-5 lg:py-[25px] bg-[#121212] rounded-lg border border-[#282A28] sm:w-full md:w-full lg:w-[935px] min-h-[474px] text-white flex flex-col gap-6">
        <span className="text-[18px] sm:text-[22px] font-satoshi-bold mb-2">Subscription</span>
        {/* Current Plan */}
        <div className="flex flex-col gap-[6px]">
          <Label className="font-satoshi-regular text-[14px] text-white">Current Plan</Label>
          <Card className="bg-black rounded-[8px] py-[16px]">
            <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 px-[12px]">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={
                      tierStatus === 'Free Tier'
                        ? 'bg-[#FB7185] w-[79px] h-[27px] flex justify-center items-center text-black rounded-[8px] font-satoshi-medium text-base mr-2'
                        : tierStatus === 'Pro Tier'
                          ? 'bg-[#F4C01E] w-[79px] h-[27px] flex justify-center items-center text-black rounded-[8px] font-satoshi-medium text-base mr-2'
                          : 'bg-[#4EF162] w-[110px] h-[27px] flex justify-center items-center text-black rounded-[8px] font-satoshi-medium text-base mr-2'
                    }
                  >
                    {tierStatus === 'Free Tier'
                      ? 'Free Tier'
                      : tierStatus === 'Pro Tier'
                        ? 'Pro Tier'
                        : 'Pro Plus Tier'}
                  </span>
                  <span className="font-satoshi-medium text-base text-white">
                    {tierStatus === 'Free Tier'
                      ? '₹0/year'
                      : tierStatus === 'Pro Tier'
                        ? '₹2,999/year'
                        : '₹4,999/year'}
                  </span>
                </div>
                <div className="mt-2 font-satoshi-medium text-sm text-white">Billed Annually</div>
                <div className="text-sm font-satoshi-regular mt-1 text-white">Next Payment: -</div>
              </div>
              <Link
                href="/dashboard/profile/subscriptionPlan/pricingPlan"
                className="text-[#3DFE6B] bg-none border-none font-satoshi-medium text-base cursor-pointer"
              >
                Change Plan
              </Link>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-[6px] mt-2">
          <span className="text-[18px] sm:text-[22px] font-satoshi-bold mb-6">Bank details</span>
          <Label className="font-satoshi-regular text-[14px] text-white">Account details</Label>
          <Card className="bg-black rounded-[8px] py-[16px]">
            <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 px-[12px]">
              {bankLoading ? (
                <div className="flex flex-col gap-2 w-full">
                  <div className="h-5 w-1/2 bg-gray-700 rounded animate-pulse" />
                  <div className="h-5 w-1/3 bg-gray-700 rounded animate-pulse" />
                  <div className="h-5 w-1/4 bg-gray-700 rounded animate-pulse" />
                  <div className="h-5 w-1/3 bg-gray-700 rounded animate-pulse" />
                </div>
              ) : bankAccount ? (
                <div className="flex flex-col gap-2 text-white text-base font-satoshi-regular">
                  <div>
                    <span>Bank</span>
                    <span className="ml-2">: {getBankName(bankAccount.ifsc)}</span>
                  </div>
                  <div>
                    <span>Account Holder</span>
                    <span className="ml-2">: {bankAccount.name}</span>
                  </div>
                  <div>
                    <span>Account Number</span>
                    <span className="ml-2">: **{bankAccount.account_number.slice(-4)}</span>
                  </div>
                  <div>
                    <span>IFSC Code</span>
                    <span className="ml-2">: {bankAccount.ifsc}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="bg-[#FB7185] w-auto h-[27px] px-[8px] flex justify-center items-center text-black rounded-[8px] font-satoshi-medium text-base">No bank account found</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                {!bankAccount && (
                <Link
                  href="/dashboard/profile/subscriptionPlan/accountInfo"
                  className="text-[#3DFE6B] font-satoshi-medium text-base cursor-pointer"
                  onClick={handleAddClick}
                >Add |</Link>
                )}
                <Link href="/dashboard/profile/subscriptionPlan/accountInfo" className="text-[#3DFE6B] font-satoshi-medium text-base cursor-pointer">Modify Account details</Link>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Billing Information */}
        <div className="flex flex-col gap-[6px] mt-2">
          <Label className="font-satoshi-regular text-[14px] text-white">Billing Information</Label>
          <Card className="bg-black rounded-[8px] py-[16px]">
            <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 px-[12px]">
              <div>
                <div className="font-satoshi-medium text-base text-white">
                  {organizer?.organization_name}
                </div>
                <div className="font-satoshi-regular text-[14px] text-white">
                  {organizer?.organization_email}
                </div>
              </div>
              <BillingHistory />
            </CardContent>
          </Card>
        </div>
        {/* Danger Zone */}
        <div className="mt-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Card
                className={`bg-black border border-[#FA230C] rounded-[8px] py-[16px] ${!canCancelSubscription ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 px-[12px]">
                  <div>
                    <div className="text-white font-satoshi-medium text-base">Danger Zone</div>
                    <div className="text-sm font-satoshi-regular text-[white]">
                      Manage Subscription Cancellations
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`text-[#FA230C] bg-none border-none font-satoshi-medium text-base
                      ${canCancelSubscription ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                    onClick={handleCancelSubscription}
                    disabled={!canCancelSubscription}
                  >
                    Cancel Subscription
                  </button>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {!canCancelSubscription
                  ? 'Subscription cancellation is only available for active subscribers (Pro Tier and above)'
                  : 'Cancel your current subscription plan'}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      {/* AccountPopupCard Modal */}
      {showAccountPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-[#000000B2] z-50"
          style={{ backdropFilter: 'blur(4px)' }}
        >
          <AccountPopupCard onClose={handleCloseAccountPopup} />
        </div>
      )}
    </Fragment>
  );
}
