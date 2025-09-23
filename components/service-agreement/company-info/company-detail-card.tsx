"use client";

import React, { useImperativeHandle } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MultiLineAddressInput from "@/components/ui/multi-line-address-input";

/* ---------------- Schema ---------------- */
const companySchema = z.object({
  abn: z.string().regex(/^\d{11}$/, {
    message: "ABN must be exactly 11 digits with no spaces or special characters.",
  }),
  companyName: z.string().min(1, "This field cannot be empty"),
  businessStreetAddress: z.string().min(1, { message: "Business street address cannot be empty" }),
  businessCity: z.string().min(1, { message: "Business city cannot be empty" }),
  businessState: z.string().min(1, { message: "Business state cannot be empty" }),
  businessPostcode: z.string().regex(/^\d{4}$/, {
    message: "Business postcode must be exactly 4 digits",
  }),
  businessCountry: z.string(),
});

export type CustomerDetailsFormType = z.infer<typeof companySchema>;

export type CompanyDetailsCardHandle = {
  /** Validate all fields; focus the first invalid. Returns true if valid. */
  handleSubmit: () => Promise<boolean>;
};

type Props = {
  className?: string;
};

const CompanyDetailsCard = React.forwardRef<CompanyDetailsCardHandle, Props>(function CompanyDetailsCard(
  _props,
  ref
) {
  const state = useServiceAgreementStore();

  /* ---------- 1) Hydrate ONLY from Zustand for defaults ---------- */
  const defaultValues: CustomerDetailsFormType = {
    abn: state.abn ?? "",
    companyName: state.companyName ?? "",
    businessStreetAddress: state.businessStreetAddress ?? "",
    businessCity: state.businessCity ?? "",
    businessState: state.businessState ?? "",
    businessPostcode: state.businessPostcode ?? "",
    businessCountry: "Australia"
  };

  const form = useForm<CustomerDetailsFormType>({
    resolver: zodResolver(companySchema),
    mode: "onChange",
    defaultValues,           // ← reads current Zustand values when the component mounts
    shouldUnregister: false, // keep values stable
  });

  /* ---------- 2) Single writer: push every change to Zustand ---------- */
  const onChange = (field: keyof CustomerDetailsFormType, value: string) => {
    state.updateField(field as string, value);
  };

  /* ---------- 3) Expose validate to parent ---------- */
  React.useImperativeHandle(ref, () => ({
    handleSubmit: async () => {
      const ok = await form.trigger();
      if (!ok) {
        const firstError = Object.keys(form.formState.errors)[0];
        if (firstError) {
          const el = document.querySelector(`[name="${firstError}"]`) as HTMLElement | null;
          el?.focus();
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      return ok;
    },
  }), [form]);

  return (
    <div className="flex flex-col w-full mx-auto rounded-xl border border-input shadow-sm overflow-hidden">
      <div className="flex flex-row justify-between w-full items-center py-8 px-4 md:px-6 border-b border-input bg-neutral-50">
        <Label className="text-base xl:text-lg">Company Information</Label>
      </div>

      <div className="py-8 px-4 md:px-6 flex flex-col">
        <Form {...form}>
          <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
            {/* ABN */}
            <FormField
              control={form.control}
              name="abn"
              render={({ field }) => (
                <FormItem className="flex flex-col md:flex-row md:items-start md:gap-6">
                  <FormLabel className="text-sm xl:text-base w-full md:w-1/3">
                    ABN<span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="w-full md:w-2/3 flex-shrink-0">
                    <FormControl>
                      <Input
                        placeholder="11222333444"
                        {...field}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\s+/g, "");
                          field.onChange(v);
                          onChange("abn", v);
                        }}
                        className="efg-input"
                        inputMode="numeric"
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Company Name */}
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem className="flex flex-col md:flex-row md:items-start gap-2 md:gap-6">
                  <FormLabel className="text-sm xl:text-base w-full md:w-1/3">
                    Company name <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="w-full md:w-2/3 flex-shrink-0">
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          onChange("companyName", e.target.value);
                        }}
                        className="efg-input w-full"
                      />
                    </FormControl>
                    <p className="ml-1 mt-2 text-sm xl:text-base text-neutral-500">
                      If you’re a strata management company, enter your strata plan number prefixed with
                      CTS, SP, or OC (e.g., CTS 12345).
                    </p>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Address */}
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
              <Label className="mb-2 text-sm xl:text-base w-full md:w-1/3">
                Company address <span className="text-red-500">*</span>
              </Label>
              <div className="w-full md:w-2/3 flex-shrink-0">
                <MultiLineAddressInput<CustomerDetailsFormType>
                  fieldNames={{
                    street: "businessStreetAddress",
                    city: "businessCity",
                    state: "businessState",
                    postcode: "businessPostcode",
                    country: "businessCountry",
                  }}
                  handleChange={(f, v) => onChange(f as keyof CustomerDetailsFormType, v)}
                  stateSelectValue={form.watch("businessState")}
                />
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
});

CompanyDetailsCard.displayName = "CompanyDetailsCard";
export default CompanyDetailsCard;
