"use client";
import { CircleCheck } from "@/components/animate-ui/icons/circle-check";
import { useServiceAgreementStore } from "../service-agreement-store";
import { useEffect } from "react";

export default function Success() {
  const state = useServiceAgreementStore();
  useEffect(() => {
    state.reset();
  }, []);
  return (
    <>
      <div className="pt-[88px]">
        <div className="min-h-[calc(100vh-88px)] flex items-center justify-center px-4 translate-y-[-100px] fade-up">
          <div className="w-full max-w-xl  bg-white p-8 text-center">
            <div className="mx-auto mb-4 flex items-center justify-center">
              <CircleCheck
                animateOnView
                animation="default"
                className="h-20 w-20 text-efg-yellow"
              />
            </div>

            <h1 className="text-2xl font-medium text-neutral-800">
              Service agreement submitted
            </h1>

            <p className=" text-base text-neutral-500">
             Thank you for submitting the service agreement. A signed version of the agreement will be sent to you. Our team
              will get back to you shortly.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
