import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Option = "quarterly" | "six-monthly" | "yearly";
type MaybeOption = Option | null;

interface Props {
  value?: MaybeOption; // controlled (omit for uncontrolled)
  onChange?: (v: MaybeOption) => void; // fires on select/clear
  className?: string;
}

export function ServiceFrequency({ value, onChange, className = "" }: Props) {
  const [internal, setInternal] = React.useState<MaybeOption>(null);
  const selected = value !== undefined ? value : internal;

  const setSelected = (v: MaybeOption) => {
    if (value === undefined) setInternal(v);
    onChange?.(v);
  };

  const options: { label: string; val: Option }[] = [
    { label: "Quarterly", val: "quarterly" },
    { label: "6-Monthly", val: "six-monthly" },
    { label: "Yearly", val: "yearly" },
  ];

  return (
    <fieldset className={`flex items-center gap-3 ${className}`}>
      <legend className="sr-only">Billing frequency</legend>

      <div className="flex items-center gap-6">
        {options.map(({ label, val }) => {
          const id = `opt-${val}`;
          const isChecked = selected === val;

          return (
            <Label
              key={val}
              className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950"
            >
              <Checkbox
                id={id}
                className="peer mr-2"
                checked={isChecked}
                // shadcn passes true | false | "indeterminate"
                onCheckedChange={(state) => {
                  const next = state === true;
                  // if clicking the same one while checked -> clear (none selected)
                  if (next) setSelected(val);
                  else setSelected(null);
                }}
              />
              <div className="grid gap-1.5 font-normal">
                <p className="text-sm leading-none font-medium">
                  {label}
                </p>
                
              </div>
            </Label>
          );
        })}
      </div>
    </fieldset>
  );
}
