"use client";

/* ------------------------------ Imports ------------------------------ */
import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import GlobalOverlay from "@/components/global-loader";
import Header from "@/components/header";
import CompanyInfo from "@/components/service-agreement/pages/company-info";
import ConfirmInfo from "@/components/service-agreement/pages/confirm-info";
import ServicesForm from "@/components/service-agreement/pages/services";
import ScrollButton from "@/components/service-agreement/scroll-button";
import { useScrollSpy } from "@/components/service-agreement/scroll-spy";
import ServiceAgreementProgress from "@/components/service-agreement/service-agreement-progress";
import Sider from "@/components/sider";
import { useServiceAgreement } from "@/lib/api";
import { SECTION_IDS, ServiceAgreement } from "@/lib/interface";
import { fastScrollToEl, getNumber, scrollToTop } from "@/lib/utils";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

const openForm = async (id: string) => {
  const response = await fetch("/api/service-agreements/open-form", {
    method: "PUT",
    body: JSON.stringify({ id }),
  });
  if (!response.ok) {
    throw new Error("Failed to update service agreement status");
  }
  return response.json();
};

/* ------------------------------ Component ------------------------------ */
function ServiceAgreementComponent({
  id,
  isPreview,
}: {
  id: string;
  isPreview: boolean;
}) {
  /* Store / Query */
  const state = useServiceAgreementStore();
  const router = useRouter();
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
    offset: 170,
    disabled: !!manualActive,
  });

  const activeId = manualActive ?? spiedId;

  /* Callbacks */
  const onJump = (sectionId: string) => {
    setManualActive(sectionId); // set active immediately (for instant highlight)

    const el = document.getElementById(sectionId);
    if (!el) return;

    fastScrollToEl(el as HTMLElement, { offset: 160, duration: 220 }); // fast
    // after scroll finishes, release manual lock so scroll-spy resumes control
    if (clearTimerRef.current) window.clearTimeout(clearTimerRef.current);
    clearTimerRef.current = window.setTimeout(() => {
      setManualActive(null);
    }, 300); // a bit longer than duration
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
    if (!data) return;
  
    state.setServiceAgreement(data as ServiceAgreement);
  
    const c = data.company_details ?? {};
    const b = data.billing_details ?? {};
  
    const fields: Record<string, string | undefined> = {
      // company
      abn: c.abn,
      companyName: c.companyName,
      businessStreetAddress: c.businessStreetAddress,
      businessCity: c.businessCity,
      businessState: c.businessState,
      businessPostcode: c.businessPostcode,
      businessCountry: c.businessCountry,
  
      // billing
      accountFirstName: b.accountFirstName,
      accountLastName: b.accountLastName,
      accountEmail: b.accountEmail,
      accountPhone: b.accountPhone,
      accountMobile: b.accountMobile,
      postalStreetAddress: b.postalStreetAddress,
      postalCity: b.postalCity,
      postalState: b.postalState,
      postalPostcode: b.postalPostcode,
      // postalCountry: b.postalCountry, // include if you use it
    };
  
    Object.entries(fields).forEach(([k, v]) => state.updateField(k, v ?? ""));

    if (data.pre_selection){
      state.setChuteCleaningFrequency(data.pre_selection.chuteCleaningFrequency);
      state.setEquipmentMaintenanceFrequency(data.pre_selection.equipmentMaintenanceFrequency);
      state.setWasteRoomCleaningFrequency(data.pre_selection.wasteRoomCleaningFrequency);
      state.setOdourControlFrequency(data.pre_selection.odourControlFrequency);
      state.setSelfClosingHopperDoorInspectionFrequency(data.pre_selection.selfClosingHopperDoorInspectionFrequency);
      state.setBinCleaningFrequency(data.pre_selection.binCleaningFrequency);
    }
    if (data.sites){
      data.sites.forEach((site) => {
        site.buildings.forEach((building) => {
          building.services.forEach((service) => {
            if (service.type === "odour_control") {
              state.setOdourControlUnit(service.id, getNumber(service.default_qty || "0"));
            }
          });
        });
      });
    }
    
  }, [data]);
  
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

  useEffect(() => {
    if (!isPreview && data) {
      openForm(id);
    }
  }, [id, isPreview, data]);

  /* Early Returns */
  if (isLoading) {
    return (
      <GlobalOverlay show={true} />
    );
  }
  if (error) {
    router.push('/not-found');
    return null; // stop rendering
  }

  /* Render */
  return (
    <>
      <Header />
      <Sider activeId={activeId} onJump={onJump} />
      <div className="pt-14 xl:pt-40 xl:pl-[400px] pb-40 relative">
        <ScrollButton />

        <div className="px-4 xl:px-20 text-neutral-800 bg-transparent">
          <div className="w-full flex flex-col items-center font-sans flex-grow gap-14 max-w-screen-lg mx-auto">
            {<ServiceAgreementProgress></ServiceAgreementProgress>}

            {state.page === 1 && (
              <div
                className={`${
                  fadeInStates.fadeIn1 ? " fade-up fade-up-100" : "opacity-0"
                } w-full flex flex-col`}
              >
                <ServicesForm selectMore={selectMore} />
              </div>
            )}

            {state.page === 2 && (
              <div
                className={`${
                  fadeInStates.fadeIn2 ? " fade-up fade-up-100" : "opacity-0"
                } w-full flex flex-col`}
              >
                <CompanyInfo />
              </div>
            )}

            {state.page === 3 && (
              <div
                className={`${
                  fadeInStates.fadeIn3 ? " fade-up fade-up-100" : "opacity-0"
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
  const searchParams = useSearchParams();
  const isPreview = searchParams.get("preview") === "true";

  return (
    <Suspense
      fallback={
        <GlobalOverlay show={true} />
      }
    >
      <ServiceAgreementComponent id={id} isPreview={isPreview} />
    </Suspense>
  );
}
