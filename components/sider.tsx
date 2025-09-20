// components/Sider.tsx
"use client";

import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { GlobeIcon, MailIcon, PhoneIcon } from "lucide-react";
import BrandCornerShape from "./brand-animation";
import FormVerticalProgress from "./service-agreement/form-vertical-progress";
import ServiceVerticalProgress from "./service-agreement/service-vertical-progress";

export default function Sider({
  activeId,
  onJump,
}: {
  activeId: string;
  onJump: (id: string) => void;
}) {
  const state = useServiceAgreementStore();
  return (
    <aside className="hidden xl:flex fixed left-0 top-0 z-[99] w-[400px] h-screen ">
      <div className="flex flex-col h-full w-full   p-10 relative rounded-lg overflow-hidden ">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo/Elephants FootService Care Dark.svg"
          alt="EFG Service and Care"
          className="w-[150px] h-auto"
        />
        {state.page === 1 && (
          <div className="mt-20 z-10">
            <ServiceVerticalProgress activeId={activeId} onJump={onJump} />
          </div>
        )}

        {state.page >= 2 && (
          <div className="mt-20 z-10">
            <FormVerticalProgress />
          </div>
        )}

        {/* Pin to bottom-right like your sider */}
        {/* <BrandCornerShape
          className="absolute bottom-0 -right-2 text-efg-yellow"
          height={375}
          durationMs={1400}
          loop={false}
          fillAngleDeg={60}
        /> */}

        <div className="flex flex-col gap-2 mt-auto z-10">
          {/* <div className="text-xs text-neutral-500 font-semibold mb-1">
            Support
          </div> */}
          <div className="text-xs text-neutral-500 hover:text-neutral-800 transition-all duration-200 flex items-center gap-2">
            <PhoneIcon className="w-3.5 h-3.5"></PhoneIcon>
            <a href="tel:1300435374">1300 435 374</a>
          </div>
          <div className="text-xs text-neutral-500 hover:text-neutral-800 transition-all duration-200 flex items-center gap-2">
            <MailIcon className="w-3.5 h-3.5"></MailIcon>{" "}
            <a href="mailto:service@elephantsfoot.com.au">
              service@elephantsfoot.com.au
            </a>
          </div>
          <div className="text-xs text-neutral-500 hover:text-neutral-800 transition-all duration-200 flex items-center gap-2">
            <GlobeIcon className="w-3.5 h-3.5"></GlobeIcon>{" "}
            <a href="https://www.elephantsfoot.com.au" target="_blank">
              elephantsfoot.com.au
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
