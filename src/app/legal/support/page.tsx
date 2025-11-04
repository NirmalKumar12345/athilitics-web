"use client";
import FAQS from "@/components/landing/faq";
import Image from "next/image";
import Link from "next/link";
import AthliticsLogo from "../../../../public/images/athliticsLogo.svg";

export default function SupportPage() {
    return (
        <div className="w-full mx-auto py-8 text-white bg-[#16171B]">
            <div className="flex flex-col items-center justify-center">
                <div className="w-full flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center mb-4">
                        <Image src={AthliticsLogo} alt="Athlitics Logo" width={80} height={80} />
                    </div>
                    <h1 className="text-3xl font-bold mb-6 text-center">Athlitics Support</h1>
                    <div className="mb-6 text-center">
                        <p className="mb-2">Welcome to Athlitics Support 👋</p>
                        <p className="mb-2">If you need any help with using the Athlitics app, you’re in the right place.</p>
                    </div>
                    <div className="mb-6 w-full max-w-xl text-center">
                        <h2 className="text-xl font-semibold mb-2">📖 FAQs</h2>
                        <ul className="list-disc list-inside mb-2">
                            <li>How do I create an account?</li>
                            <li>How do I join or create a tournament?</li>
                            <li>How do rankings and stats update?</li>
                            <li>How do I report an issue with match scheduling or results?</li>
                        </ul>
                        <Link href="#faq" className="text-[#4EF162] underline">👉 View Full FAQ</Link>
                    </div>
                    <div className="mb-6 w-full max-w-xl text-center">
                        <h2 className="text-xl font-semibold mb-2">📩 Contact Us</h2>
                        <p>If you couldn’t find the answer in the FAQs, feel free to reach out:</p>
                        <ul className="list-disc list-inside mb-2">
                            <li>Email: <Link href="mailto:support@athlitics.app" className="underline text-[#4EF162]">support@athlitics.app</Link></li>
                            <li>Feedback Form: <Link href="https://athlitics.app/support" target="_blank" className="underline text-[#4EF162]">Submit a Request</Link></li>
                        </ul>
                    </div>
                    <div className="mb-6 w-full max-w-xl text-center">
                        <h2 className="text-xl font-semibold mb-2">⚡ Common Issues</h2>
                        <ul className="list-disc list-inside mb-2">
                            <li>Trouble logging in? Try resetting your password.</li>
                            <li>Not receiving notifications? Ensure app permissions are enabled.</li>
                            <li>Incorrect match data? Contact us with match details.</li>
                        </ul>
                        <p>We aim to respond within 24–48 hours.</p>
                    </div>
                </div>
                <div id="faq" className="mt-10 w-full">
                    <FAQS />
                </div>
            </div>
        </div>
    );
}
