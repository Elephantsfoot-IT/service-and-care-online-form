"use client";
import { CircleCheck } from "@/components/animate-ui/icons/circle-check";
import Header from "@/components/header";

export default function Success() {
  return (
    <>
      <Header />
      <div className="pt-[88px]">
        <div className="min-h-[calc(100vh-88px)] flex items-center justify-center px-4 translate-y-[-100px] fade-in">
          <div className="w-full max-w-xl  bg-white p-8 text-center">
            <div className="mx-auto mb-4 flex items-center justify-center">
              <CircleCheck animateOnView animation="default" className="h-20 w-20 text-efg-yellow" />
            </div>

            <h1 className="text-2xl font-semibold text-neutral-900">
              Thank you for completing the form
            </h1>

            <p className="mt-3 text-base text-neutral-600">
              A signed version of the agreement will be sent to you.
              Our team will get back to you shortly.
            </p>

            
          </div>
        </div>
      </div>
    </>
  );
}
