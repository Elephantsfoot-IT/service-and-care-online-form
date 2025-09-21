"use client";

/* ------------------------------ Imports ------------------------------ */
import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import Header from "@/components/header";
import ScrollButton from "@/components/service-agreement/scroll-button";
import { useScrollSpy } from "@/components/service-agreement/scroll-spy";
import ServiceAgreementProgress from "@/components/service-agreement/service-agreement-progress";
import Sider from "@/components/sider";
import { useServiceAgreement } from "@/lib/api";
import { SECTION_IDS, ServiceAgreement } from "@/lib/interface";
import { fastScrollToEl, scrollToTop } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";
import { notFound, useParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import ConfirmInfo from "@/components/service-agreement/pages/confirm-info";
import ServicesForm from "@/components/service-agreement/pages/services";
import CompanyInfo from "@/components/service-agreement/pages/company-info";

/* ------------------------------ Component ------------------------------ */
function ServiceAgreementComponent({ id }: { id: string }) {
  /* Store / Query */
  const state = useServiceAgreementStore();
  const setServiceAgreement = useServiceAgreementStore(
    (s) => s.setServiceAgreement
  );
  const { data, isLoading, error, refetch } = useServiceAgreement(id);

  /* Refs / Local State */
  const [manualActive, setManualActive] = useState<string | null>(null);
  const clearTimerRef = useRef<number | null>(null);

  const [fadeInStates, setFadeInStates] = useState({
    fadeIn1: false,
    fadeIn2: false,
    fadeIn3: false,
  });

  /* Derived */
  // Disable scroll spy while we're doing a programmatic scroll
  const spiedId = useScrollSpy(SECTION_IDS as unknown as string[], {
    offset: 120,
    disabled: !!manualActive,
  });
  const activeId = manualActive ?? spiedId;

  /* Callbacks */
  const onJump = (sectionId: string) => {
    setManualActive(sectionId); // set active immediately (for instant highlight)

    const el = document.getElementById(sectionId);
    if (!el) return;

    fastScrollToEl(el as HTMLElement, { offset: 100, duration: 220 }); // fast
    // after scroll finishes, release manual lock so scroll-spy resumes control
    if (clearTimerRef.current) window.clearTimeout(clearTimerRef.current);
    clearTimerRef.current = window.setTimeout(() => {
      setManualActive(null);
    }, 250); // a bit longer than duration
  };

  const selectMore = () => {
    if (state.chuteCleaningFrequency === null) {
      onJump("chute_cleaning");
      return;
    }
    if (state.equipmentMaintenanceFrequency === null) {
      onJump("equipment_maintenance");
      return;
    }
    if (state.selfClosingHopperDoorInspectionFrequency === null) {
      onJump("hopper_door_inspection");
      return;
    }
    if (state.wasteRoomCleaningFrequency === null) {
      onJump("waste_room_pressure_clean");
      return;
    }

    if (state.binCleaningFrequency === null) {
      onJump("bin_cleaning");
      return;
    }

    if (state.odourControlFrequency === null) {
      onJump("odour_control");
      return;
    }
  };

  /* Effects */
  useEffect(
    () => () => {
      if (clearTimerRef.current) window.clearTimeout(clearTimerRef.current);
    },
    []
  );

  useEffect(() => {
    if (data) setServiceAgreement(data as ServiceAgreement);
    // optional: clear when unmounting/leaving the page
    return () => setServiceAgreement(null);
  }, [data, setServiceAgreement]);

  useEffect(() => {
    setFadeInStates({
      fadeIn1: state.page === 1,
      fadeIn2: state.page === 2,
      fadeIn3: state.page === 3,
    });
  }, [state.page]);

  useEffect(() => {
    const next = state.page ?? 0;
    const cur = state.progress ?? 0;

    if (next > cur) {
      state.setProgress(next);
    }
    scrollToTop();
  }, [state.page, state.progress]);

  /* Early Returns */
  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Loader2Icon className="size-20 animate-spin text-efg-yellow" />
      </div>
    );
  }
  if (error) {
    return notFound(); // triggers the matching not-found.tsx
  }

  /* Render */
  return (
    <>
      <Header />
      {activeId && <Sider activeId={activeId} onJump={onJump} />}
      <div className="pt-10 xl:pt-40 xl:pl-[400px] pb-40 relative">
        <ScrollButton />

        <div className="px-4 xl:px-20 text-neutral-800 bg-transparent">
          <div className="w-full flex flex-col items-center font-sans flex-grow gap-8 max-w-screen-lg mx-auto">
            {<ServiceAgreementProgress></ServiceAgreementProgress>}

            {state.page === 1 && (
              <div
                className={`${
                  fadeInStates.fadeIn1 ? "fade-in" : "opacity-0"
                } w-full flex flex-col`}
              >
                <ServicesForm selectMore={selectMore} />
              </div>
            )}

            {state.page === 2 && (
              <div
                className={`${
                  fadeInStates.fadeIn2 ? "fade-in" : "opacity-0"
                } w-full flex flex-col`}
              >
                <CompanyInfo />
              </div>
            )}

            {state.page === 3 && (
              <div
                className={`${
                  fadeInStates.fadeIn3 ? "fade-in" : "opacity-0"
                } w-full flex flex-col`}
              >
                <ConfirmInfo />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------ Page Wrapper ------------------------------ */
export default function ServiceAgreementPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center">
          <Loader2Icon className="size-20 animate-spin text-efg-yellow" />
        </div>
      }
    >
      <ServiceAgreementComponent id={id} />
    </Suspense>
  );
}
