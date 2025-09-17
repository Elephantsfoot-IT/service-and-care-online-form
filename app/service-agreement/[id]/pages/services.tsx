// ServicesForm.tsx
"use client";
import { useEffect } from "react";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { scrollToTop } from "@/lib/utils";
import { useServiceAgreementStore } from "../../service-agreement-store";
import IncentiveTable from "@/components/service-agreement/incentive-table";

function ServicesForm() {
  const state = useServiceAgreementStore();

  useEffect(() => {
    scrollToTop();
  }, []);

  if (!state.serviceAgreement) return null;

  const goNext = () => state.setPage(2);

  const Section: React.FC<{ id: string; title: string; desc: string }> = ({
    id,
    title,
    desc,
  }) => (
    <section id={id} className="flex flex-col gap-6 scroll-mt-[140px] ">
      <div className="flex flex-col ">
        <Label className="text-xl font-medium">{title}</Label>
        <span className="text-base text-neutral-500">{desc}</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-neutral-100 h-[100px] rounded-md " />
        <div className="bg-neutral-100 h-[100px] rounded-md " />
        <div className="bg-neutral-100 h-[100px] rounded-md " />
      </div>
      <div className="bg-neutral-100 h-[500px] w-full rounded-md " />
    </section>
  );

  return (
    <div className="flex flex-col gap-16 ">
      <Section
        id="chute-cleaning"
        title="Chute Cleaning"
        desc="Chute cleaning that removes grime, mould, and odours—keeping multi-storey buildings hygienic and safe."
      />
      <Section
        id="waste-room-pressure-clean"
        title="Waste Room Pressure Clean"
        desc="High-pressure cleaning for hygienic, odour-free waste rooms."
      />
      <Section
        id="hopper-door-inspection"
        title="Self-Closing Hopper Door Inspection"
        desc="Chute-door inspections to ensure fire safety and compliance."
      />
      <Section
        id="bin-cleaning"
        title="Bin Cleaning"
        desc="Thorough bin cleaning to reduce odours, pests, and bacteria."
      />
      <Section
        id="equipment-preventative-maintenance"
        title="Equipment Preventative Maintenance"
        desc="Keep compactors and related equipment safe, compliant, and efficient."
      />
      <Section
        id="odour-control"
        title="Odour Control"
        desc="Targeted odour management to keep shared areas fresh."
      />
      <div>
        <div className="flex flex-col ">
          <Label className="text-xl font-medium">Exclusive Benefits</Label>
          <span className="text-base text-neutral-500">
            Enjoy our exclusive benefits when you choose additional services
            with us.
          </span>
        </div>
        <div className="w-full overflow-x-auto mt-6 flex flex-col gap-4 ">
          <div className="w-full min-w-[820px]">
            <IncentiveTable currentTier={"essential"} serviceCount={4} />
          </div>
        </div>
      </div>

      <div className="w-full flex justify-end mt-16">
        <Button
          variant="efg"
          className="cursor-pointer w-[200px]"
          onClick={goNext}
        >
          Continue <ArrowRightIcon />
        </Button>
      </div>

      {/* Optionally expose activeId to a context/store if FormVerticalProgress renders elsewhere */}
      {/* Or render the progress here and pass activeId as a prop */}
    </div>
  );
}

export default ServicesForm;

// const chuteCleaning = getServices(
//   state.serviceAgreement.sites,
//   "chute_cleaning"
// );
// const wasteRoomPressureClean = getServices(
//   state.serviceAgreement.sites,
//   "waste_room_pressure_clean"
// );
// const selfClosingHooperDoorInspection = getServices(
//   state.serviceAgreement.sites,
//   "hopper_door_inspection"
// );
// const binCleaning = getServices(state.serviceAgreement.sites, "bin_cleaning");
// const equipmentPreventativeMaintenance = getServices(
//   state.serviceAgreement.sites,
//   "equipment_maintenance"
// );
// const odourControl = getServices(
//   state.serviceAgreement.sites,
//   "odour_control"
// );
