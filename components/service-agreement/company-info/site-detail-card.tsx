"use client";

import React, { useRef, useImperativeHandle } from "react";
import SiteForm, { SiteFormHandle } from "@/components/service-agreement/site-form";
import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { Site } from "@/lib/interface";

export type SiteDetailsCardHandle = {
  /** Validate all SiteForm children. Returns true if all valid (or none). */
  handleSubmit: () => Promise<boolean>;
};

export type SiteDetailsCardProps = {
  className?: string;
};

function SiteDetailsCardImpl(
  _props: SiteDetailsCardProps,
  ref: React.ForwardedRef<SiteDetailsCardHandle>
) {
  const state = useServiceAgreementStore();

  // Refs to child SiteForms keyed by site id
  const formRefs = useRef<Record<string, SiteFormHandle | null>>({});
  const setSiteRef =
    (id: string) => (instance: SiteFormHandle | null) => {
      formRefs.current[id] = instance;
    };

  // Expose handleSubmit to parent
  const handleSubmit = async (): Promise<boolean> => {
    const sites = state.serviceAgreement?.sites ?? [];
    const refs = sites
      .map((s) => formRefs.current[s.simpro_site_id])
      .filter(Boolean) as SiteFormHandle[];

    if (refs.length === 0) return true; // nothing to validate

    const results = await Promise.all(refs.map((r) => r.validate()));
    const allValid = results.every(Boolean);

    // (Optional) focus/scroll first invalid child if you expose such a method on SiteFormHandle
    // if (!allValid) {
    //   const firstInvalid = refs[results.findIndex((ok) => !ok)];
    //   firstInvalid?.scrollToFirstError?.();
    // }

    return allValid;
  };

  useImperativeHandle(ref, () => ({ handleSubmit }), []);

  if (!state.serviceAgreement || state.serviceAgreement.sites.length === 0) {
    return null;
  }

  const handleEditSites = (siteId: string, patch: Partial<Site>) => {
    const prev = useServiceAgreementStore.getState().serviceAgreement;
    if (!prev) return;

    const nextSites = (prev.sites ?? []).map((site: Site) => {
      if (site.simpro_site_id !== siteId) return site;

      const merged: Site = { ...site, ...patch };

      if (patch.site_address) {
        merged.site_address = { ...site.site_address, ...patch.site_address };
      }
      if (patch.site_contacts) {
        merged.site_contacts = [...patch.site_contacts];
      }

      return merged;
    });

    useServiceAgreementStore.getState().setServiceAgreement({ ...prev, sites: nextSites });
  };

  return (
    <div className="flex flex-col gap-6">
      {state.serviceAgreement.sites.map((site, index) => (
        <SiteForm
        index={index}
          key={site.simpro_site_id}
          ref={setSiteRef(site.simpro_site_id)}
          site={site}
          handleEditSites={handleEditSites}
        />
      ))}
    </div>
  );
}

const SiteDetailsCard = React.forwardRef<SiteDetailsCardHandle, SiteDetailsCardProps>(
  SiteDetailsCardImpl
);
SiteDetailsCard.displayName = "SiteDetailsCard";

export default SiteDetailsCard;
