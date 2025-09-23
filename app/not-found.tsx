import { CircleXIcon } from "@/components/animate-ui/icons/circle-x";
import React from "react";

function NotFound() {
  return (
    <div className="pt-[88px]">
      <div className="min-h-[calc(100vh-88px)] flex items-center justify-center px-4 translate-y-[-100px] fade-up">
        <div className="w-full max-w-xl bg-white p-8 text-center">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <CircleXIcon
              animateOnView
              animation="default"
              className="h-20 w-20 text-red-500"
              aria-hidden="true"
            />
          </div>

          <h1 className="text-2xl font-semibold text-neutral-900">
             Form Not Found
          </h1>

          <p className="mt-3 text-base text-neutral-600">
            This form is invalid, expired, or may have already
            been completed.
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
