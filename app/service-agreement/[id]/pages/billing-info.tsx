"use client";
import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MultiLineAddressInput from "@/components/ui/multi-line-address-input";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { scrollToTop } from "@/lib/utils";

const billingSchema = z
  .object({
    accountFirstName: z.string().min(1, { message: "First name cannot be empty" }),
    accountLastName: z.string().min(1, { message: "Last name cannot be empty" }),
    accountEmail: z.string().email({ message: "Please enter a valid email address." }),
    accountPhone: z
      .string()
      .regex(/^[+]?[0-9]+$/, {
        message: "Phone number can only contain digits and an optional '+' at the beginning.",
      })
      .optional()
      .or(z.literal("")),
    accountMobile: z
      .string()
      .regex(/^(\+614|04)\d{8}$/, {
        message: "Phone number must start with '04' or '+614' and contain 8 digits after that.",
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
    postalStreetAddress: z.string().min(1, { message: "Postal street address cannot be empty" }),
    postalCity: z.string().min(1, { message: "Postal city cannot be empty" }),
    postalState: z.string().min(1, { message: "Postal state cannot be empty" }),
    postalPostcode: z.string().regex(/^\d{4}$/, { message: "Business postcode must be exactly 4 digits" }),
    postalCountry: z.string(),
  })
  .superRefine((data, ctx) => {
    const hasAnyPhone = Boolean(data.accountPhone) || Boolean(data.accountMobile);
    if (!hasAnyPhone) {
      const message = "At least one contact number (Office phone or Mobile phone) must be provided.";
      ctx.addIssue({ code: "custom", message, path: ["accountMobile"] });
      ctx.addIssue({ code: "custom", message, path: ["accountPhone"] });
    }
  });

export type BillingDetailsFormType = z.infer<typeof billingSchema>;

export default function BillingDetails() {
  const state = useServiceAgreementStore();

  const form = useForm<BillingDetailsFormType>({
    resolver: zodResolver(billingSchema),
    mode: "onChange",
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
      postalStreetAddress: "",
      postalCity: "",
      postalState: "",
      postalPostcode: "",
      postalCountry: "",
    },
  });

  useEffect(() => {
    // hydrate from store
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
    form.setValue("postalStreetAddress", state.postalStreetAddress);
    form.setValue("postalCity", state.postalCity);
    form.setValue("postalState", state.postalState);
    form.setValue("postalPostcode", state.postalPostcode);
    form.setValue("postalCountry", state.postalCountry);
    scrollToTop();
  }, []); // eslint-disable-line

  const onChange = (field: keyof BillingDetailsFormType, value: string | boolean) => {
    if (typeof value === "boolean") state.updateFieldBoolean(field as string, value);
    else state.updateField(field as string, value);
  };

  const handleCopyCompanyToPostal = (checked: boolean) => {
    state.setSameAddress(checked);
    if (checked) {
      form.setValue("postalStreetAddress", state.businessStreetAddress);
      form.setValue("postalCity", state.businessCity);
      form.setValue("postalPostcode", state.businessPostcode);
      form.setValue("postalState", state.businessState);
      onChange("postalStreetAddress", state.businessStreetAddress);
      onChange("postalCity", state.businessCity);
      onChange("postalPostcode", state.businessPostcode);
      onChange("postalState", state.businessState);
    }
  };

  const goBack = () => state.setPage(2);         // back to CustomerDetails
  const goNext = () =>
    form.handleSubmit(() => {
      state.setPage(4);                           // forward to SiteInfo
    })();

  return (
    <div className="flex flex-col w-full mx-auto">
      <Form {...form}>
        <form className="flex flex-col gap-6">
          <div className="flex flex-col ">
            <Label className="text-xl mb-1 text-efg-dark-blue">Billing Details</Label>
            <span className="text-base text-neutral-500 font-normal">
              Please supply the billing information associated with this service agreement.
            </span>
          </div>

          <hr className="border-neutral-300 border-dashed" />

          {/* Full name */}
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
            <Label className="w-full md:w-1/3 text-sm">
              Full name<span className="text-red-500">*</span>
            </Label>
            <div className="w-full md:w-2/3 flex flex-row space-x-2">
              <FormField
                control={form.control}
                name="accountFirstName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="First name"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          onChange("accountFirstName", e.target.value);
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
                    <FormControl>
                      <Input
                        placeholder="Last name"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          onChange("accountLastName", e.target.value);
                        }}
                         className="efg-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <hr className="border-neutral-300 border-dashed" />

          {/* Email */}
          <FormField
            control={form.control}
            name="accountEmail"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
                <FormLabel className="text-sm w-full md:w-1/3" htmlFor="accountEmail">
                  Email address<span className="text-red-500">*</span>
                </FormLabel>
                <div className="w-full md:w-2/3">
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        onChange("accountEmail", e.target.value);
                      }}
                       className="efg-input"
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription className="ml-1 mt-2">
                    We will send the signed service agreement document to this email address.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <hr className="border-neutral-300 border-dashed" />

          {/* Phones */}
          <FormField
            control={form.control}
            name="accountMobile"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
                <FormLabel className="text-sm w-full md:w-1/3" htmlFor="accountMobile">
                  Mobile phone
                </FormLabel>
                <div className="w-full md:w-2/3">
                  <FormControl>
                    <Input
                      maxLength={13}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        onChange("accountMobile", e.target.value);
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
            name="accountPhone"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
                <FormLabel className="text-sm w-full md:w-1/3" htmlFor="accountPhone">
                  Office phone
                </FormLabel>
                <div className="w-full md:w-2/3">
                  <FormControl>
                    <Input
                      maxLength={13}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        onChange("accountPhone", e.target.value);
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

          {/* Postal */}
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
            <Label className="text-sm mb-2 w-full md:w-1/3">
              Postal address<span className="text-red-500">*</span>
            </Label>
            <div className="w-full md:w-2/3">
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  checked={state.sameAddres}
                  onCheckedChange={(c: boolean) => handleCopyCompanyToPostal(c)}
                  className="efg-checkbox"
                />
                <label className="text-sm font-medium text-neutral-600">Use Company Address</label>
              </div>
              <MultiLineAddressInput<BillingDetailsFormType>
                fieldNames={{
                  street: "postalStreetAddress",
                  city: "postalCity",
                  state: "postalState",
                  postcode: "postalPostcode",
                  country: "postalCountry",
                }}
                handleChange={(f, v) => onChange(f as keyof BillingDetailsFormType, v)}
                stateSelectValue={state.postalState}
                disabled={state.sameAddres}
              />
            </div>
          </div>

          <hr className="border-neutral-300 border-dashed" />

          {/* Use this contact for */}
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
            <Label className="text-sm w-full md:w-1/3">Use this contact for</Label>
            <div className="w-full md:w-2/3 flex flex-col gap-4">
              {/* Quote */}
              <div className="flex flex-row gap-2">
                <div className="w-1/2">
                  <FormField
                    control={form.control}
                    name="QuoteContact"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="QuoteContact"
                            className="efg-checkbox"
                            checked={field.value}
                            onCheckedChange={(checked: boolean) => {
                              field.onChange(checked);
                              onChange("QuoteContact", checked);
                              if (!checked) {
                                form.setValue("PrimaryQuoteContact", false);
                                onChange("PrimaryQuoteContact", false);
                              }
                            }}
                          />
                          <label htmlFor="QuoteContact" className="text-sm leading-none">
                            Quote
                          </label>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {form.watch("QuoteContact") && (
                  <div className="w-1/2">
                    <FormField
                      control={form.control}
                      name="PrimaryQuoteContact"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="PrimaryQuoteContact"
                              className="efg-checkbox"
                              checked={field.value}
                              onCheckedChange={(checked: boolean) => {
                                field.onChange(checked);
                                onChange("PrimaryQuoteContact", checked);
                              }}
                            />
                            <label htmlFor="PrimaryQuoteContact" className="text-sm leading-none">
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

              {/* Job */}
              <div className="flex flex-row gap-2">
                <div className="w-1/2">
                  <FormField
                    control={form.control}
                    name="JobContact"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="JobContact"
                            className="efg-checkbox"
                            checked={field.value}
                            onCheckedChange={(checked: boolean) => {
                              field.onChange(checked);
                              onChange("JobContact", checked);
                              if (!checked) {
                                form.setValue("PrimaryJobContact", false);
                                onChange("PrimaryJobContact", false);
                              }
                            }}
                          />
                          <label htmlFor="JobContact" className="text-sm leading-none">
                            Job
                          </label>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {form.watch("JobContact") && (
                  <div className="w-1/2">
                    <FormField
                      control={form.control}
                      name="PrimaryJobContact"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="PrimaryJobContact"
                              className="efg-checkbox"
                              checked={field.value}
                              onCheckedChange={(checked: boolean) => {
                                field.onChange(checked);
                                onChange("PrimaryJobContact", checked);
                              }}
                            />
                            <label htmlFor="PrimaryJobContact" className="text-sm leading-none">
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

              {/* Invoice */}
              <div className="flex flex-row gap-2">
                <div className="w-1/2">
                  <FormField
                    control={form.control}
                    name="InvoiceContact"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="InvoiceContact"
                            className="efg-checkbox"
                            checked={field.value}
                            onCheckedChange={(checked: boolean) => {
                              field.onChange(checked);
                              onChange("InvoiceContact", checked);
                              if (!checked) {
                                form.setValue("PrimaryInvoiceContact", false);
                                onChange("PrimaryInvoiceContact", false);
                              }
                            }}
                          />
                          <label htmlFor="InvoiceContact" className="text-sm leading-none">
                            Invoice
                          </label>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {form.watch("InvoiceContact") && (
                  <div className="w-1/2">
                    <FormField
                      control={form.control}
                      name="PrimaryInvoiceContact"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="PrimaryInvoiceContact"
                              className="efg-checkbox"
                              checked={field.value}
                              onCheckedChange={(checked: boolean) => {
                                field.onChange(checked);
                                onChange("PrimaryInvoiceContact", checked);
                              }}
                            />
                            <label htmlFor="PrimaryInvoiceContact" className="text-sm leading-none">
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

              {/* Statement */}
              <div className="flex flex-row gap-2">
                <div className="w-1/2">
                  <FormField
                    control={form.control}
                    name="StatementContact"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="StatementContact"
                            className="efg-checkbox"
                            checked={field.value}
                            onCheckedChange={(checked: boolean) => {
                              field.onChange(checked);
                              onChange("StatementContact", checked);
                              if (!checked) {
                                form.setValue("PrimaryStatementContact", false);
                                onChange("PrimaryStatementContact", false);
                              }
                            }}
                          />
                          <label htmlFor="StatementContact" className="text-sm leading-none">
                            Statement
                          </label>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {form.watch("StatementContact") && (
                  <div className="w-1/2">
                    <FormField
                      control={form.control}
                      name="PrimaryStatementContact"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="PrimaryStatementContact"
                              className="efg-checkbox"
                              checked={field.value}
                              onCheckedChange={(checked: boolean) => {
                                field.onChange(checked);
                                onChange("PrimaryStatementContact", checked);
                              }}
                            />
                            <label htmlFor="PrimaryStatementContact" className="text-sm leading-none">
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
