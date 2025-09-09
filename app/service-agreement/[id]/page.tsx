"use client";
import IncentiveCard from "@/components/service-agreement/incentive-card";
import IncentiveTable from "@/components/service-agreement/incentive-table";
import VibrantIncentiveCard from "@/components/service-agreement/vibrant-incentive-card";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { useEffect } from "react";

function SeriveAgreement() {
  const [serviceCount, setServiceCount] = useState<number>(0);
  const [currentTier, setCurrentTier] = useState<string>("");

  useEffect(() => {
    if (serviceCount <= 2) {
      setCurrentTier("");
    } else if (serviceCount >= 3 && serviceCount < 4) {
      setCurrentTier("basic");
    } else if (serviceCount >= 4 && serviceCount < 6) {
      setCurrentTier("essential");
    } else if (serviceCount >= 6) {
      setCurrentTier("pro");
    } else {
      setCurrentTier("");
    }
  }, [serviceCount]);

  const addService = () => {
    setServiceCount(serviceCount + 1);
  };

  const removeService = () => {
    if (serviceCount <= 0) return;
    setServiceCount(serviceCount - 1);
  };

  return (
    <div className="flex flex-row ">
      {/* <div className="min-h-screen w-[500px] bg-[#fcbd2a] sticky top-0 left-0 hidden md:flex"></div> */}
      <div className="w-full h-[200vh] px-6">
        <div className="my-20 max-w-screen-xl w-full mx-auto ">
          <div className="min-h-[200px]">
            <div className="text-4xl font-medium text-[#1e60ad]">Services</div>
          </div>
          <div className="flex flex-col gap-2 ">
            <div className="text-4xl font-medium text-[#1e60ad]">
              Because You’ve Chosen Us
            </div>
            <span className="text-bsase text-neutral-600">
              <span className="text-neutral-800 underline">Unlock</span> more
              perks with us when you{" "}
              <span className="text-neutral-800 underline">
                commit to additional services
              </span>{" "}
              — each step up gives you access to added advantages.
            </span>
          </div>

          <div className="flex items-center gap-1 my-6">
            <Button onClick={removeService} className="w-10 h-10">
              <MinusIcon></MinusIcon>
            </Button>
            <Button variant="outline" className="w-10 h-10">
              {serviceCount}
            </Button>
            <Button onClick={addService} className="w-10 h-10">
              <PlusIcon></PlusIcon>
            </Button>
          </div>
          <div className="w-full overflow-x-auto mt-4">
            <div className="w-full min-w-[820px]">
              <IncentiveTable currentTier={currentTier} />
            </div>
          </div>

          <div className="flex items-center gap-1 my-6">
            <Button onClick={removeService} className="w-10 h-10">
              <MinusIcon></MinusIcon>
            </Button>
            <Button variant="outline" className="w-10 h-10">
              {serviceCount}
            </Button>
            <Button onClick={addService} className="w-10 h-10">
              <PlusIcon></PlusIcon>
            </Button>
          </div>

          <div className="w-full mt-4 -mx-4 px-4 overflow-x-auto overflow-y-visible">
            <div className="min-w-md flex flex-row gap-6 ">
              <IncentiveCard currentTier={currentTier} />
            </div>
          </div>


          <div className="flex items-center gap-1 my-6">
            <Button onClick={removeService} className="w-10 h-10">
              <MinusIcon></MinusIcon>
            </Button>
            <Button variant="outline" className="w-10 h-10">
              {serviceCount}
            </Button>
            <Button onClick={addService} className="w-10 h-10">
              <PlusIcon></PlusIcon>
            </Button>
          </div>

          <div className="w-full mt-4 -mx-4 px-4 overflow-x-auto overflow-y-visible">
            <div className="min-w-md flex flex-row gap-6 ">
              <VibrantIncentiveCard currentTier={currentTier} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeriveAgreement;
