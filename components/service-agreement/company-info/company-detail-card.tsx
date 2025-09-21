"use client";
import React, { useEffect, useMemo, useImperativeHandle } from "react";
import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import {
  Form,
  FormControl,
  FormDescription,
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
import { useForm } from "react-hook-form";
import { z } from "zod";

/** Require companyType only when NO customer exists */
const makeCustomerSchema = () =>
  z.object({
    abn: z.string().regex(/^\d{11}$/, {
      message:
        "ABN must be exactly 11 digits with no spaces or special characters.",
    }),
    companyName: z.string().min(1, "This field cannot be empty"),
    businessStreetAddress: z
      .string()
      .min(1, { message: "Business street address cannot be empty" }),
    businessCity: z
      .string()
      .min(1, { message: "Business city cannot be empty" }),
    businessState: z
      .string()
      .min(1, { message: "Business state cannot be empty" }),
    businessPostcode: z.string().regex(/^\d{4}$/, {
      message: "Business postcode must be exactly 4 digits",
    }),
    businessCountry: z.string(),
  });

export type CustomerDetailsFormType = z.infer<
  ReturnType<typeof makeCustomerSchema>
>;

/** What the parent can call */
export type CompanyDetailsCardHandle = {
  /** Validate all fields; focus the first invalid. Returns true if valid. */
  handleSubmit: () => Promise<boolean>;
};

type Props = {
  className?: string;
};

const CompanyDetailsCard = React.forwardRef<CompanyDetailsCardHandle, Props>(
  function CompanyDetailsCard(_props, ref) {
    const state = useServiceAgreementStore();
    const simproCustomer = state.serviceAgreement?.simpro_customer ?? null;
    const hasCustomer = !!simproCustomer;

    const schema = useMemo(() => makeCustomerSchema(), [hasCustomer]);

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

    const valuesFromCustomer = (
      c: SimproCustomer
    ): CustomerDetailsFormType => ({
      abn: c?.EIN ?? "",
      companyName: c?.CompanyName ?? "",
      businessStreetAddress: c?.Address?.Address ?? "",
      businessCity: c?.Address?.City ?? "",
      businessState: c?.Address?.State ?? "",
      businessPostcode: c?.Address?.PostalCode ?? "",
      businessCountry: c?.Address?.Country ?? "",
    });

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

    // Rehydrate when customer link toggles
    useEffect(() => {
      if (hasCustomer) {
        const vals = valuesFromCustomer(simproCustomer);
        form.reset(vals);
        for (const [k, v] of Object.entries(vals))
          state.updateField(k, v as string);
      } else {
        form.reset(emptyValues);
        for (const key of Object.keys(emptyValues)) state.updateField(key, "");
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasCustomer]);

    useEffect(() => {
      scrollToTop();
    }, []);

    const onChange = (field: keyof CustomerDetailsFormType, value: string) => {
      state.updateField(field as string, value);
    };

    const isDisabled = hasCustomer; // lock when a Simpro customer is linked

    /** Expose validate() to parent */
    useImperativeHandle(
      ref,
      () => ({
        handleSubmit: async () => {
          const ok = await form.trigger(); // validate all fields
          if (!ok) {
            const firstError = Object.keys(form.formState.errors)[0];
            if (firstError) {
              const el = document.querySelector(
                `[name="${firstError}"]`
              ) as HTMLElement | null;
              el?.focus();
              el?.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }
          return ok;
        },
      }),
      [form]
    );

    return (
      <div className="flex flex-col w-full mx-auto rounded-xl border border-input shadow-sm overflow-hidden">
        <div className="flex flex-row justify-between w-full items-center py-8 px-4 md:px-6 border-b border-input bg-neutral-50">
          <Label className="text-base xl:text-lg">Company Information</Label>
        </div>

        <div className="py-8 px-4 md:px-6 flex flex-col ">
          <Form {...form}>
            <form
              className="flex flex-col gap-8"
              onSubmit={(e) => e.preventDefault()}
            >
              {/* ABN */}
              <FormField
                control={form.control}
                name="abn"
                render={({ field }) => (
                  <FormItem className="flex flex-col  md:flex-row md:items-start md:gap-6">
                    <FormLabel className="text-sm w-full md:w-1/3">
                      ABN<span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="w-full md:w-2/3 flex-shrink-0">
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

              {/* Company Name / Strata Plan */}
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-col md:flex-row md:items-start gap-2 md:gap-6">
                      <FormLabel className="text-sm w-full md:w-1/3">
                        Company name <span className="text-red-500">*</span>
                      </FormLabel>
                      <div className="w-full md:w-2/3 flex-shrink-0">
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) => {
                              const val = e.target.value;
                              field.onChange(val);
                              onChange("companyName", val);
                            }}
                            className="efg-input w-full"
                            disabled={isDisabled}
                          />
                        </FormControl>
                        <FormMessage />
                        <FormDescription className="ml-1 mt-2">
                          {`Enter your company name — or, if you’re a strata management company, enter your strata plan number prefixed with CTS, SP, or OC (e.g., CTS 12345).`}
                        </FormDescription>
                      </div>
                    </FormItem>
                  );
                }}
              />

              {/* Address */}
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
                <Label className="mb-2 text-sm w-full md:w-1/3">
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
                    handleChange={(f, v) =>
                      onChange(f as keyof CustomerDetailsFormType, v)
                    }
                    stateSelectValue={form.watch("businessState")}
                    disabled={isDisabled}
                  />
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    );
  }
);

CompanyDetailsCard.displayName = "CompanyDetailsCard";
export default CompanyDetailsCard;
