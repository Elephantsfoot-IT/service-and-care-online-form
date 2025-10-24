"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { defaultSiteContact, Site, SiteContact } from "@/lib/interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import React, { useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import MultiLineAddressInput from "../ui/multi-line-address-input";
import SiteContactForm, { SiteContactFormHandle } from "./site-contact-form";

const FormSchema = z.object({
  siteName: z.string().min(1, { message: "Site name cannot be empty" }),
  Address: z.string().min(1, { message: "Address cannot be empty" }),
  City: z.string().min(1, { message: "City cannot be empty" }),
  State: z.string().min(1, { message: "State cannot be empty" }),
  PostalCode: z.string().min(1, { message: "Postal code cannot be empty" }),
  Country: z.string(),
});
export type SiteFormType = z.infer<typeof FormSchema>;

type Props = {
  index?: number;
  site: Site;
  handleEditSites: (siteId: string, patch: Partial<Site>) => void;
};

export type SiteFormHandle = {
  /** Validates the site fields and all contact forms */
  validate: () => Promise<boolean>;
};

const SiteForm = React.forwardRef<SiteFormHandle, Props>(
  ({ site, handleEditSites }, ref) => {
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

    // Ensure we always have a primary contact
    useEffect(() => {
      if (!site.primary_contact) {
        handleEditSites(siteId, {
          primary_contact: { ...defaultSiteContact, id: crypto.randomUUID() },
        });
      }
    }, [site.primary_contact, handleEditSites, siteId]);

    // Normalize additional contacts array (0..2)
    const additionalContacts = useMemo<SiteContact[]>(
      () => (Array.isArray(site.site_contacts) ? site.site_contacts : []),
      [site.site_contacts]
    );

    /** Field change helpers -> always call handleEditSites */
    const onChange = (field: keyof SiteFormType, value: string) => {
      form.setValue(field, value, { shouldDirty: true, shouldTouch: true });
      if (field === "siteName") {
        handleEditSites(siteId, { site_name: value });
        return;
      }

      const address = {
        site_address: {
          ...site.site_address,
          [field]: value,
        },
      };

      handleEditSites(siteId, address);
    };

    const onChangeAll = (
      street: string,
      city: string,
      postcode: string,
      state: string
    ) => {
      const address = {
        site_address: {
          Address: street,
          City: city,
          PostalCode: postcode,
          State: state,
          Country: "Australia",
        },
      };

      handleEditSites(siteId, address);
    };

    /** Contacts ops */
    const addContact = () => {
      if (additionalContacts.length >= 2) return; // cap at 2 additional
      const next = [
        ...additionalContacts,
        { ...defaultSiteContact, id: crypto.randomUUID() },
      ];
      handleEditSites(siteId, { site_contacts: next });
    };

    const handleChangePrimary = (updated: SiteContact) => {
      handleEditSites(siteId, { primary_contact: updated });
    };

    const handleChangeAdditional = (index: number, updated: SiteContact) => {
      const next = additionalContacts.map((c, i) =>
        i === index ? updated : c
      );
      handleEditSites(siteId, { site_contacts: next });
    };

    const handleDeleteAdditional = (index: number) => {
      const next = additionalContacts.filter((_, i) => i !== index);
      handleEditSites(siteId, { site_contacts: next });
    };

    /** === Validation wiring === */
    const rootRef = useRef<HTMLDivElement>(null);
    const primaryRef = useRef<SiteContactFormHandle | null>(null);
    const additionalRefs = useRef<Record<string, SiteContactFormHandle | null>>(
      {}
    );
    const setAdditionalRef =
      (id: string) => (instance: SiteContactFormHandle | null) => {
        additionalRefs.current[id] = instance;
      };

    useImperativeHandle(ref, () => ({
      validate: async () => {
        // 1) validate site fields
        const siteOk = await form.trigger();

        // 2) validate primary contact
        const primaryOk = (await primaryRef.current?.validate()) ?? true;

        // 3) validate additional contacts
        const results = await Promise.all(
          additionalContacts.map(
            (c) =>
              additionalRefs.current[c.id]?.validate() ?? Promise.resolve(true)
          )
        );
        const additionalOk = results.every(Boolean);

        const ok = siteOk && primaryOk && additionalOk;
        if (!ok) {
          rootRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
        return ok;
      },
    }));

    return (
      <div
        ref={rootRef}
        className="flex flex-col w-full mx-auto border border-input rounded-xl overflow-hidden bg-white"
      >
        {/* Header */}
        <div className="py-8 px-4 md:px-6 border-b border-input bg-neutral-50">
          <Label className="text-base xl:text-lg">
            <div className="underline">
              {site.site_name || (
                <span className="text-neutral-400 ">
                  <span aria-hidden>—</span>
                  <span className="sr-only">Not provided</span>
                </span>
              )}
            </div>
          </Label>
        </div>

        <div className="py-8 px-4 md:px-6 flex flex-col gap-6">
          {/* Site meta form */}
          <Form {...form}>
            <form className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
                <Label className="w-full md:w-1/3 text-sm">
                  Site Name <span className="text-red-500">*</span>
                </Label>

                <FormField
                  control={form.control}
                  name="siteName"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-2/3 flex flex-col space-x-2 flex-shrink-0">
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            onChange("siteName", e.target.value);
                          }}
                          className="efg-input"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <hr className="border-neutral-300 border-dashed" />

              <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
                <Label className="mb-2 text-sm w-full md:w-1/3">
                  Company address <span className="text-red-500">*</span>
                </Label>
                <div className="w-full md:w-2/3 flex-shrink-0">
                  <MultiLineAddressInput<SiteFormType>
                    fieldNames={{
                      street: "Address",
                      city: "City",
                      state: "State",
                      postcode: "PostalCode",
                      country: "Country",
                    }}
                    handleChange={(f, v) =>
                      onChange(f as keyof SiteFormType, v)
                    }
                    stateSelectValue={site.site_address.State}
                    handleChangeAll={(street, city, postcode, state) =>
                      onChangeAll(street, city, postcode, state)
                    }
                  />
                </div>
              </div>
              <hr className="border-neutral-300 border-dashed" />
            </form>
          </Form>

          {/* Primary Contact */}
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <div className="w-full md:w-1/3">
              <Label className="text-sm">
                Primary Contact <span className="text-red-500">*</span>
              </Label>
            </div>
            <div className="w-full md:w-2/3 flex flex-col gap-6 flex-shrink-0">
              {site.primary_contact && (
                <SiteContactForm
                  ref={primaryRef}
                  contact={site.primary_contact}
                  index={0}
                  isPrimary
                  handleDelete={() => {}} // cannot delete primary
                  handleChange={(updated) => handleChangePrimary(updated)}
                />
              )}
            </div>
          </div>

          {/* Additional Contacts */}
          {additionalContacts.length > 0 && (
            <div className="flex flex-col gap-4 md:flex-row md:items-start">
              <div className="w-full md:w-1/3"></div>
              <div className="w-full md:w-2/3 flex flex-col gap-6 flex-shrink-0">
                {additionalContacts.map((contact, idx) => (
                  <SiteContactForm
                    key={contact.id}
                    ref={setAdditionalRef(contact.id)}
                    contact={contact}
                    index={idx + 1} // display index after primary
                    isPrimary={false}
                    handleDelete={() => handleDeleteAdditional(idx)}
                    handleChange={(updated) =>
                      handleChangeAdditional(idx, updated)
                    }
                  />
                ))}
              </div>
            </div>
          )}

          <Button
            type="button"
            variant="secondary"
            onClick={addContact}
            disabled={additionalContacts.length >= 2}
            className="cursor-pointer w-fit ml-auto"
          >
            <PlusIcon className="mr-1" />
            New contact
          </Button>
        </div>
      </div>
    );
  }
);

SiteForm.displayName = "SiteForm";
export default SiteForm;
