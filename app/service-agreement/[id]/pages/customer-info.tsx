"use client";
import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MultiLineAddressInput from "@/components/ui/multi-line-address-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { scrollToTop } from "@/lib/utils";

const customerSchema = z.object({
  companyType: z.string().min(1, "Company type cannot be empty"),
  abn: z
    .string()
    .regex(/^\d{11}$/, { message: "ABN must be exactly 11 digits with no spaces or special characters." }),
  companyName: z.string().min(1, "This field cannot be empty"),
  businessStreetAddress: z.string().min(1, { message: "Business street address cannot be empty" }),
  businessCity: z.string().min(1, { message: "Business city cannot be empty" }),
  businessState: z.string().min(1, { message: "Business state cannot be empty" }),
  businessPostcode: z.string().regex(/^\d{4}$/, { message: "Business postcode must be exactly 4 digits" }),
  businessCountry: z.string(),
});

export type CustomerDetailsFormType = z.infer<typeof customerSchema>;

export default function CustomerDetails() {
  const state = useServiceAgreementStore();

  const form = useForm<CustomerDetailsFormType>({
    resolver: zodResolver(customerSchema),
    mode: "onChange",
    defaultValues: {
      companyType: "",
      abn: "",
      companyName: "",
      businessStreetAddress: "",
      businessCity: "",
      businessState: "",
      businessPostcode: "",
      businessCountry: "",
    },
  });

  useEffect(() => {
    // hydrate from store
    form.setValue("companyType", state.companyType);
    form.setValue("abn", state.abn);
    form.setValue("companyName", state.companyName);
    form.setValue("businessStreetAddress", state.businessStreetAddress);
    form.setValue("businessCity", state.businessCity);
    form.setValue("businessState", state.businessState);
    form.setValue("businessPostcode", state.businessPostcode);
    scrollToTop();
  }, []); // eslint-disable-line

  const onChange = (field: keyof CustomerDetailsFormType, value: string) => {
    state.updateField(field as string, value);
  };

  const goBack = () => state.setPage(1);          // back to Services
  const goNext = () =>
    form.handleSubmit(() => {
      state.setPage(3);                            // forward to BillingDetails
    })();

  return (
    <div className="flex flex-col w-full mx-auto">
      <Form {...form}>
        <form className="flex flex-col gap-6">
          <div className="flex flex-col">
            <Label className="text-xl mb-1 text-efg-dark-blue">Company Details</Label>
            <span className="text-base text-neutral-500 font-normal">Please provide information about your company.</span>
          </div>

          <hr className="border-neutral-300 border-dashed" />

          <FormField
            control={form.control}
            name="companyType"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
                <FormLabel className="text-sm w-full md:w-1/3">
                  Company type<span className="text-red-500">*</span>
                </FormLabel>
                <div className="w-full md:w-2/3">
                  <Select
                    value={state.companyType}
                    onValueChange={(val) => {
                      field.onChange(val);
                      onChange("companyType", val);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full eft-select-trigger">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border border-neutral-200">
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
                        field.onChange(e);
                        onChange("abn", e.target.value);
                      }}
                      className="efg-input"
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription className="mt-2 ml-1">
                    Your 11-digit ABN will be verified using the ABN lookup service.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <hr className="border-neutral-300 border-dashed" />

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
                        placeholder={isStrata ? "CTS / SP / OC 112233" : ""}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          onChange("companyName", e.target.value);
                        }}
                        className="efg-input"
                      />
                    </FormControl>
                    <FormMessage />
                    {isStrata && (
                      <FormDescription className="mt-2 ml-1">
                        Enter your strata plan number with its prefix, e.g. <b>CTS 123456</b>, <b>SP 123456</b>, or{" "}
                        <b>OC 123456</b>.
                      </FormDescription>
                    )}
                  </div>
                </FormItem>
              );
            }}
          />

          <hr className="border-neutral-300 border-dashed" />

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
                stateSelectValue={state.businessState}
              />
            </div>
          </div>
        </form>
      </Form>

      <div className="flex flex-row gap-2 justify-between mt-20">
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
