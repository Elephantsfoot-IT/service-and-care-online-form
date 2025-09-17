"use client";

import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { defaultSiteContact, Site, SiteContact } from "@/lib/interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import MultiLineAddressInput from "../ui/multi-line-address-input";
import SiteContactForm from "./site-contact-form";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

const FormSchema = z.object({
  siteName: z.string().min(1, { message: "Site name cannot be empty" }),
  Address: z.string().min(1, { message: "Address cannot be empty" }),
  City: z.string().min(1, { message: "City cannot be empty" }),
  State: z.string().min(1, { message: "State cannot be empty" }),
  PostalCode: z.string().min(1, { message: "Postal code cannot be empty" }),
  Country: z.string().min(1, { message: "Country cannot be empty" }),
});

export type SiteFormType = z.infer<typeof FormSchema>;

type Props = {
  site: Site;
  /**
   * Centralized updater owned by the parent (or Zustand).
   * You decide how it persists to `sites`.
   * Always call this for ANY change.
   */
  handleEditSites: (siteId: string, patch: Partial<Site>) => void;
};

function SiteForm({ site, handleEditSites }: Props) {
  // Normalize site id key if your model has either `id` or `site_id`
  const siteId = site.simpro_site_id;

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
    mode: "onChange",
  });

  // Keep RHF hydrated if the incoming site prop changes outside
  useEffect(() => {
    form.setValue("siteName", site.site_name);
    form.setValue("Address", site.site_address.Address);
    form.setValue("City", site.site_address.City);
    form.setValue("State", site.site_address.State);
    form.setValue("PostalCode", site.site_address.PostalCode);
    form.setValue("Country", site.site_address.Country);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [site]);

  // Ensure a minimum of 1 contact exists (primary = index 0)
  useEffect(() => {
    if (!Array.isArray(site.site_contacts) || site.site_contacts.length === 0) {
      handleEditSites(siteId, {
        site_contacts: [{ ...defaultSiteContact, id: crypto.randomUUID() }],
      });
    }
  }, [site.site_contacts, handleEditSites, siteId]);

  const contacts = useMemo<SiteContact[]>(
    () =>
      Array.isArray(site.site_contacts) && site.site_contacts.length > 0
        ? site.site_contacts
        : [{ ...defaultSiteContact, id: crypto.randomUUID() }],
    [site.site_contacts]
  );

  const editDisabled = useMemo(() => site.mode === "existing", [site.mode]);

  /** Field change helpers -> always call handleEditSites */
  const onChange = (field: keyof SiteFormType, value: string) => {
    form.setValue(field, value, { shouldDirty: true, shouldTouch: true });
    if (field === "siteName") {
      handleEditSites(siteId, { site_name: value });
      return;
    }
    // Address map
    const map: Record<
      Exclude<keyof SiteFormType, "siteName">,
      keyof Site["site_address"]
    > = {
      Address: "Address",
      City: "City",
      State: "State",
      PostalCode: "PostalCode",
      Country: "Country",
    };
    handleEditSites(siteId, {
      site_address: {
        ...site.site_address,
        [map[field as keyof typeof map]]: value,
      },
    });
  };

  /** Contacts ops: always route through handleEditSites */
  const addContact = () => {
    if (contacts.length >= 3) return;
    handleEditSites(siteId, {
      site_contacts: [
        ...contacts,
        { ...defaultSiteContact, id: crypto.randomUUID() },
      ],
    });
  };

  const handleChangeContact = (index: number, updated: SiteContact) => {
    const next = contacts.map((c, i) => (i === index ? updated : c));
    handleEditSites(siteId, { site_contacts: next });
  };

  const handleDeleteContact = (index: number) => {
    // Cannot delete primary (index 0)
    if (index === 0) return;
    const next = contacts.filter((_, i) => i !== index);
    // Still keep min 1 if something weird happens
    handleEditSites(siteId, {
      site_contacts: next.length
        ? next
        : [{ ...defaultSiteContact, id: crypto.randomUUID() }],
    });
  };

  return (
    <div className="flex flex-col w-full mx-auto border border-input shadow-xs rounded-lg gap-6 overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 2xl:p-8 border-b border-input bg-neutral-50">
        <Label className="text-base mb-1">
          {site.site_name || (
            <span className="text-neutral-400">
              <span aria-hidden>—</span>
              <span className="sr-only">Not provided</span>
            </span>
          )}
        </Label>
      </div>

      {/* Site meta form */}
      <Form {...form}>
        <form className="flex flex-col gap-6 p-4 md:p-6 2xl:p-8">
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
                    disabled={editDisabled}
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
                disabled={editDisabled}
              />
            </div>
          </div>
        </form>
      </Form>

      {/* Contacts */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6 p-4 md:p-6 2xl:p-8">
        <div className="w-full md:w-1/3">
          <Label className="text-sm">
            Site Contacts ({contacts.length}/3) <span className="text-red-500">*</span>
          </Label>
          
        </div>

        <div className="w-full md:w-2/3 flex flex-col gap-6">
          {contacts.map((contact, index) => (
            <SiteContactForm
              key={contact.id}
              contact={contact}
              index={index}
              isPrimary={index === 0}
              handleDelete={() => handleDeleteContact(index)}
              handleChange={(updated) => handleChangeContact(index, updated)}
            />
          ))}

          <Button
            type="button"
            variant="secondary"
            onClick={addContact}
            disabled={contacts.length >= 3}
            className="cursor-pointer w-fit ml-auto"
          >
            <PlusIcon className="mr-1" />
            New contact
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SiteForm;
