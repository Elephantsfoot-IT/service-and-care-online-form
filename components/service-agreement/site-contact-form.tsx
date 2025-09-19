"use client";

import React, { useEffect, useImperativeHandle, useRef } from "react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SiteContact } from "@/lib/interface";
import { Trash2Icon, XIcon } from "lucide-react";
import { Button } from "../ui/button";

export type SiteContactFormHandle = {
  validate: () => Promise<boolean>;
  getData: () => SiteContact;
};

interface SiteContactFormProps {
  contact: SiteContact; // includes: id: string
  index: number;
  isPrimary?: boolean; // NEW: to block delete on primary
  handleDelete: (id: string) => void;
  handleChange: (data: SiteContact) => void; // updates parent/store for this contact
}

const FormSchema = z
  .object({
    GivenName: z.string().min(1, { message: "First name required" }),
    FamilyName: z.string().min(1, { message: "Last name required" }),
    Email: z.string(), // allow empty
    WorkPhone: z.string(),
    CellPhone: z.string(),
    Position: z.string().optional().or(z.literal("")),
    Department: z.string().optional().or(z.literal("")),
  })
  .refine((data) => data.WorkPhone || data.CellPhone || data.Email, {
    message:
      "At least one contact number (Office, Mobile) or Email must be provided.",
    path: ["WorkPhone"],
  });

const SiteContactForm = React.forwardRef<
  SiteContactFormHandle,
  SiteContactFormProps
>(({ contact, index, isPrimary = false, handleDelete, handleChange }, ref) => {
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
    },
  });

  // Keep RHF in sync if parent updates the contact object
  useEffect(() => {
    const fields = Object.keys(ContactForm.getValues()) as (keyof z.infer<
      typeof FormSchema
    >)[];
    fields.forEach((f) =>
      ContactForm.setValue(
        f,
        (contact as SiteContact)[f] as SiteContact[keyof SiteContact]
      )
    );
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
      ...(ContactForm.getValues() as SiteContact),
    }),
  }));

  // Helper: update a single field in the parent store for this contact
  const update =
    <K extends keyof SiteContact>(key: K) =>
    (value: SiteContact[K]) =>
      handleChange({ ...contact, [key]: value });

  return (
    <div
      ref={rootRef}
      className="flex flex-col w-full rounded-lg border border-input overflow-hidden"
    >
      {/* Heading */}
      <div className="flex flex-row justify-between w-full items-center p-4 md:p-6 border-b border-input bg-neutral-75">
        <Label className="text-base">
          {isPrimary ? "Primary Contact" : `Contact (${index + 1})`}
        </Label>
        {!isPrimary &&<Button
          variant="ghost"
          size="icon"
          onClick={() => !isPrimary && handleDelete(contact.id!)}
          disabled={isPrimary}
          title={
            isPrimary ? "Primary contact cannot be deleted" : "Delete contact"
          }
        >
          <XIcon />
        </Button>}
      </div>

      <Form {...ContactForm}>
        <form className="flex flex-col gap-6 p-4 md:p-6">
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
        </form>
      </Form>
    </div>
  );
});

SiteContactForm.displayName = "SiteContactForm";
export default SiteContactForm;
