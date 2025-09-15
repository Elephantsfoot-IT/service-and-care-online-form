"use client";
import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { scrollToTop } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const billingSchema = z
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

    companyName: z.string().min(1, "This field cannot be empty"),
    abn: z.string().regex(/^\d{11}$/, {
      message:
        "ABN must be exactly 11 digits with no spaces or special characters.",
    }),

    companyType: z.string().min(1, "Company type cannot be empty"),
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

    QuoteContact: z.boolean(),
    JobContact: z.boolean(),
    InvoiceContact: z.boolean(),
    StatementContact: z.boolean(),
    PrimaryStatementContact: z.boolean(),
    PrimaryInvoiceContact: z.boolean(),
    PrimaryJobContact: z.boolean(),
    PrimaryQuoteContact: z.boolean(),

    postalStreetAddress: z
      .string()
      .min(1, { message: "Postal street address cannot be empty" }),
    postalCity: z.string().min(1, { message: "Postal city cannot be empty" }),
    postalState: z.string().min(1, { message: "Postal state cannot be empty" }),
    postalPostcode: z.string().regex(/^\d{4}$/, {
      message: "Business postcode must be exactly 4 digits",
    }),
    postalCountry: z.string(),
  })
  .superRefine((data, ctx) => {
    const hasAnyPhone =
      Boolean(data.accountPhone) || Boolean(data.accountMobile);
    if (!hasAnyPhone) {
      const message =
        "At least one contact number (Office Phone or Mobile Phone) must be provided.";
      ctx.addIssue({ code: "custom", message, path: ["accountMobile"] });
      ctx.addIssue({ code: "custom", message, path: ["accountPhone"] });
    }
  });

type CustomerInformationFormType = z.infer<typeof billingSchema>;

function CustomerInformation() {
  const form = useForm<z.infer<typeof billingSchema>>({
    resolver: zodResolver(billingSchema), // Dyn
    mode: "onChange", // Trigger validation on change
    defaultValues: {
      companyName: "",
      abn: "",
      companyType: "",
      businessStreetAddress: "",
      businessCity: "",
      businessState: "",
      businessPostcode: "",
      businessCountry: "",

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

  const state = useServiceAgreementStore();
  const goBack = () => {
    state.setPage(1);
  };
  const handleSubmit = () => {
    form.handleSubmit((data) => {
      state.setPage(3);
    })();
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
    form.setValue("postalStreetAddress", state.postalStreetAddress);
    form.setValue("postalCity", state.postalCity);
    form.setValue("postalState", state.postalState);
    form.setValue("postalPostcode", state.postalPostcode);
    form.setValue("postalCountry", state.postalCountry);
    form.setValue("companyName", state.companyName);
    form.setValue("abn", state.abn);
    form.setValue("companyType", state.companyType);
    form.setValue("businessStreetAddress", state.businessStreetAddress);
    form.setValue("businessCity", state.businessCity);
    form.setValue("businessState", state.businessState);
    form.setValue("businessPostcode", state.businessPostcode);
  }, [
    state.accountFirstName,
    state.accountLastName,
    state.accountEmail,
    state.accountPhone,
    state.accountMobile,
    state.QuoteContact,
    state.JobContact,
    state.InvoiceContact,
    state.StatementContact,
    state.PrimaryStatementContact,
    state.PrimaryInvoiceContact,
    state.PrimaryJobContact,
    state.PrimaryQuoteContact,
    state.postalStreetAddress,
    state.postalCity,
    state.postalState,
    state.postalPostcode,
    state.postalCountry,
    state.companyName,
    state.abn,
    state.companyType,
    state.businessStreetAddress,
    state.businessCity,
    state.businessState,
    state.businessPostcode,
  ]);

  function handleChange(field: string, value: string): void {
    state.updateField(field, value);
  }

  useEffect(() => {
    scrollToTop();
  }, []);

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      form.setValue("postalStreetAddress", state.businessStreetAddress);
      form.setValue("postalCity", state.businessCity);
      form.setValue("postalPostcode", state.businessPostcode);
      form.setValue("postalState", state.businessState);
      handleChange("postalStreetAddress", state.businessStreetAddress);
      handleChange("postalCity", state.businessCity);
      handleChange("postalPostcode", state.businessPostcode);
      handleChange("postalState", state.businessState);
    }
    state.setSameAddress(checked);
  };

  return (
    <div className="flex flex-col  max-w-screen-md w-full mx-auto">
      <Form {...form}>
        <form className="flex flex-col gap-6 ">
          <div className="flex flex-col  mt-10">
            <Label className="text-xl mb-1 text-efg-dark-blue">
              Company Details
            </Label>

            <span className="text-base  text-neutral-500 font-normal">
              Please provide information about your company.
            </span>
          </div>
          <hr className="border-neutral-300 border-dashed "></hr>
          <FormField
            control={form.control}
            name="companyType"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6 ">
                <FormLabel className="text-sm w-full md:w-1/3">
                  Company type<span className="text-red-500">*</span>
                </FormLabel>
                <div className="w-full md:w-2/3">
                  <Select
                    onValueChange={(e) => {
                      field.onChange(e);
                      if (e == "Other") {
                        handleChange("strataPlanNumber", "");
                      }
                      handleChange("companyType", e);
                    }}
                    value={state.companyType}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border border-neutral-200">
                      <SelectItem value="Strata management">
                        Strata management
                      </SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <hr className="border-neutral-300 border-dashed "></hr>

          <FormField
            control={form.control}
            name="abn"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6 ">
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
                        handleChange("abn", e.target.value);
                        // handleABNchange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription className="mt-2 ml-1">
                    Your 11-digit ABN will be verified using the ABN lookup
                    service.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <hr className="border-neutral-300 border-dashed "></hr>
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6 ">
                {form.watch("companyType") != "Strata management" && (
                  <FormLabel className="custom-label text-sm w-full md:w-1/3">
                    Company name
                    <span className="text-red-500">*</span>
                  </FormLabel>
                )}
                {form.watch("companyType") === "Strata management" && (
                  <FormLabel className="custom-label text-sm w-full md:w-1/3">
                    Strata plan number (CTS/SP/OC)
                    <span className="text-red-500">*</span>
                  </FormLabel>
                )}
                <div className="w-full md:w-2/3">
                  <FormControl>
                    <Input
                      placeholder={
                        form.watch("companyType") === "Strata management"
                          ? "CTS / SP / OC 112233"
                          : ""
                      }
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleChange("companyName", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {form.watch("companyType") === "Strata management" && (
                    <FormDescription className="mt-2 ml-1">
                      Enter your strata plan number with its prefix, e.g.{" "}
                      <b>CTS 123456</b>, <b>SP 123456</b>, or <b>OC 123456</b>.
                    </FormDescription>
                  )}
                </div>
              </FormItem>
            )}
          />
          <hr className="border-neutral-300 border-dashed "></hr>
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6 ">
            <Label className="custom-label mb-2 text-sm w-full md:w-1/3">
              Company address <span className="text-red-500">*</span>
            </Label>
            <div className="w-full md:w-2/3">
              <MultiLineAddressInput<CustomerInformationFormType>
                fieldNames={{
                  street: "businessStreetAddress",
                  city: "businessCity",
                  state: "businessState",
                  postcode: "businessPostcode",
                  country: "businessCountry",
                }}
                handleChange={handleChange}
                stateSelectValue={state.businessState}
              />
            </div>
          </div>

          <div className="flex flex-col  mt-10">
            <Label className="text-xl mb-1 text-efg-dark-blue">
              Billing Details
            </Label>

            <span className="text-base  text-neutral-500 font-normal">
              Please supply the billing information associated with this service
              agreement.
            </span>
          </div>

          <hr className="border-neutral-300 border-dashed "></hr>
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6 ">
            <Label className="w-full md:w-1/3 text-sm">
              Full name<span className="text-red-500">*</span>
            </Label>
            <div className="w-full md:w-2/3 flex flex-row  space-x-2">
              <FormField
                control={form.control}
                name="accountFirstName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="First Name"
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
                    <FormControl>
                      <Input
                        placeholder="Last Name"
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
          </div>

          <hr className="border-neutral-300 border-dashed "></hr>
          <FormField
            control={form.control}
            name="accountEmail"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6 ">
                <FormLabel
                  className="text-sm w-full md:w-1/3"
                  htmlFor="accountEmail"
                >
                  Email address<span className="text-red-500">*</span>
                </FormLabel>
                <div className="w-full md:w-2/3">
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
                  <FormDescription className="ml-1 mt-2">
                    We will send the signed service agreement document to this
                    email address.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <hr className="border-neutral-300 border-dashed "></hr>

          <FormField
            control={form.control}
            name="accountMobile"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6 ">
                <FormLabel
                  className=" text-sm w-full md:w-1/3"
                  htmlFor="accountMobile"
                >
                  Mobile phone
                </FormLabel>
                <div className="w-full md:w-2/3">
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
                </div>
              </FormItem>
            )}
          />
          <hr className="border-neutral-300 border-dashed "></hr>
          <FormField
            control={form.control}
            name="accountPhone"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6 ">
                <FormLabel
                  className="text-sm w-full md:w-1/3"
                  htmlFor="accountPhone"
                >
                  Office phone
                </FormLabel>
                <div className="w-full md:w-2/3">
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
                </div>
              </FormItem>
            )}
          />

          <hr className="border-neutral-300 border-dashed "></hr>

          <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6 ">
            <Label className=" text-sm mb-2 w-full md:w-1/3">
              Postal address<span className="text-red-500">*</span>
            </Label>

            <div className="w-full md:w-2/3">
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  checked={state.sameAddres}
                  onCheckedChange={handleCheckboxChange}
                  className="efg-checkbox"
                />
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-neutral-600">
                  Use Company Address
                </label>
              </div>
              <MultiLineAddressInput<CustomerInformationFormType>
                fieldNames={{
                  street: "postalStreetAddress",
                  city: "postalCity",
                  state: "postalState",
                  postcode: "postalPostcode",
                  country: "postalCountry",
                }}
                handleChange={handleChange}
                stateSelectValue={state.postalState}
                disabled={state.sameAddres}
              />
            </div>
          </div>

          <hr className="border-neutral-300 border-dashed "></hr>

          <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6 ">
            <Label className="text-sm w-full md:w-1/3">
              Use this contact for
            </Label>
            <div className="w-full md:w-2/3 flex flex-col gap-4">
              <div className=" flex flex-row gap-2">
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
              <div className=" flex flex-row gap-2">
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
              <div className=" flex flex-row gap-2">
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
                              state.updateFieldBoolean(
                                "InvoiceContact",
                                checked
                              );
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
              <div className=" flex flex-row gap-2">
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
          </div>
        </form>
      </Form>

      <div className="flex flex-row gap-2 justify-between mt-20">
        <Button variant="outline" onClick={goBack} className="cursor-pointer">
          <ArrowLeftIcon></ArrowLeftIcon> Back
        </Button>
        <Button
          onClick={handleSubmit}
          className=" w-[200px] cursor-pointer"
          variant="efg"
        >
          Continue <ArrowRightIcon />
        </Button>
      </div>
    </div>
  );
}

export default CustomerInformation;
