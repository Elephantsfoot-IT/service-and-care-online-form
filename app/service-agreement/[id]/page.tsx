"use client";
import IncentiveCard from "@/components/service-agreement/incentive-card";
import IncentiveTable from "@/components/service-agreement/incentive-table";
import { ServiceFrequency } from "@/components/service-agreement/service-frequency";
import VibrantIncentiveCard from "@/components/service-agreement/vibrant-incentive-card";
import { Button } from "@/components/ui/button";
import { HexagonIcon, MinusIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

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
      {/* <div className="h-[100vh] w-[500px]  bg-[#fcbd2a]  sticky top-0 left-0 hidden md:flex flex items-center justify-center flex-col gap-1">
      </div> */}
      <div className="w-full h-[200vh] px-6">
        <div className="my-20 max-w-screen-xl w-full mx-auto ">
          <div className="text-4xl font-medium text-[#1e60ad]">Services</div>
          <div className="min-h-[200px] flex flex-col gap-10 my-10">
            <div className="">
              <div className="flex flex-row items-start gap-4">
                <div>
                  <div className="text-lg font-medium ">Chute Cleaning</div>
                  <div className="text-neutral-500">
                    Professional cleaning of waste chutes and disposal systems
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <ServiceFrequency></ServiceFrequency>
              </div>
              <div className="flex flex-col  divide-y divide-neutral-200 mt-4 text-sm">
                <div className="grid grid-cols-6 gap-2  ">
                  <div className=" col-span-3 px-4 py-2 font-medium">Sites</div>
                  <div className=" col-span-1 px-4 py-2 font-medium">
                    No. Chutes
                  </div>
                  <div className=" col-span-1 px-4 py-2 font-medium">Level</div>
                  <div className="font-medium col-span-1 text-right px-4 py-2  font-medium">
                    Price{" "}
                    <span className="font-normal text-neutral-600">
                      (per chute, excl. GST)
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-2  ">
                  <div className=" col-span-3 px-4 py-2">Darlinghurst</div>
                  <div className=" col-span-1 px-4 py-2">1</div>
                  <div className=" col-span-1 px-4 py-2">Up to 10 Levels</div>
                  <div className="font-medium col-span-1 text-right px-4 py-2 ">
                    $650.00
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-2  ">
                  <div className="col-span-3 px-4 py-2 ">Wahroonga</div>
                  <div className=" col-span-1 px-4 py-2">1</div>
                  <div className=" col-span-1 px-4 py-2">Up to 10 Levels</div>
                  <div className="font-medium col-span-1 text-right px-4 py-2 ">
                    $950.00
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-2  ">
                  <div className="col-span-3 px-4 py-2 ">Miranda ACH</div>
                  <div className=" col-span-1 px-4 py-2">1</div>
                  <div className=" col-span-1 px-4 py-2">Up to 10 Levels</div>
                  <div className="font-medium col-span-1 text-right px-4 py-2 ">
                    $690.00
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-2  ">
                  <div className=" col-span-3 px-4 py-2 ">Miranda Mason</div>
                  <div className=" col-span-1 px-4 py-2">1</div>
                  <div className=" col-span-1 px-4 py-2">Up to 10 Levels</div>
                  <div className="font-medium col-span-1 text-right px-4 py-2 ">
                    $690.00
                  </div>
                </div>
              </div>
            </div>
            <div className="">
              <div className="flex flex-row items-start gap-4">
                <div>
                  <div className="text-lg font-medium ">
                    Equipment Maintenance
                  </div>
                  <div className="text-neutral-500">
                    Regular maintenance and servicing of waste management
                    equipment
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <ServiceFrequency></ServiceFrequency>
              </div>
              <div className="flex flex-col  mt-4 text-sm divide-y divide-neutral-200">
                <div className="grid grid-cols-6 gap-2  ">
                  <div className=" col-span-3 px-4 py-2 font-medium">Sites</div>

                  <div className=" col-span-2 px-4 py-2 font-medium">
                    Equipment
                  </div>
                  <div className="font-medium col-span-1 text-right px-4 py-2  font-medium">
                    Price{" "}
                    <span className="font-normal text-neutral-600">
                      (excl. GST)
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-2  ">
                  <div className=" col-span-3 px-4 py-2">Darlinghurst</div>

                  <div className=" col-span-2 px-4 py-2 ">
                    LINEAR W/ COMPACTOR
                  </div>
                  <div className="font-medium col-span-1 text-right px-4 py-2  font-medium">
                    $300.00
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-2  ">
                  <div className=" col-span-3 px-4 py-2">Wahroonga</div>

                  <div className=" col-span-2 px-4 py-2 ">
                    LINEAR W/ COMPACTOR
                  </div>
                  <div className="font-medium col-span-1 text-right px-4 py-2  font-medium">
                    $450.00
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-2  ">
                  <div className=" col-span-3 px-4 py-2">Wahroonga</div>

                  <div className=" col-span-2 px-4 py-2 ">EDIVERTER</div>
                  <div className="font-medium col-span-1 text-right px-4 py-2  font-medium">
                    $450.00
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-2 ">
                  <div className=" col-span-3 px-4 py-2">Wahroonga</div>

                  <div className=" col-span-2 px-4 py-2 ">LINEAR</div>
                  <div className="font-medium col-span-1 text-right px-4 py-2  font-medium">
                    $450.00
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-2  ">
                  <div className=" col-span-3 px-4 py-2">Miranda ACH</div>

                  <div className=" col-span-2 px-4 py-2 ">
                    LINEAR W/ COMPACTOR
                  </div>
                  <div className="font-medium col-span-1 text-right px-4 py-2  font-medium">
                    $300.00
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-2  ">
                  <div className=" col-span-3 px-4 py-2">Miranda ACH</div>

                  <div className=" col-span-2 px-4 py-2 ">EDIVERTER</div>
                  <div className="font-medium col-span-1 text-right px-4 py-2  font-medium">
                    $300.00
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-2  ">
                  <div className=" col-span-3 px-4 py-2">Miranda Mason</div>

                  <div className=" col-span-2 px-4 py-2 ">
                    LINEAR W/ COMPACTOR
                  </div>
                  <div className="font-medium col-span-1 text-right px-4 py-2  font-medium">
                    $300.00
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-2  ">
                  <div className=" col-span-3 px-4 py-2">Miranda Mason</div>

                  <div className=" col-span-2 px-4 py-2 ">EDIVERTER</div>
                  <div className="font-medium col-span-1 text-right px-4 py-2  font-medium">
                    $300.00
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 ">
            <div className="text-4xl font-medium text-[#1e60ad]">
              {`Exclusive Benefits`}
            </div>
            <span className="text-lg text-neutral-600">
              {`Enjoy our exclusive benefits when you choose additional services with us.`}
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
              <IncentiveTable
                currentTier={currentTier}
                serviceCount={serviceCount}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeriveAgreement;
