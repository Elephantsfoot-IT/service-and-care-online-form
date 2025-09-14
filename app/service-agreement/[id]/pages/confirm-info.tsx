"use client";
import { Button } from "@/components/ui/button";
import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import SignaturePadComponent from "@/components/ui/signature-pad";
import { useEffect, useRef, useState } from "react";
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

const SummitFormSchema = z.object({
  signFullName: z.string().min(1, { message: "Name cannot be empty" }),
  signTitle: z.string().min(1, { message: "Title cannot be empty" }),
  conditionAgree: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
});

function ConfirmInfo() {
  const form = useForm<z.infer<typeof SummitFormSchema>>({
    resolver: zodResolver(SummitFormSchema),
    mode: "onChange", // Trigger validation on change
    defaultValues: {
      signFullName: "",
      signTitle: "",
      conditionAgree: false,
    },
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const [parentWidth, setParentWidth] = useState(0);
  const getAuthDate = () => {
    const date = new Date();
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setParentWidth(entry.contentRect.width);
      }
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
      setParentWidth(containerRef.current.offsetWidth);
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const { setPage, setTrimmedDataURL, trimmedDataURL } =
    useServiceAgreementStore();
  const goBack = () => {
    setPage(3);
  };
  const handleSubmit = () => {};

  return (
    <div
      ref={containerRef}
      className="my-20 max-w-screen-md w-full mx-auto px-6"
    >
      <Label className="text-3xl mb-1 text-efg-dark-blue">
        Review and Submit
      </Label>
      <span className="text-lg mb-10 text-neutral-500">
        Please review your selected services and the information you’ve
        provided.
      </span>
      <div>
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
                      onCheckedChange={field.onChange} // Sync state
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
                  <FormLabel className="custom-label">
                    Full Name<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Legal Full Name"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
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
                  <FormLabel className="custom-label">
                    Titles<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="CEO, Manager, Partner, ..."
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <Label className="w-full flex flex-row justify-between items-end mt-4">
          <span className="custom-label text-sm">
            Signature <span className="text-red-500">*</span>
          </span>

          <span className="ml-auto text-sm  text-neutral-600">
            {getAuthDate()}
          </span>
        </Label>
        <div className="mt-2">
          <SignaturePadComponent
            parentWidth={parentWidth}
            setTrimmedDataURL={setTrimmedDataURL}
            trimmedDataURL={trimmedDataURL}
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
        <Button onClick={handleSubmit} className="mt-10 w-fit cursor-pointer">
          Submit
        </Button>
      </div>
    </div>
  );
}

export default ConfirmInfo;
