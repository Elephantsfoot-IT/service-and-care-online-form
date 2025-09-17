"use client";

/* ------------------------------ Imports ------------------------------ */
import { useEffect, useState, useRef } from "react";
import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import ConfirmInfo from "./pages/confirm-info";
import CustomerInformation from "./pages/customer-info";
import SiteInfo from "./pages/site-info";
import BillingDetails from "./pages/billing-info";
import ReviewInfo from "./pages/review-info";
import AdditionalContactInfo from "./pages/additional-contact-info";
import ServicesForm from "./pages/services";
import { useServiceAgreement } from "@/lib/api";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/header";
import Sider from "@/components/sider";
import { Loader2Icon } from "lucide-react";
import { SECTION_IDS, ServiceAgreement } from "@/lib/interface";
import { useScrollSpy } from "@/components/service-agreement/scroll-spy";
import { fastScrollToEl } from "@/lib/utils";

/* ------------------------------ Component ------------------------------ */
function ServiceAgreementComponent({ id }: { id: string }) {
  /* Store / Query */
  const state = useServiceAgreementStore();
  const setServiceAgreement = useServiceAgreementStore((s) => s.setServiceAgreement);
  const { data, isLoading, error, refetch } = useServiceAgreement(id);

  /* Refs / Local State */
  const [manualActive, setManualActive] = useState<string | null>(null);
  const clearTimerRef = useRef<number | null>(null);

  const [fadeInStates, setFadeInStates] = useState({
    fadeIn1: false,
    fadeIn2: false,
    fadeIn3: false,
    fadeIn4: false,
    fadeIn5: false,
    fadeIn6: false,
    fadeIn7: false,
  });

  /* Derived */
  // Disable scroll spy while we're doing a programmatic scroll
  const spiedId = useScrollSpy(SECTION_IDS as unknown as string[], {
    offset: 140,
    disabled: !!manualActive,
  });
  const activeId = manualActive ?? spiedId;

  /* Callbacks */
  const onJump = (sectionId: string) => {
    setManualActive(sectionId); // set active immediately (for instant highlight)

    const el = document.getElementById(sectionId);
    if (!el) return;

    fastScrollToEl(el as HTMLElement, { offset: 140, duration: 220 }); // fast
    // after scroll finishes, release manual lock so scroll-spy resumes control
    if (clearTimerRef.current) window.clearTimeout(clearTimerRef.current);
    clearTimerRef.current = window.setTimeout(() => {
      setManualActive(null);
    }, 250); // a bit longer than duration
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
      fadeIn4: state.page === 4,
      fadeIn5: state.page === 5,
      fadeIn6: state.page === 6,
      fadeIn7: state.page === 7,
    });
  }, [state.page]);

  useEffect(() => {
    const next = state.page ?? 0;
    const cur = state.progress ?? 0;

    if (next > cur) {
      state.setProgress(next);
    }
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
    return <div>Error: {error.message}</div>;
  }

  /* Render */
  return (
    <>
      <Header />
      {activeId && <Sider activeId={activeId} onJump={onJump} />}
      <div className="pt-[88px] xl:pl-[400px]">
        <div className="px-4 xl:px-20 text-neutral-700 ">
          <div className="w-full flex flex-col items-center font-sans pt-20 pb-20 bg-white flex-grow gap-8 max-w-screen-lg mx-auto">
            {/* {state.page >= 2 && <ServiceAgreementProgress ></ServiceAgreementProgress>} */}

            {state.page === 1 && (
              <div className={`${fadeInStates.fadeIn1 ? "fade-in" : "opacity-0"} w-full flex flex-col`}>
                <ServicesForm />
              </div>
            )}
            {state.page === 2 && (
              <div className={`${fadeInStates.fadeIn2 ? "fade-in" : "opacity-0"} w-full flex flex-col`}>
                <CustomerInformation />
              </div>
            )}
            {state.page === 3 && (
              <div className={`${fadeInStates.fadeIn3 ? "fade-in" : "opacity-0"} w-full flex flex-col`}>
                <BillingDetails />
              </div>
            )}
            {state.page === 4 && (
              <div className={`${fadeInStates.fadeIn4 ? "fade-in" : "opacity-0"} w-full flex flex-col`}>
                <AdditionalContactInfo />
              </div>
            )}

            {state.page === 5 && (
              <div className={`${fadeInStates.fadeIn5 ? "fade-in" : "opacity-0"} w-full flex flex-col`}>
                <SiteInfo />
              </div>
            )}

            {state.page === 6 && (
              <div className={`${fadeInStates.fadeIn6 ? "fade-in" : "opacity-0"} w-full flex flex-col`}>
                <ReviewInfo />
              </div>
            )}

            {state.page === 7 && (
              <div className={`${fadeInStates.fadeIn7 ? "fade-in" : "opacity-0"} w-full flex flex-col`}>
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
    <Suspense fallback={<div>Loading details...</div>}>
      <ServiceAgreementComponent id={id} />
    </Suspense>
  );
}
