"use client";

/* ------------------------------ Imports ------------------------------ */
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, Loader2Icon } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  ServiceAgreementStore,
  useServiceAgreementStore,
} from "@/app/service-agreement/service-agreement-store";
import ServiceAndCareTerms from "@/components/terms-and-conditions/service-and-care-terms";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import SignaturePadComponent from "@/components/ui/signature-pad";
import { scrollToTop } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import SubmissionLoader from "@/components/submission-loader";

const submitServiceAgreement = async (
  id: string,
  state: ServiceAgreementStore
) => {
  const response = await fetch("/api/service-agreements/submission", {
    method: "POST",
    body: JSON.stringify({ id, state }),
  });
  return response.json();
};

/* ------------------------------ Schema ------------------------------ */
const TermsSchema = z.object({
  signFullName: z.string().min(1, { message: "Name cannot be empty" }),
  signTitle: z.string().min(1, { message: "Title cannot be empty" }),
  conditionAgree: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
});

/* ------------------------------ Component ------------------------------ */
export default function TermsAndSignature() {
  /** Refs */
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  /** Store */
  const state = useServiceAgreementStore();

  /** Form */
  const form = useForm<z.infer<typeof TermsSchema>>({
    resolver: zodResolver(TermsSchema),
    mode: "onChange",
    defaultValues: {
      signFullName: "",
      signTitle: "",
      conditionAgree: false,
    },
  });

  /** Local state */
  const [parentWidth, setParentWidth] = useState<number>(0);

  /** Derived */
  const authDate = useMemo(() => {
    const date = new Date();
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  /** Handlers */
  const goBack = useCallback(() => {
    state.setPage(2); // back to Review page
  }, [state]);

  const [isSubmitting, startSubmitting] = useTransition();

  const onSubmit = useCallback(
    form.handleSubmit(() => {
      startSubmitting(async () => {
        if (!state.serviceAgreement?.id) {
          return;
        }
        // e.g., state.submitAgreement()
        try {
          await submitServiceAgreement(state.serviceAgreement?.id, state);
          router.push(`/service-agreement/success`);
          // console.log(state.serviceAgreement);
        } catch (error) {
          toast.error("Failed to submit service agreement");
        }
      });
    }),
    [form, state]
  );

  /** Effects */
  useEffect(() => {
    if (!containerRef.current || typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) setParentWidth(entry.contentRect.width);
    });

    ro.observe(containerRef.current);
    setParentWidth(containerRef.current.offsetWidth);

    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    form.setValue("signFullName", state.signFullName);
    form.setValue("signTitle", state.signTitle);
    form.setValue("conditionAgree", state.conditionAgree);
  }, [state.signFullName, state.signTitle, state.conditionAgree, form]);

  useEffect(() => {
    scrollToTop();
  }, []);

  if (true) {
    return <SubmissionLoader show={true} />;
  }

  /* ------------------------------ JSX ------------------------------ */
  return (
    <div ref={containerRef} className="w-full mx-auto flex flex-col gap-10">
      <div className="flex flex-col">
        <Label className="text-2xl xl:text-3xl font-normal mb-1">
          Review & Sign Agreement
        </Label>
        <span className="text-lg text-neutral-500">
          Read the Terms & Conditions, then accept and sign to proceed.
        </span>
      </div>

      <div className="flex flex-col">
        <Label className="text-sm xl:text-base">Terms and Conditions</Label>
        {/* Terms box */}
        <div className="p-4 md:p-6 2xl:p-8 border border-input rounded-xl shadow-sm w-full max-h-[500px] overflow-y-auto mt-2 bg-white">
          <ServiceAndCareTerms />
        </div>
      </div>

      {/* Consent + Sign */}
      <Form {...form}>
        <form className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name="conditionAgree"
            render={({ field }) => (
              <FormItem className="">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={field.value}
                    className="efg-checkbox"
                    onCheckedChange={(value: boolean) => {
                      field.onChange(value);
                      state.updateFieldBoolean("conditionAgree", value);
                    }}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm xl:text-base font-medium leading-none"
                  >
                    Accept terms and conditions{" "}
                    <span className="text-red-500">*</span>
                  </label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <hr className="border-neutral-300 border-dashed" />

          <FormField
            control={form.control}
            name="signFullName"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
                <FormLabel className="w-full md:w-1/3 text-sm xl:text-base">
                  Full name<span className="text-red-500">*</span>
                </FormLabel>
                <div className="w-full md:w-2/3">
                  <FormControl>
                    <Input
                      placeholder="Legal full name"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        state.updateField("signFullName", e.target.value);
                      }}
                      className="efg-input"
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <hr className="border-neutral-300 border-dashed" />

          <FormField
            control={form.control}
            name="signTitle"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
                <FormLabel className="w-full md:w-1/3 text-sm xl:text-base">
                  Title<span className="text-red-500">*</span>
                </FormLabel>
                <div className="w-full md:w-2/3">
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
                </div>
              </FormItem>
            )}
          />

          <hr className="border-neutral-300 border-dashed" />
        </form>
      </Form>

      {/* Signature */}
      <div>
        <div className="w-full flex flex-row justify-between items-end">
          <Label className="text-sm xl:text-base">
            Signature <span className="text-red-500">*</span>
          </Label>
          <span className="ml-auto text-sm xl:text-base text-neutral-500">
            {authDate}
          </span>
        </div>
        <div className="mt-2">
          <SignaturePadComponent
            parentWidth={parentWidth}
            setTrimmedDataURL={state.setTrimmedDataURL}
            trimmedDataURL={state.trimmedDataURL}
          />
          <div className="text-sm xl:text-base text-neutral-500 mt-2">
            By providing your electronic signature and initials, you acknowledge
            that they are legally binding and equivalent to a physical
            signature, and that the contract term shall commence on the date of
            agreement signature and continue for two 2 years, 
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex flex-row gap-2 justify-between mt-10">
        <Button
          variant="outline"
          onClick={goBack}
          className="w-fit cursor-pointer"
        >
          <ArrowLeftIcon /> Back
        </Button>
        <Button
          onClick={onSubmit}
          className="w-[200px] cursor-pointer"
          variant="efg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </div>
  );
}
