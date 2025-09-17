"use client";
import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import SiteForm from "@/components/service-agreement/site-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ServiceAgreement, Site } from "@/lib/interface";
import { scrollToTop } from "@/lib/utils";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useEffect } from "react";

export default function SiteInfo() {
  const state = useServiceAgreementStore();
  const goBack = () => {
    state.setPage(4);
  };
  const handleSubmit = () => {
    state.setPage(6);
  };
  useEffect(() => {
    scrollToTop();
  }, []);

  if (state.serviceAgreement?.sites.length == 0) {
    return null;
  }
  const handleEditSites = (siteId: string, patch: Partial<Site>) => {
    const prev = useServiceAgreementStore.getState().serviceAgreement;
    if (!prev) return;

    const nextSites = (prev.sites ?? []).map((site: Site) => {
      const currentId = site.simpro_site_id;

      if (currentId !== siteId) return site;

      // Start with a shallow merge
      const merged: Site = { ...site, ...patch };

      // Deep-merge site_address if provided
      if (patch.site_address) {
        merged.site_address = {
          ...site.site_address,
          ...patch.site_address,
        };
      }

      // If site_contacts provided in patch, use it as-is (you can enforce min/max elsewhere)
      if (patch.site_contacts) {
        merged.site_contacts = [...patch.site_contacts];
      }

      return merged;
    });

    useServiceAgreementStore.getState().setServiceAgreement({ ...prev, sites: nextSites });
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
          <SiteForm key={site.simpro_site_id} site={site} handleEditSites={handleEditSites} />
        ))}
      </div>

      <div className="flex flex-row gap-2 justify-between mt-10">
        <Button
          variant="outline"
          onClick={goBack}
          className=" w-fit cursor-pointer"
        >
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
