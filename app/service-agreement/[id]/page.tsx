"use client";
import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { useEffect, useState } from "react";

import ConfirmInfo from "./pages/confirm-info";
import CustomerInformation from "./pages/customer-info";
import ServicesForm from "./pages/service";
import SiteInfo from "./pages/site-info";
import { scrollToTop } from "@/lib/utils";

function ServiceAgreement() {
  const state = useServiceAgreementStore();
  const [fadeInStates, setFadeInStates] = useState({
    fadeIn1: false,
    fadeIn2: false,
    fadeIn3: false,
    fadeIn4: false,
  });

  useEffect(() => {
    setFadeInStates({
      fadeIn1: state.page === 1,
      fadeIn2: state.page === 2,
      fadeIn3: state.page === 3,
      fadeIn4: state.page === 4,
    });
  }, [state.page]);



  return (
    <div className="bg-white flex flex-col min-h-screen">
      <div
        id="content"
        className="w-full flex flex-col items-center px-[1rem] font-sans my-20 bg-white  mx-auto flex-grow"
      >
        {state.page === 1 && (
          <div
            className={`${
              fadeInStates.fadeIn1 ? "fade-up" : "opacity-0"
            } w-full flex flex-col`}
          >
            <ServicesForm></ServicesForm>
          </div>    
        )}
        {state.page === 2 && (
          <div
            className={`${
              fadeInStates.fadeIn2 ? "fade-up" : "opacity-0"
            } w-full flex flex-col`}
          >
            <CustomerInformation></CustomerInformation>
          </div>
        )}

        {state.page === 3 && (
          <div
            className={`${
              fadeInStates.fadeIn3 ? "fade-up" : "opacity-0"
            } w-full flex flex-col`}
          >
            <SiteInfo></SiteInfo>
          </div>
        )}

        {state.page === 4 && (
          <div
            className={`${
              fadeInStates.fadeIn4 ? "fade-up" : "opacity-0"
            } w-full flex flex-col`}
          >
            <ConfirmInfo></ConfirmInfo>
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceAgreement;
