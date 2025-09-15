"use client";
import {
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { autocomplete, fetchPlaceDetails } from "@/lib/google";
import { AddressOption } from "@/lib/interface";
import { cn } from "@/lib/utils";
import { Command as CommandPrimitive } from "cmdk";
import { CheckIcon } from "lucide-react";
import React, {
  useCallback,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  PathValue,
  useFormContext,
  type FieldValues,
  type Path,
} from "react-hook-form";

interface MultiLineAddressInputProps<T extends FieldValues> {
  fieldNames: {
    street: Path<T>;
    city: Path<T>;
    state: Path<T>;
    postcode: Path<T>;
    country: Path<T>;
  };
  handleChange: (field: Path<T>, value: string) => void;
  disabled?: boolean;
  stateSelectValue: string;
}

function MultiLineAddressInput<T extends FieldValues>({
  fieldNames,
  handleChange,
  disabled,
  stateSelectValue,
}: MultiLineAddressInputProps<T>) {
  const { control, setValue } = useFormContext<T>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState<AddressOption>();
  const [options, setOptions] = useState<AddressOption[]>([]);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(async () => {
      try {
        const predictions = await autocomplete(e.target.value);
        if (predictions) setOptions(predictions);
      } catch (error) {
        console.error("Error fetching autocomplete results:", error);
      }
    }, 200);
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (!input) return;
      if (!isOpen) setOpen(true);
      if (event.key === "Enter" && input.value !== "") {
        const optionToSelect = options.find(
          (option) => option.label === input.value
        );
        if (optionToSelect) setSelected(optionToSelect);
      }
      if (event.key === "Escape") input.blur();
    },
    [isOpen, options]
  );

  const handleBlur = useCallback(() => {
    setOpen(false);
  }, []);

  const handleSelectOption = useCallback(
    async (selectedOption: AddressOption) => {
      try {
        const data = await fetchPlaceDetails(selectedOption.placeId);
        if (data) {
          setValue(
            fieldNames.street,
            data.streetAddress as PathValue<T, typeof fieldNames.street>
          );
          setValue(
            fieldNames.city,
            data.city as PathValue<T, typeof fieldNames.city>
          );
          setValue(
            fieldNames.state,
            data.state as PathValue<T, typeof fieldNames.state>
          );
          setValue(
            fieldNames.postcode,
            data.postcode as PathValue<T, typeof fieldNames.postcode>
          );

          handleChange(fieldNames.street, data.streetAddress);
          handleChange(fieldNames.city, data.city);
          handleChange(fieldNames.postcode, data.postcode);
          handleChange(fieldNames.state, data.state);
          setOpen(false);
        }
      } catch (error) {
        console.error("Error fetching place details:", error);
      }

      setSelected(selectedOption);
      setTimeout(() => inputRef?.current?.blur(), 0);
    },
    [fieldNames, setValue, handleChange]
  );

  return (
    <div className="space-y-2">
      <CommandPrimitive onKeyDown={handleKeyDown}>
        <div>
          <FormField
            control={control}
            name={fieldNames.street}
            render={({ field }) => (
              <FormItem
                ref={inputRef}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleInputChange(e);
                  handleChange(fieldNames.street, e.target.value);
                }}
                onBlur={handleBlur}
              >
                <FormControl>
                  <Input
                    onFocus={() => setOpen(true)}
                    placeholder="Street Address"
                    className="text-base efg-input"
                    {...field}
                    value={field.value as string}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="relative mt-1">
          <div
            className={cn(
              "animate-in fade-in-0 zoom-in-95 absolute top-0 z-10 w-full rounded-xl bg-white outline-none",
              isOpen ? "block" : "hidden"
            )}
          >
            <CommandList className={cn("rounded-lg", options.length > 0 ? "ring-1 ring-slate-200" : "")}>
              {options.length > 0 ? (
                <CommandGroup heading="Suggestions">
                  {options.map((option) => {
                    const isSelected = selected?.value === option.value;
                    return (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onSelect={() => handleSelectOption(option)}
                        className={cn(
                          "flex w-full items-center gap-2",
                          !isSelected ? "pl-2" : null
                        )}
                      >
                        {option.label}
                        {isSelected ? (
                          <CheckIcon className="ml-auto w-4" />
                        ) : null}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ) : null}
            </CommandList>
          </div>
        </div>
      </CommandPrimitive>

      <div className="grid grid-cols-2 gap-2">
        {/* CITY */}
        <FormField
          control={control}
          name={fieldNames.city}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  placeholder="City"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleChange(fieldNames.city, e.target.value);
                  }}
                  value={field.value as string}
                  disabled={disabled}
                  className="efg-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* STATE */}
        <FormField
          control={control}
          name={fieldNames.state}
          render={({ field }) => (
            <FormItem className="flex-1">
              <Select
                value={stateSelectValue}
                onValueChange={(e) => {
                  field.onChange(e);
                  handleChange(fieldNames.state, e);
                }}
              >
                <FormControl>
                  <SelectTrigger
                    size="default"
                    className="w-full focus-visible:ring-1 focus-visible:ring-efg-yellow focus-visible:border-efg-yellow shadow-none"
                    disabled={disabled}
                  >
                    <SelectValue
                      placeholder={
                        <span className="text-neutral-500">State</span>
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="border border-neutral-200">
                  {["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"].map(
                    (state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* POSTCODE */}
        <FormField
          control={control}
          name={fieldNames.postcode}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  placeholder="Postcode"
                  {...field}
                  maxLength={4}
                  onChange={(e) => {
                    field.onChange(e);
                    handleChange(fieldNames.postcode, e.target.value);
                  }}
                  value={field.value as string}
                  disabled={disabled}
                  className="efg-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* COUNTRY */}
        <FormField
          control={control}
          name={fieldNames.country}
          render={() => (
            <FormItem className="flex-1">
              <FormControl>
                <Input disabled value="Australia" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormDescription className="text-sm ml-1">
        You can either select an address from the suggestions or manually adjust
        it to match your exact location.
      </FormDescription>
    </div>
  );
}

export default MultiLineAddressInput;
