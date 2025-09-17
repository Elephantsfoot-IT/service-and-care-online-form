// ServicesForm.tsx
"use client";
import { useEffect } from "react";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { scrollToTop } from "@/lib/utils";
import { useServiceAgreementStore } from "../../service-agreement-store";

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
    <section id={id} className="flex flex-col gap-6 scroll-mt-[140px] pt-6">
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
    <div className="flex flex-col gap-16">
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
