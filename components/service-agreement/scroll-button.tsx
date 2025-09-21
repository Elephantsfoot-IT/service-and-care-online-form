import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import React from "react";

function ScrollButton() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };
  return (
    <div className="fixed right-5 bottom-5 flex flex-col gap-2 z-[9999]">
      <button
        type="button"
        onClick={scrollToTop}
        className="size-10 bg-white border border-input flex items-center justify-center rounded-full shadow-sm
             transition-all duration-200 hover:bg-neutral-100 active:bg-neutral-100
             focus:outline-none
             select-none touch-manipulation [-webkit-tap-highlight-color:transparent]
             motion-safe:active:scale-95"
      >
        <ChevronUpIcon className="size-6" />
      </button>
      <button
        type="button"
        onClick={scrollToBottom}
        className="size-10 bg-white border border-input flex items-center justify-center rounded-full shadow-sm
             transition-all duration-200 hover:bg-neutral-100 active:bg-neutral-100
             focus:outline-none
             select-none touch-manipulation [-webkit-tap-highlight-color:transparent]
             motion-safe:active:scale-95"
      >
        <ChevronDownIcon className="size-6" />
      </button>
    </div>
  );
}

export default ScrollButton;
