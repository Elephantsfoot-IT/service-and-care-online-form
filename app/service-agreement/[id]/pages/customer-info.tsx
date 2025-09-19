"use client";
import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MultiLineAddressInput from "@/components/ui/multi-line-address-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SimproCustomer } from "@/lib/interface";
import { scrollToTop } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

/** Make the schema conditional: companyType is required only when NO customer exists */
const makeCustomerSchema = (requireCompanyType: boolean) =>
  z.object({
    companyType: requireCompanyType
      ? z.string().min(1, "Company type cannot be empty")
      : z.string().optional().or(z.literal("")),
    abn: z
      .string()
      .regex(/^\d{11}$/, {
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

export type CustomerDetailsFormType = z.infer<ReturnType<typeof makeCustomerSchema>>;

export default function CustomerDetails() {
  const state = useServiceAgreementStore();
  const simproCustomer = state.serviceAgreement?.simpro_customer ?? null;
  const hasCustomer = !!simproCustomer;

  // Build the correct schema for current condition
  const schema = useMemo(
    () => makeCustomerSchema(!hasCustomer /* require companyType only when NO customer */),
    [hasCustomer]
  );

  // Helpers to produce values
  const emptyValues: CustomerDetailsFormType = useMemo(
    () => ({
      companyType: "",
      abn: "",
      companyName: "",
      businessStreetAddress: "",
      businessCity: "",
      businessState: "",
      businessPostcode: "",
      businessCountry: "",
    }),
    []
  );

  const valuesFromCustomer = (c: SimproCustomer): CustomerDetailsFormType => ({
    // Let the user set companyType; we don't infer it from Simpro
    companyType: "",
    abn: c?.EIN ?? "",
    companyName: c?.CompanyName ?? "",
    businessStreetAddress: c?.Address?.Address ?? "",
    businessCity: c?.Address?.City ?? "",
    businessState: c?.Address?.State ?? "",
    businessPostcode: c?.Address?.PostalCode ?? "",
    businessCountry: c?.Address?.Country ?? "",
  });

  // Initial defaults (one-time)
  const initialDefaults = useMemo(
    () => (hasCustomer ? valuesFromCustomer(simproCustomer) : emptyValues),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const form = useForm<CustomerDetailsFormType>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: initialDefaults,
  });

  // Sync when customer presence/record changes
  useEffect(() => {
    if (hasCustomer) {
      const vals = valuesFromCustomer(simproCustomer);
      form.reset(vals);
      // push to store
      for (const [k, v] of Object.entries(vals)) state.updateField(k, v as string);
    } else {
      form.reset(emptyValues);
      for (const key of Object.keys(emptyValues)) state.updateField(key, "");
    }
    // Clear any stale error on companyType if it was required previously
    form.clearErrors("companyType");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCustomer]);

  useEffect(() => {
    scrollToTop();
  }, []);

  const onChange = (field: keyof CustomerDetailsFormType, value: string) => {
    state.updateField(field as string, value);
  };

  const goBack = () => state.setPage(1); // back to Services
  const goNext = () =>
    form.handleSubmit(() => {
      state.setPage(3); // forward to BillingDetails
    })();

  const isDisabled = hasCustomer; // lock fields when a Simpro customer is linked

  return (
    <div className="flex flex-col w-full mx-auto gap-10">
      <div className="flex flex-col">
        <Label className="text-2xl mb-1">Company Details</Label>
        {hasCustomer ? <span className="text-lg text-neutral-500 font-normal">
          Review the information below for your company.
        </span> : <span className="text-lg text-neutral-500 font-normal">
          Please provide information about your company.
        </span>}
      </div>

      <Form {...form}>
        <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
          {/* Company Type (required only if no customer) */}
          <FormField
            control={form.control}
            name="companyType"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
                <FormLabel className="text-sm w-full md:w-1/3">
                  Company type{!hasCustomer && <span className="text-red-500">*</span>}
                </FormLabel>
                <div className="w-full md:w-2/3">
                  <Select
                    value={field.value ?? ""}
                    onValueChange={(val) => {
                      field.onChange(val);
                      onChange("companyType", val);
                    }}
                    disabled={isDisabled}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full eft-select-trigger">
                        <SelectValue placeholder="Select company type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border border-input">
                      <SelectItem value="Strata management">Strata management</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <hr className="border-neutral-300 border-dashed" />

          {/* ABN */}
          <FormField
            control={form.control}
            name="abn"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
                <FormLabel className="text-sm w-full md:w-1/3">
                  ABN<span className="text-red-500">*</span>
                </FormLabel>
                <div className="w-full md:w-2/3">
                  <FormControl>
                    <Input
                      placeholder="11 222 333 444"
                      {...field}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\s+/g, "");
                        field.onChange(v);
                        onChange("abn", v);
                      }}
                      className="efg-input"
                      disabled={isDisabled}
                      inputMode="numeric"
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <hr className="border-neutral-300 border-dashed" />

          {/* Company Name / Strata Plan */}
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => {
              const isStrata = form.watch("companyType") === "Strata management";
              return (
                <FormItem className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
                  <FormLabel className="text-sm w-full md:w-1/3">
                    {isStrata ? "Strata plan number (CTS/SP/OC)" : "Company name"}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="w-full md:w-2/3">
                    <FormControl>
                      <Input
                        placeholder={isStrata ? "CTS / SP / OC 112233" : undefined}
                        {...field}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val);
                          onChange("companyName", val);
                        }}
                        className="efg-input"
                        disabled={isDisabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              );
            }}
          />

          <hr className="border-neutral-300 border-dashed" />

          {/* Address */}
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
            <Label className="mb-2 text-sm w-full md:w-1/3">
              Company address <span className="text-red-500">*</span>
            </Label>
            <div className="w-full md:w-2/3">
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
                disabled={isDisabled}
              />
            </div>
          </div>
        </form>
      </Form>

      <div className="flex flex-row gap-2 justify-between mt-10">
        <Button variant="outline" onClick={goBack} className="cursor-pointer">
          <ArrowLeftIcon /> Back
        </Button>
        <Button onClick={goNext} className="w-[200px] cursor-pointer" variant="efg">
          Continue <ArrowRightIcon />
        </Button>
      </div>
    </div>
  );
}
