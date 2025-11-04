'use client';
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const SubscriptionPlanLayout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();

    const handleBack = () => {
        sessionStorage.setItem("profile_active_tab", "subscription");
        router.back();
    };

    return (
        <>
            <nav className="fixed top-12 sm:top-13.5 z-10 w-full bg-[#16171B] border-b border-b-[#444444] px-2">
                <div
                    className="flex items-center gap-2 px-2 sm:px-4 md:px-8 lg:px-16 xl:px-[130px] py-4 cursor-pointer"
                    onClick={handleBack}
                >
                    <ArrowLeft
                        color="white"
                        size={20}
                        className="cursor-pointer sm:w-[22px] sm:h-[22px] md:w-[24px] md:h-[24px]"
                    />
                    <h1 className="text-sm sm:text-[15px] md:text-[16px] lg:text-[14px] text-white font-satoshi-medium">
                        Subscription Plan
                    </h1>
                </div>
            </nav>
            <div>{children}</div>
        </>
    );
};

export default SubscriptionPlanLayout;
