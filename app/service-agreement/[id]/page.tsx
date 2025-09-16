"use client";
import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { useEffect, useState } from "react";

import ConfirmInfo from "./pages/confirm-info";
import CustomerInformation from "./pages/customer-info";
import ServicesForm from "./pages/service";
import SiteInfo from "./pages/site-info";
import BillingDetails from "./pages/billing-info";
import ReviewInfo from "./pages/review-info";
import AdditionalContactInfo from "./pages/additional-contact-info";

function ServiceAgreement() {
  const state = useServiceAgreementStore();
  const [fadeInStates, setFadeInStates] = useState({
    fadeIn1: false,
    fadeIn2: false,
    fadeIn3: false,
    fadeIn4: false,
    fadeIn5: false,
    fadeIn6: false,
    fadeIn7: false,
  });

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
    const cur  = state.progress ?? 0;
  
    if (next > cur) {
      state.setProgress(next);
    }
  }, [state.page, state.progress]);

  return (
    <div className="w-full flex flex-col items-center font-sans pt-20 pb-20 bg-white flex-grow gap-8 max-w-screen-lg mx-auto">
      {/* {state.page >= 2 && <ServiceAgreementProgress ></ServiceAgreementProgress>} */}

      {state.page === 1 && (
        <div
          className={`${
            fadeInStates.fadeIn1 ? "fade-in" : "opacity-0"
          } w-full flex flex-col`}
        >
          <ServicesForm></ServicesForm>
        </div>
      )}
      {state.page === 2 && (
        <div
          className={`${
            fadeInStates.fadeIn2 ? "fade-in" : "opacity-0"
          } w-full flex flex-col`}
        >
          <CustomerInformation></CustomerInformation>
        </div>
      )}
       {state.page === 3 && (
        <div
          className={`${
            fadeInStates.fadeIn3 ? "fade-in" : "opacity-0"
          } w-full flex flex-col`}
        >
          <BillingDetails></BillingDetails>
        </div>
      )}
      {state.page === 4 && (
        <div
          className={`${
            fadeInStates.fadeIn4 ? "fade-in" : "opacity-0"
          } w-full flex flex-col`}
        >
          <AdditionalContactInfo></AdditionalContactInfo>
        </div>
      )}

      {state.page === 5 && (
        <div
          className={`${
            fadeInStates.fadeIn5 ? "fade-in" : "opacity-0"
          } w-full flex flex-col`}
        >
          <SiteInfo></SiteInfo>
        </div>
      )}

      {state.page === 6 && (
        <div
          className={`${
            fadeInStates.fadeIn6 ? "fade-in" : "opacity-0"
          } w-full flex flex-col`}
        >
          <ReviewInfo></ReviewInfo>
        </div>
      )}

      {state.page === 7 && (
        <div
          className={`${
            fadeInStates.fadeIn7 ? "fade-in" : "opacity-0"
          } w-full flex flex-col`}
        >
          <ConfirmInfo></ConfirmInfo>
        </div>
      )}
    </div>
  );
}

export default ServiceAgreement;
