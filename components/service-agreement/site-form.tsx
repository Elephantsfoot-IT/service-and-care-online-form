"use client";

import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { defaultSiteContact, Site } from "@/lib/interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import MultiLineAddressInput from "../ui/multi-line-address-input";
import SiteContactForm from "./site-contact-form";

const FormSchema = z.object({
  siteName: z.string().min(1, { message: "Given name cannot be empty" }),
  Address: z.string().min(1, { message: "Address cannot be empty" }),
  City: z.string().min(1, { message: "City cannot be empty" }),
  State: z.string().min(1, { message: "State cannot be empty" }),
  PostalCode: z.string().min(1, { message: "Postal code cannot be empty" }),
  Country: z.string().min(1, { message: "Country cannot be empty" }),
});

export type SiteFormType = z.infer<typeof FormSchema>;

function SiteForm({ site }: { site: Site }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      siteName: site.site_name,
      Address: site.site_address.Address,
      City: site.site_address.City,
      State: site.site_address.State,
      PostalCode: site.site_address.PostalCode,
      Country: site.site_address.Country,
    },
  });

  const onChange = (field: keyof SiteFormType, value: string) => {
    form.setValue(field, value);
  };

  const contacts = useMemo(
    () =>
      Array.isArray(site.site_contacts) && site.site_contacts.length > 0
        ? site.site_contacts
        : [
            { ...defaultSiteContact, id: crypto.randomUUID() },
          ],
    [site.site_contacts]
  );

  return (
    <div className="flex flex-col w-full mx-auto p-4 md:p-6 2xl:p-8 border border-neutral-200 shadow-xs rounded-lg gap-6">
      <Form {...form}>
        <form className="flex flex-col gap-6">
          <Label className="text-base mb-1">{site.site_name}</Label>
          <hr className="border-neutral-300 border-dashed" />
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
            <Label className="w-full md:w-1/3 text-sm">
              Site Name <span className="text-red-500">*</span>
            </Label>
            <div className="w-full md:w-2/3 flex flex-row space-x-2">
              <FormField
                control={form.control}
                name="siteName"
                render={({ field }) => (
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      onChange("siteName", e.target.value);
                    }}
                    className="efg-input"
                  />
                )}
              />
            </div>
          </div>
          <hr className="border-neutral-300 border-dashed" />

          <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
            <Label className="mb-2 text-sm w-full md:w-1/3">
              Company address <span className="text-red-500">*</span>
            </Label>
            <div className="w-full md:w-2/3">
              <MultiLineAddressInput<SiteFormType>
                fieldNames={{
                  street: "Address",
                  city: "City",
                  state: "State",
                  postcode: "PostalCode",
                  country: "Country",
                }}
                handleChange={(f, v) => onChange(f as keyof SiteFormType, v)}
                stateSelectValue={site.site_address.State}
              />
            </div>
          </div>
          <hr className="border-neutral-300 border-dashed" />
        </form>
      </Form>

      {/* SECTION: Contacts (no cards; use left bar + zebra background + pill headers) */}
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
        <Label className="mb-2 text-sm w-full md:w-1/3">
          Site Contacts <span className="text-red-500">*</span>
        </Label>
        <div className="w-full md:w-2/3 flex flex-col gap-6">
          {contacts.map((contact, index) => (
           
              <SiteContactForm
               key={contact.id}
                contact={contact}
                index={index}
                handleDelete={() => {}}
                handleChange={() => {}}
              />
           
          ))}
        </div>
      </div>
    </div>
  );
}

export default SiteForm;
