import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { MaybeOption, Option } from "@/lib/interface";

interface Props {
  value?: MaybeOption;
  onChange?: (v: MaybeOption) => void;
  options: {
    label: string;
    value: Option;
    subtext: string;
    recommended?: boolean;
  }[];
}

function ServiceFrequency2({ value, onChange, options }: Props) {
  const handleChange = (v: MaybeOption) => {
    if (v === value) {
      onChange?.(null);
    } else {
      onChange?.(v);
    }
  };
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {options.map((option) => {
        const isSelected = value === option.value;
        const isSixMonthly = option.value === "six-monthly";
        const isQuarterly = option.value === "quarterly";

        const selectedClasses = isSelected
          ? isSixMonthly
            ? "bg-yellow-50 border-efg-yellow ring-1 ring-efg-yellow"
            : isQuarterly
              ? "bg-[#1e60ad]/10 border-[#1e60ad] ring-1 ring-[#1e60ad]"
              : "bg-neutral-50 border-neutral-400 ring-1 ring-neutral-300"
          : "";

        const checkboxClasses = cn(
          " absolute top-4 right-4 cursor-pointer focus-visible:ring-1 focus-visible:ring-efg-yellow focus-visible:border-efg-yellow shadow-none",
          isSelected &&
            (isSixMonthly
              ? "efg-checkbox"
              : isQuarterly
                ? "data-[state=checked]:bg-[#1e60ad] data-[state=checked]:border-[#1e60ad] data-[state=checked]:text-white"
                : "data-[state=checked]:bg-neutral-300 data-[state=checked]:border-neutral-300 data-[state=checked]:text-neutral-800")
        );

        return (
          <div
            key={option.value}
            className={cn(
              "bg-white flex-1 border flex flex-row items-center justify-start border-input rounded-lg relative px-4 xl:py-4 py-2 text-left transition-colors cursor-pointer shadow-xs",

              selectedClasses
            )}
            onClick={() => handleChange(option.value as MaybeOption)}
          >
            <Checkbox className={checkboxClasses} checked={isSelected} />

            <div className="flex flex-col ">
              <span className="text-sm xl:text-base font-medium">
                {option.label}
              </span>
              <span className=" text-sm text-neutral-500">
                {option.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ServiceFrequency2;
