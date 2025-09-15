"use client";
import { Button } from "@/components/ui/button";
import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { ArrowRightIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const baseFormSchema = z
  .object({
    accountFirstName: z
      .string()
      .min(1, { message: "First name cannot be empty" }),
    accountLastName: z
      .string()
      .min(1, { message: "Last name cannot be empty" }),
    accountEmail: z.string().email({
      message: "Please enter a valid email address.",
    }),
    accountPhone: z
      .string()
      .regex(/^[+]?[0-9]+$/, {
        message:
          "Phone number can only contain digits and an optional '+' at the beginning.",
      })
      .optional()
      .or(z.literal("")),

    accountMobile: z
      .string()
      .regex(/^(\+614|04)\d{8}$/, {
        message:
          "Phone number must start with '04' or '+614' and contain 8 digits after that.",
      })
      .optional()
      .or(z.literal("")),

    QuoteContact: z.boolean(),
    JobContact: z.boolean(),
    InvoiceContact: z.boolean(),
    StatementContact: z.boolean(),
    PrimaryStatementContact: z.boolean(),
    PrimaryInvoiceContact: z.boolean(),
    PrimaryJobContact: z.boolean(),
    PrimaryQuoteContact: z.boolean(),
  })
  .refine((data) => data.accountPhone || data.accountMobile, {
    message:
      "At least one contact number (Office Phone or Mobile Phone) must be provided.",
    path: ["accountMobile"], // Highlight this field (optional)
  });

function CustomerInformation() {
  const form = useForm<z.infer<typeof baseFormSchema>>({
    resolver: zodResolver(baseFormSchema), // Dyn
    mode: "onChange", // Trigger validation on change
    defaultValues: {
      accountFirstName: "",
      accountLastName: "",
      accountEmail: "",
      accountPhone: "",
      accountMobile: "",
      QuoteContact: false,
      JobContact: false,
      InvoiceContact: false,
      StatementContact: false,
      PrimaryStatementContact: false,
      PrimaryInvoiceContact: false,
      PrimaryJobContact: false,
      PrimaryQuoteContact: false,
    },
  });

  const state = useServiceAgreementStore();
  const goBack = () => {
    state.setPage(1);
  };
  const handleSubmit = () => {
    state.setPage(3);
  };

  useEffect(() => {
    form.setValue("accountFirstName", state.accountFirstName);
    form.setValue("accountLastName", state.accountLastName);
    form.setValue("accountEmail", state.accountEmail);
    form.setValue("accountPhone", state.accountPhone);
    form.setValue("accountMobile", state.accountMobile);
    form.setValue("QuoteContact", state.QuoteContact);
    form.setValue("JobContact", state.JobContact);
    form.setValue("InvoiceContact", state.InvoiceContact);
    form.setValue("StatementContact", state.StatementContact);
    form.setValue("PrimaryStatementContact", state.PrimaryStatementContact);
    form.setValue("PrimaryInvoiceContact", state.PrimaryInvoiceContact);
    form.setValue("PrimaryJobContact", state.PrimaryJobContact);
    form.setValue("PrimaryQuoteContact", state.PrimaryQuoteContact);
  }, [state.accountFirstName, state.accountLastName, state.accountEmail, state.accountPhone, state.accountMobile, state.QuoteContact, state.JobContact, state.InvoiceContact, state.StatementContact, state.PrimaryStatementContact, state.PrimaryInvoiceContact, state.PrimaryJobContact, state.PrimaryQuoteContact]);

 
  return (
    <div className="flex flex-col my-20 max-w-screen-md w-full mx-auto">
      <Label className="text-3xl mb-1 text-efg-dark-blue">
        Billing Details
      </Label>
      <span className="text-lg mb-10 text-neutral-500 mb-6">
      Please supply the billing information associated with this service agreement.
      </span>
      <Form {...form}>
        <form className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-2">
            <FormField
              control={form.control}
              name="accountFirstName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="custom-label text-sm">
                    First Name<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Legal First Name"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        state.updateField("accountFirstName", e.target.value);
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
              name="accountLastName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="custom-label text-sm">
                    Last Name<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Legal Last Name"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        state.updateField("accountLastName", e.target.value);
                      }}
                      className="efg-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="accountMobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="custom-label text-sm">
                  Mobile Phone
                </FormLabel>
                <FormControl>
                  <Input
                    maxLength={13}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      state.updateField("accountMobile", e.target.value);
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
            name="accountPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="custom-label text-sm">
                  Office Phone
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    maxLength={13}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      state.updateField("accountPhone", e.target.value);
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
            name="accountEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="custom-label text-sm">
                  Email Address<span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    prefix="+61"
                    placeholder="you@example.com"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      state.updateField("accountEmail", e.target.value);
                    }}
                    className="efg-input"
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  We will send the signed service agreement document to this email address.
                </FormDescription>
              </FormItem>
            )}
          />

          <div className="flex flex-col space-y-4">
            <Label className="custom-label text-sm">Use This Contact For</Label>
            <div className="ml-2 flex flex-row gap-2">
              <div className="w-1/2 flex flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="QuoteContact"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2 ">
                        <Checkbox
                          id="QuoteContact"
                          className="efg-checkbox"
                          checked={field.value}
                          onCheckedChange={(checked: boolean) => {
                            field.onChange(checked);
                            state.updateFieldBoolean("QuoteContact", checked);
                            if (!checked) {
                              form.setValue("PrimaryQuoteContact", false);
                              state.updateFieldBoolean(
                                "PrimaryQuoteContact",
                                false
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor="QuoteContact"
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Quote
                        </label>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {form.watch("QuoteContact") && (
                <div className="w-1/2 flex flex-col space-y-4">
                  <FormField
                    control={form.control}
                    name="PrimaryQuoteContact"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center space-x-2 ">
                          <Checkbox
                            className="efg-checkbox"
                            id="PrimaryQuoteContact"
                            checked={field.value}
                            onCheckedChange={(checked: boolean) => {
                              field.onChange(checked);
                              state.updateFieldBoolean(
                                "PrimaryQuoteContact",
                                checked
                              );
                            }}
                          />
                          <label
                            htmlFor="PrimaryQuoteContact"
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Primary
                          </label>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
            <div className="ml-2 flex flex-row gap-2">
              <div className="w-1/2 flex flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="JobContact"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2 ">
                        <Checkbox
                          className="efg-checkbox"
                          id="JobContact"
                          checked={field.value}
                          onCheckedChange={(checked: boolean) => {
                            field.onChange(checked);
                            state.updateFieldBoolean("JobContact", checked);
                            if (!checked) {
                              form.setValue("PrimaryJobContact", false);
                              state.updateFieldBoolean(
                                "PrimaryJobContact",
                                false
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor="JobContact"
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Job
                        </label>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {form.watch("JobContact") && (
                <div className="w-1/2 flex flex-col space-y-4">
                  <FormField
                    control={form.control}
                    name="PrimaryJobContact"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center space-x-2 ">
                          <Checkbox
                            className="efg-checkbox"
                            id="PrimaryJobContact"
                            checked={field.value}
                            onCheckedChange={(checked: boolean) => {
                              field.onChange(checked);
                              state.updateFieldBoolean(
                                "PrimaryJobContact",
                                checked
                              );
                            }}
                          />
                          <label
                            htmlFor="PrimaryJobContact"
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Primary
                          </label>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
            <div className="ml-2 flex flex-row gap-2">
              <div className="w-1/2 flex flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="InvoiceContact"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2 ">
                        <Checkbox
                          className="efg-checkbox"
                          id="InvoiceContact"
                          checked={field.value}
                          onCheckedChange={(checked: boolean) => {
                            field.onChange(checked);
                            state.updateFieldBoolean("InvoiceContact", checked);
                            if (!checked) {
                              form.setValue("PrimaryInvoiceContact", false);
                              state.updateFieldBoolean(
                                "PrimaryInvoiceContact",
                                false
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor="InvoiceContact"
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Invoice
                        </label>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {form.watch("InvoiceContact") && (
                <div className="w-1/2 flex flex-col space-y-4">
                  <FormField
                    control={form.control}
                    name="PrimaryInvoiceContact"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center space-x-2 ">
                          <Checkbox
                            className="efg-checkbox"
                            id="PrimaryInvoiceContact"
                            checked={field.value}
                            onCheckedChange={(checked: boolean) => {
                              field.onChange(checked);
                              state.updateFieldBoolean(
                                "PrimaryInvoiceContact",
                                checked
                              );
                            }}
                          />
                          <label
                            htmlFor="PrimaryInvoiceContact"
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Primary
                          </label>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
            <div className="ml-2 flex flex-row gap-2">
              <div className="w-1/2 flex flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="StatementContact"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2 ">
                        <Checkbox
                          className="efg-checkbox"
                          id="StatementContact"
                          checked={field.value}
                          onCheckedChange={(checked: boolean) => {
                            field.onChange(checked);
                            state.updateFieldBoolean(
                              "StatementContact",
                              checked
                            );
                            if (!checked) {
                              form.setValue("PrimaryStatementContact", false);
                              state.updateFieldBoolean(
                                "PrimaryStatementContact",
                                false
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor="StatementContact"
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Statement
                        </label>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {form.watch("StatementContact") && (
                <div className="w-1/2 flex flex-col space-y-4">
                  <FormField
                    control={form.control}
                    name="PrimaryStatementContact"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center space-x-2 ">
                          <Checkbox
                            className="efg-checkbox"
                            id="PrimaryStatementContact"
                            checked={field.value}
                            onCheckedChange={(checked: boolean) => {
                              field.onChange(checked);
                              state.updateFieldBoolean(
                                "PrimaryStatementContact",
                                checked
                              );
                            }}
                          />
                          <label
                            htmlFor="PrimaryStatementContact"
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Primary
                          </label>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          </div>
        </form>
      </Form>
      <div className="flex flex-row gap-2 justify-end">
        <Button
          variant="secondary"
          onClick={goBack}
          className="mt-10 w-fit cursor-pointer"
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          className="mt-10 w-fit cursor-pointer"
          variant="efg"
        >
          Continue <ArrowRightIcon />
        </Button>
      </div>
    </div>
  );
}

export default CustomerInformation;
