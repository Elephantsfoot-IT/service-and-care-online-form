"use client";

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
import { AdditionalContact } from "@/lib/interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import React, { useEffect, useImperativeHandle, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";

export type AdditionalContactFormHandle = {
  validate: () => Promise<boolean>;
  getData: () => AdditionalContact;
};

interface AdditionalcontactFormProps {
  contact: AdditionalContact; // includes: id: string
  index: number;
  handleDelete: (id: string) => void;
  handleChange: (data: AdditionalContact) => void; // updates the store for this contact
}

const FormSchema = z
  .object({
    GivenName: z.string().min(1, { message: "Given name cannot be empty" }),
    FamilyName: z.string().min(1, { message: "Family name cannot be empty" }),
    Email: z.string(),
    WorkPhone: z.string(),
    CellPhone: z.string(),
    Position: z.string().optional().or(z.literal("")),
    Department: z.string().optional().or(z.literal("")),
    QuoteContact: z.boolean(),
    JobContact: z.boolean(),
    InvoiceContact: z.boolean(),
    StatementContact: z.boolean(),
    PrimaryStatementContact: z.boolean(),
    PrimaryInvoiceContact: z.boolean(),
    PrimaryJobContact: z.boolean(),
    PrimaryQuoteContact: z.boolean(),
  })
  .refine((data) => data.WorkPhone || data.CellPhone || data.Email, {
    message:
      "At least one contact number (Office, Mobile) or Email must be provided.",
    path: ["WorkPhone"],
  });

type FormValues = z.infer<typeof FormSchema>;

const AdditionalcontactForm = React.forwardRef<
  AdditionalContactFormHandle,
  AdditionalcontactFormProps
>(({ contact, index, handleDelete, handleChange }, ref) => {
  const ContactForm = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      GivenName: contact.GivenName ?? "",
      FamilyName: contact.FamilyName ?? "",
      Email: contact.Email ?? "",
      WorkPhone: contact.WorkPhone ?? "",
      CellPhone: contact.CellPhone ?? "",
      Position: contact.Position ?? "",
      Department: contact.Department ?? "",
      QuoteContact: !!contact.QuoteContact,
      JobContact: !!contact.JobContact,
      InvoiceContact: !!contact.InvoiceContact,
      StatementContact: !!contact.StatementContact,
      PrimaryStatementContact: !!contact.PrimaryStatementContact,
      PrimaryInvoiceContact: !!contact.PrimaryInvoiceContact,
      PrimaryJobContact: !!contact.PrimaryJobContact,
      PrimaryQuoteContact: !!contact.PrimaryQuoteContact,
    },
  });

  // Keep RHF in sync if parent updates the contact object
  useEffect(() => {
    ContactForm.reset({
      GivenName: contact.GivenName ?? "",
      FamilyName: contact.FamilyName ?? "",
      Email: contact.Email ?? "",
      WorkPhone: contact.WorkPhone ?? "",
      CellPhone: contact.CellPhone ?? "",
      Position: contact.Position ?? "",
      Department: contact.Department ?? "",
      QuoteContact: !!contact.QuoteContact,
      JobContact: !!contact.JobContact,
      InvoiceContact: !!contact.InvoiceContact,
      StatementContact: !!contact.StatementContact,
      PrimaryStatementContact: !!contact.PrimaryStatementContact,
      PrimaryInvoiceContact: !!contact.PrimaryInvoiceContact,
      PrimaryJobContact: !!contact.PrimaryJobContact,
      PrimaryQuoteContact: !!contact.PrimaryQuoteContact,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contact]);

  // Expose validate() & getData() to parent
  const rootRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => ({
    validate: async () => {
      const ok = await ContactForm.trigger();
      if (!ok) {
        rootRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return ok;
    },
    getData: () => ({
      ...contact,
      ...(ContactForm.getValues() as AdditionalContact),
    }),
  }));

  // Helper: update a single field in the parent store for this contact
  const update =
    <K extends keyof AdditionalContact>(key: K) =>
    (value: AdditionalContact[K]) =>
      handleChange({ ...contact, [key]: value });

  // --- useWatch for the four parent toggles ---
  const quoteOn = useWatch({
    control: ContactForm.control,
    name: "QuoteContact",
  });
  const jobOn = useWatch({ control: ContactForm.control, name: "JobContact" });
  const invoiceOn = useWatch({
    control: ContactForm.control,
    name: "InvoiceContact",
  });
  const statementOn = useWatch({
    control: ContactForm.control,
    name: "StatementContact",
  });

  // Auto-unset Primary when the parent toggle turns off
  useEffect(() => {
    if (!quoteOn) {
      ContactForm.setValue("PrimaryQuoteContact", false, {
        shouldDirty: true,
        shouldValidate: true,
      });
      update("PrimaryQuoteContact")(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteOn]);

  useEffect(() => {
    if (!jobOn) {
      ContactForm.setValue("PrimaryJobContact", false, {
        shouldDirty: true,
        shouldValidate: true,
      });
      update("PrimaryJobContact")(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobOn]);

  useEffect(() => {
    if (!invoiceOn) {
      ContactForm.setValue("PrimaryInvoiceContact", false, {
        shouldDirty: true,
        shouldValidate: true,
      });
      update("PrimaryInvoiceContact")(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceOn]);

  useEffect(() => {
    if (!statementOn) {
      ContactForm.setValue("PrimaryStatementContact", false, {
        shouldDirty: true,
        shouldValidate: true,
      });
      update("PrimaryStatementContact")(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statementOn]);

  return (
    <div
      ref={rootRef}
      className="flex flex-col w-full mx-auto rounded-lg border border-input shadow-xs overflow-hidden"
    >
      <div className="flex flex-row justify-between w-full items-center p-4 md:p-6 2xl:p-8 border-b border-input bg-neutral-75">
        <Label className="text-base">Contact ({index + 1})</Label>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDelete(contact.id!)}
        >
          <XIcon />
        </Button>
      </div>

      <Form {...ContactForm}>
        <form className="flex flex-col gap-6 p-4 md:p-6 2xl:p-8">
          {/* Full name */}
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
            <Label className="w-full md:w-1/3 text-sm">
              Full name <span className="text-red-500">*</span>
            </Label>
            <div className="w-full md:w-2/3 flex flex-row space-x-2">
              <FormField
                control={ContactForm.control}
                name="GivenName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="First name"
                        className="efg-input"
                        maxLength={20}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          update("GivenName")(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={ContactForm.control}
                name="FamilyName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Last name"
                        className="efg-input"
                        maxLength={20}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          update("FamilyName")(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Position */}
          <FormField
            control={ContactForm.control}
            name="Position"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
                <FormLabel className="text-sm w-full md:w-1/3">
                  Position
                </FormLabel>
                <div className="w-full md:w-2/3">
                  <FormControl>
                    <Input
                      className="efg-input"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        update("Position")(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Department */}
          <FormField
            control={ContactForm.control}
            name="Department"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
                <FormLabel className="text-sm w-full md:w-1/3">
                  Department
                </FormLabel>
                <div className="w-full md:w-2/3">
                  <FormControl>
                    <Input
                      className="efg-input"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        update("Department")(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={ContactForm.control}
            name="Email"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
                <FormLabel className="text-sm w-full md:w-1/3">
                  Email address
                </FormLabel>
                <div className="w-full md:w-2/3">
                  <FormControl>
                    <Input
                      className="efg-input"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        update("Email")(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Mobile */}
          <FormField
            control={ContactForm.control}
            name="CellPhone"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
                <FormLabel className="text-sm w-full md:w-1/3">
                  Mobile phone
                </FormLabel>
                <div className="w-full md:w-2/3">
                  <FormControl>
                    <Input
                      maxLength={13}
                      className="efg-input"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        update("CellPhone")(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Office */}
          <FormField
            control={ContactForm.control}
            name="WorkPhone"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
                <FormLabel className="text-sm w-full md:w-1/3">
                  Office phone
                </FormLabel>
                <div className="w-full md:w-2/3">
                  <FormControl>
                    <Input
                      maxLength={13}
                      className="efg-input"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        update("WorkPhone")(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Use this contact for */}
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
            <Label className="text-sm w-full md:w-1/3">
              Use this contact for
            </Label>
            <div className="w-full md:w-2/3 flex flex-col">
              <div className="flex flex-col gap-4">
                {/* Quote */}
                <div className="flex flex-row gap-2">
                  <div className="w-1/2">
                    <FormField
                      control={ContactForm.control}
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
                                update("QuoteContact")(checked);
                              }}
                            />
                            <label
                              htmlFor="QuoteContact"
                              className="text-sm leading-none"
                            >
                              Quote
                            </label>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {quoteOn && (
                    <div className="w-1/2">
                      <FormField
                        control={ContactForm.control}
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
                                  update("PrimaryQuoteContact")(checked);
                                }}
                              />
                              <label
                                htmlFor="PrimaryQuoteContact"
                                className={`text-sm leading-none ${
                                  !quoteOn ? "opacity-50" : ""
                                }`}
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

                {/* Job */}
                <div className="flex flex-row gap-2">
                  <div className="w-1/2">
                    <FormField
                      control={ContactForm.control}
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
                                update("JobContact")(checked);
                              }}
                            />
                            <label
                              htmlFor="JobContact"
                              className="text-sm leading-none"
                            >
                              Job
                            </label>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {jobOn && (
                    <div className="w-1/2">
                      <FormField
                        control={ContactForm.control}
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
                                  update("PrimaryJobContact")(checked);
                                }}
                              />
                              <label
                                htmlFor="PrimaryJobContact"
                                className={`text-sm leading-none ${
                                  !jobOn ? "opacity-50" : ""
                                }`}
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

                {/* Invoice */}
                <div className="flex flex-row gap-2">
                  <div className="w-1/2">
                    <FormField
                      control={ContactForm.control}
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
                                update("InvoiceContact")(checked);
                              }}
                            />
                            <label
                              htmlFor="InvoiceContact"
                              className="text-sm leading-none"
                            >
                              Invoice
                            </label>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {invoiceOn && (
                    <div className="w-1/2">
                      <FormField
                        control={ContactForm.control}
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
                                  update("PrimaryInvoiceContact")(checked);
                                }}
                              />
                              <label
                                htmlFor="PrimaryInvoiceContact"
                                className={`text-sm leading-none ${
                                  !invoiceOn ? "opacity-50" : ""
                                }`}
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

                {/* Statement */}
                <div className="flex flex-row gap-2">
                  <div className="w-1/2">
                    <FormField
                      control={ContactForm.control}
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
                                update("StatementContact")(checked);
                              }}
                            />
                            <label
                              htmlFor="StatementContact"
                              className="text-sm leading-none"
                            >
                              Statement
                            </label>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {statementOn && (
                    <div className="w-1/2">
                      <FormField
                        control={ContactForm.control}
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
                                  update("PrimaryStatementContact")(checked);
                                }}
                              />
                              <label
                                htmlFor="PrimaryStatementContact"
                                className={`text-sm leading-none ${
                                  !statementOn ? "opacity-50" : ""
                                }`}
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

              <p className="text-sm text-muted-foreground mt-4 ml-1">
                Set the communications this contact receives.
              </p>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
});

AdditionalcontactForm.displayName = "AdditionalcontactForm";
export default AdditionalcontactForm;
