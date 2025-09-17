"use client";

import React, { useEffect, useImperativeHandle, useRef } from "react";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AdditionalContact } from "@/lib/interface";
import { Trash2Icon } from "lucide-react";
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

const FormSchema = z.object({
  GivenName: z.string().min(1, { message: "Given name cannot be empty" }),
  FamilyName: z.string().min(1, { message: "Family name cannot be empty" }),
  Email: z.string(),                // (you allowed empty email in your last snippet)
  WorkPhone: z.string(),            // (and empty phones)
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
}).refine((data) => data.WorkPhone || data.CellPhone || data.Email, {
  message: "At least one contact number (Office, Mobile) or Email must be provided.",
  path: ["WorkPhone"],
});

const AdditionalcontactForm = React.forwardRef<AdditionalContactFormHandle, AdditionalcontactFormProps>(
  ({ contact, index, handleDelete, handleChange }, ref) => {
    const ContactForm = useForm<z.infer<typeof FormSchema>>({
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
      const fields = Object.keys(ContactForm.getValues()) as (keyof z.infer<typeof FormSchema>)[];
      fields.forEach((f) => ContactForm.setValue(f, (contact as AdditionalContact)[f]));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contact]);

    // Expose validate() & getData() to parent
    const rootRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => ({
      validate: async () => {
        const ok = await ContactForm.trigger();
        if (!ok) {
          // Bring invalid form into view
          rootRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return ok;
      },
      getData: () => ({ ...contact, ...(ContactForm.getValues() as AdditionalContact) }),
    }));

    // Helper: update a single field in the parent store for this contact
    const update = <K extends keyof AdditionalContact>(key: K) =>
      (value: AdditionalContact[K]) =>
        handleChange({ ...contact, [key]: value });

    // Local UI toggles (no useWatch) for showing "Primary" checkboxes
    const [toggles, setToggles] = React.useState({
      quote: !!contact.QuoteContact,
      job: !!contact.JobContact,
      invoice: !!contact.InvoiceContact,
      statement: !!contact.StatementContact,
    });

    // Keep toggles aligned if parent contact changes
    useEffect(() => {
      setToggles({
        quote: !!contact.QuoteContact,
        job: !!contact.JobContact,
        invoice: !!contact.InvoiceContact,
        statement: !!contact.StatementContact,
      });
    }, [contact.QuoteContact, contact.JobContact, contact.InvoiceContact, contact.StatementContact]);

    const handleParentToggle = (kind: keyof typeof toggles, checked: boolean) => {
      setToggles((t) => ({ ...t, [kind]: checked }));
      if (!checked) {
        const primaryFieldMap: Record<keyof typeof toggles, keyof AdditionalContact> = {
          quote: "PrimaryQuoteContact",
          job: "PrimaryJobContact",
          invoice: "PrimaryInvoiceContact",
          statement: "PrimaryStatementContact",
        };
        ContactForm.setValue(primaryFieldMap[kind] as keyof z.infer<typeof FormSchema>, false, { shouldDirty: true, shouldTouch: true });
        update(primaryFieldMap[kind])(false as unknown as AdditionalContact[keyof AdditionalContact]);
      }
    };

    return (
      <div ref={rootRef} className="flex flex-col w-full mx-auto p-4 md:p-6 2xl:p-8  shadow-xs border border-neutral-200 rounded-md shadow-sm">
        <Form {...ContactForm}>
          <form className="flex flex-col gap-6">
            {/* Heading */}
            <div className="flex flex-row justify-between w-full items-center">
              <Label className="text-base">Additional Contact ({index + 1})</Label>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(contact.id!)}>
                <Trash2Icon />
              </Button>
            </div>

            <hr className="border-neutral-300 border-dashed" />

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

            <hr className="border-neutral-300 border-dashed" />

            {/* Position */}
            <FormField
              control={ContactForm.control}
              name="Position"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
                  <FormLabel className="text-sm w-full md:w-1/3">Position</FormLabel>
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
                  <FormLabel className="text-sm w-full md:w-1/3">Department</FormLabel>
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

            <hr className="border-neutral-300 border-dashed" />

            {/* Email */}
            <FormField
              control={ContactForm.control}
              name="Email"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
                  <FormLabel className="text-sm w-full md:w-1/3">Email address</FormLabel>
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

            <hr className="border-neutral-300 border-dashed" />

            {/* Mobile */}
            <FormField
              control={ContactForm.control}
              name="CellPhone"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
                  <FormLabel className="text-sm w-full md:w-1/3">Mobile phone</FormLabel>
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

            <hr className="border-neutral-300 border-dashed" />

            {/* Office */}
            <FormField
              control={ContactForm.control}
              name="WorkPhone"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
                  <FormLabel className="text-sm w-full md:w-1/3">Office phone</FormLabel>
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

            

            <hr className="border-neutral-300 border-dashed" />

            {/* Use this contact for */}
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
              <Label className="text-sm w-full md:w-1/3">Use this contact for</Label>
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
                                handleParentToggle("quote", checked);
                                update("QuoteContact")(checked);
                                if (!checked) {
                                  ContactForm.setValue("PrimaryQuoteContact", false, { shouldDirty: true, shouldTouch: true });
                                  update("PrimaryQuoteContact")(false);
                                }
                              }}
                            />
                            <label htmlFor="QuoteContact" className="text-sm leading-none">Quote</label>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {toggles.quote && (
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
                              <label htmlFor="PrimaryQuoteContact" className="text-sm leading-none">Primary</label>
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
                                handleParentToggle("job", checked);
                                update("JobContact")(checked);
                                if (!checked) {
                                  ContactForm.setValue("PrimaryJobContact", false, { shouldDirty: true, shouldTouch: true });
                                  update("PrimaryJobContact")(false);
                                }
                              }}
                            />
                            <label htmlFor="JobContact" className="text-sm leading-none">Job</label>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {toggles.job && (
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
                              <label htmlFor="PrimaryJobContact" className="text-sm leading-none">Primary</label>
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
                                handleParentToggle("invoice", checked);
                                update("InvoiceContact")(checked);
                                if (!checked) {
                                  ContactForm.setValue("PrimaryInvoiceContact", false, { shouldDirty: true, shouldTouch: true });
                                  update("PrimaryInvoiceContact")(false);
                                }
                              }}
                            />
                            <label htmlFor="InvoiceContact" className="text-sm leading-none">Invoice</label>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {toggles.invoice && (
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
                              <label htmlFor="PrimaryInvoiceContact" className="text-sm leading-none">Primary</label>
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
                                handleParentToggle("statement", checked);
                                update("StatementContact")(checked);
                                if (!checked) {
                                  ContactForm.setValue("PrimaryStatementContact", false, { shouldDirty: true, shouldTouch: true });
                                  update("PrimaryStatementContact")(false);
                                }
                              }}
                            />
                            <label htmlFor="StatementContact" className="text-sm leading-none">Statement</label>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {toggles.statement && (
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
                              <label htmlFor="PrimaryStatementContact" className="text-sm leading-none">Primary</label>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

              </div>
              <p className="text-sm text-muted-foreground mt-4 ml-1">Set the communications this contact receives.</p>
              </div>
              
            </div>
          </form>
        </Form>
      </div>
    );
  }
);

AdditionalcontactForm.displayName = "AdditionalcontactForm";
export default AdditionalcontactForm;
