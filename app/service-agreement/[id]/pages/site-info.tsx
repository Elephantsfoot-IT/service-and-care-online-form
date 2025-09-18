"use client";
import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import SiteForm, { SiteFormHandle } from "@/components/service-agreement/site-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Site } from "@/lib/interface";
import { scrollToTop } from "@/lib/utils";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import React, { useEffect, useRef } from "react";

export default function SiteInfo() {
  const state = useServiceAgreementStore();

  const goBack = () => state.setPage(4);

  // Refs to child SiteForms keyed by site id
  const formRefs = useRef<Record<string, SiteFormHandle | null>>({});
  const setSiteRef =
    (id: string) => (instance: SiteFormHandle | null) => {
      formRefs.current[id] = instance;
    };

  const handleSubmit = async () => {
    // Validate all sites (fields + contacts)
    const sites = state.serviceAgreement?.sites ?? [];
    const refs = sites
      .map((s) => formRefs.current[s.simpro_site_id])
      .filter(Boolean) as SiteFormHandle[];

    if (refs.length === 0) {
      state.setPage(6);
      return;
    }

    const results = await Promise.all(refs.map((r) => r.validate()));
    const allValid = results.every(Boolean);
    if (!allValid) return; // stay on page; child forms scrolled into view

    state.setPage(6);
  };

  useEffect(() => {
    scrollToTop();
  }, []);

  if (!state.serviceAgreement || state.serviceAgreement?.sites.length === 0) {
    return null;
  }

  const handleEditSites = (siteId: string, patch: Partial<Site>) => {
    const prev = useServiceAgreementStore.getState().serviceAgreement;
    if (!prev) return;

    const nextSites = (prev.sites ?? []).map((site: Site) => {
      const currentId = site.simpro_site_id;
      if (currentId !== siteId) return site;

      const merged: Site = { ...site, ...patch };

      if (patch.site_address) {
        merged.site_address = {
          ...site.site_address,
          ...patch.site_address,
        };
      }

      if (patch.site_contacts) {
        merged.site_contacts = [...patch.site_contacts];
      }

      return merged;
    });

    console.log("nextSites", nextSites);

    useServiceAgreementStore
      .getState()
      .setServiceAgreement({ ...prev, sites: nextSites });
  };

  return (
    <div className=" w-full mx-auto flex flex-col gap-10">
      <div className="flex flex-col">
        <Label className="text-2xl mb-1">Site Details</Label>
        <span className="text-lg text-neutral-500">
          Provide the site information associated with this service agreement.
        </span>
      </div>

      <div className="flex flex-col gap-10">
        {state.serviceAgreement?.sites.map((site) => (
          <SiteForm
            key={site.simpro_site_id}
            ref={setSiteRef(site.simpro_site_id)}
            site={site}
            handleEditSites={handleEditSites}
          />
        ))}
      </div>

      <div className="flex flex-row gap-2 justify-between mt-10">
        <Button
          variant="outline"
          onClick={goBack}
          className=" w-fit cursor-pointer"
        >
          <ArrowLeftIcon /> Back
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
