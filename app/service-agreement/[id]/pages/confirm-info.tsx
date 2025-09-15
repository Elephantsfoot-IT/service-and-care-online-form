"use client";
import { Button } from "@/components/ui/button";
import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import SignaturePadComponent from "@/components/ui/signature-pad";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import ServiceAndCareTerms from "@/components/terms-and-conditions/service-and-care-terms";
import { Landmark } from "lucide-react";
import { scrollToTop } from "@/lib/utils";

const SummitFormSchema = z.object({
  signFullName: z.string().min(1, { message: "Name cannot be empty" }),
  signTitle: z.string().min(1, { message: "Title cannot be empty" }),
  conditionAgree: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
});

function ConfirmInfo() {
  /** 1) Refs */
  const containerRef = useRef<HTMLDivElement>(null);

  /** 2) External state (store/selectors) */
  const state = useServiceAgreementStore();

  /** 3) Form */
  const form = useForm<z.infer<typeof SummitFormSchema>>({
    resolver: zodResolver(SummitFormSchema),
    mode: "onChange",
    defaultValues: {
      signFullName: "",
      signTitle: "",
      conditionAgree: false,
    },
  });

  /** 4) Local component state */
  const [parentWidth, setParentWidth] = useState<number>(0);

  /** 5) Derived values (memoized) */
  const authDate = useMemo(() => {
    const date = new Date();
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  /** 6) Callbacks / handlers (stable) */
  const goBack = useCallback(() => {
    state.setPage(3);
  }, [state.setPage]);

  const onSubmit = useCallback(
    form.handleSubmit((values) => {
      // Example: sync to store; adjust as needed
      // continue flow (e.g., next page)
      // setTrimmedDataURL(trimmedDataURL) // if you need to persist signature image etc.
    }),
    [form, state.setPage]
  );

  /** 7) Effects */
  useEffect(() => {
    if (!containerRef.current || typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setParentWidth(entry.contentRect.width);
      }
    });

    ro.observe(containerRef.current);
    setParentWidth(containerRef.current.offsetWidth);

    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    form.setValue("signFullName", state.signFullName);
    form.setValue("signTitle", state.signTitle);
    form.setValue("conditionAgree", state.conditionAgree);
  }, [state.signFullName, state.signTitle, state.conditionAgree]);

  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <div ref={containerRef} className="my-12 max-w-screen-sm w-full mx-auto">
      <Label className="text-3xl mb-1">Review and Submit</Label>
      <span className="text-lg mb-10 text-neutral-500">
        Please review your selected services and the information you’ve
        provided.
      </span>

      <div className="p-4 flex flex-col gap-2  mt-4 mb-6 border border-neutral-100 rounded-md shadow-sm">
        <div className="flex flex-row space-x-4 items-center">
          <Label className="text-lg break-words text-efg-dark-blue">
            Billing Details
          </Label>
          <Button
            variant="ghost"
            className="text-sm ml-auto"
            onClick={() => {
              state.setPage(2);
            }}
          >
            Edit
          </Button>
        </div>

        <div className="flex flex-col ">
          <div className="flex flex-col space-y-4 bg-neutral-50 p-4 rounded-md">
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 w-full">
              <div className="flex-1 flex flex-col space-y-1 ">
                <Label className="text-neutral-500 text-sm">First Name</Label>
                {state.accountFirstName ? (
                  <span className="text-base break-words">
                    {state.accountFirstName}
                  </span>
                ) : (
                  <span className="text-base break-words">N/A</span>
                )}
              </div>
              <div className=" flex-1 flex flex-col space-y-1 ">
                <Label className="text-neutral-500 text-sm">Last Name</Label>
                {state.accountLastName ? (
                  <span className="text-base break-words">
                    {state.accountLastName}
                  </span>
                ) : (
                  <span className="text-base break-words">N/A</span>
                )}
              </div>
            </div>
            <div className="flex flex-col space-y-1 ">
              <Label className="text-neutral-500 text-sm">Email Address</Label>
              {state.accountEmail ? (
                <span className="text-base break-words">
                  {state.accountEmail}
                </span>
              ) : (
                <span className="text-base break-words">N/A</span>
              )}
            </div>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 w-full">
              <div className="flex flex-col space-y-1 w-1/2">
                <Label className="text-neutral-500 text-sm">Mobile Phone</Label>
                {state.accountMobile ? (
                  <span className="text-base break-words">
                    {state.accountMobile}
                  </span>
                ) : (
                  <span className="text-base break-words">N/A</span>
                )}
              </div>
              <div className="flex flex-col space-y-1 w-1/2">
                <Label className="text-neutral-500 text-sm">Office Phone</Label>
                {state.accountPhone ? (
                  <span className="text-base break-words">
                    {state.accountPhone}
                  </span>
                ) : (
                  <span className="text-sm break-words">N/A</span>
                )}
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <Label className="text-neutral-500">Postal Address</Label>
              {state.postalStreetAddress &&
              state.postalCity &&
              state.postalState &&
              state.postalPostcode ? (
                <span className="text-base break-words">
                  {state.postalStreetAddress}, {state.postalCity}{" "}
                  {state.postalState} {state.postalPostcode}, Australia
                </span>
              ) : (
                <span className="text-base break-words">N/A</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-lg font-medium text-efg-dark-blue">
          Terms and Conditions
        </Label>
        <span className="text-sm text-neutral-500 mb-2">
          Please take a moment to carefully scroll through and review our Terms
          and Conditions before proceeding.
        </span>
        <div className="p-6 border border-neutral-100 rounded-md shadow-sm w-full max-h-[400px] overflow-y-auto mt-2 mb-4">
          <ServiceAndCareTerms />
        </div>
        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="conditionAgree"
              render={({ field }) => (
                <FormItem className="py-4">
                  <div className="flex items-center space-x-2 ">
                    <Checkbox
                      id="terms"
                      checked={field.value}
                      className="efg-checkbox"
                      onCheckedChange={(value: boolean) => {
                        field.onChange(value);
                        state.updateFieldBoolean("conditionAgree", value);
                      }} // Sync state
                    />
                    <label
                      htmlFor="terms"
                      className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Accept terms and conditions
                    </label>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="signFullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Legal Full Name"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        state.updateField("signFullName", e.target.value);
                      }}
                      className="efg-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="signTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">
                    Titles
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="CEO, Manager, Partner, ..."
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        state.updateField("signTitle", e.target.value);
                      }}
                      className="efg-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <Label className="w-full flex flex-row justify-between items-end mt-4">
          <span className=" text-sm">
            Signature 
          </span>

          <span className="ml-auto text-sm text-neutral-500">{authDate}</span>
        </Label>
        <div className="mt-2">
          <SignaturePadComponent
            parentWidth={parentWidth}
            setTrimmedDataURL={state.setTrimmedDataURL}
            trimmedDataURL={state.trimmedDataURL}
          />
          <div className="text-sm text-neutral-500 mt-1">
            Please use your mouse (on desktop) or your finger (on phone or
            tablet) to draw your signature in the box
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-2 justify-end">
        <Button
          variant="secondary"
          onClick={goBack}
          className="mt-10 w-fit cursor-pointer"
        >
          Back
        </Button>
        <Button
          onClick={onSubmit}
          className="mt-10 w-fit cursor-pointer"
          variant="efg"
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

export default ConfirmInfo;
