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
    <div className="grid grid-cols-3 lg:grid-cols-3 gap-4">
      {options.map((option) => {
        const isSelected = value === option.value;
        const isHighTier = option.value !== "yearly"; // only these get yellow

        const selectedClasses = isSelected
          ? isHighTier
            ? "bg-efg-yellow/5 border-efg-yellow ring-1 ring-efg-yellow"
            : "bg-neutral-50 border-neutral-400 ring-1 ring-neutral-300"
          : "";

        const checkboxClasses = cn(
          "hidden xl:flex absolute top-4 right-4 cursor-pointer focus-visible:ring-1 focus-visible:ring-efg-yellow focus-visible:border-efg-yellow shadow-none",
          // when selected, tint checkbox by tier
          isSelected &&
            (isHighTier
              ? "efg-checkbox"
              : "data-[state=checked]:bg-neutral-300 data-[state=checked]:border-neutral-300 data-[state=checked]:text-neutral-800")
        );

        return (
          <div
            key={option.value}
            className={cn(
              "flex-1 border flex flex-row items-center justify-center xl:justify-start border-input rounded-lg relative p-2 xl:p-4 text-left transition-colors cursor-pointer shadow-xs",

              selectedClasses
            )}
            onClick={() => handleChange(option.value as MaybeOption)}
          >
            <Checkbox className={checkboxClasses} checked={isSelected} />

            <div className="flex flex-col ">
              <span className="text-sm xl:text-base font-medium">{option.label}</span>
              <span className="hidden xl:flex text-sm text-neutral-500">{option.subtext}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ServiceFrequency2;
