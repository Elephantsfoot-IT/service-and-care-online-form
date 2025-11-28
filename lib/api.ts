
import { ServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { useQuery } from "@tanstack/react-query";
import { ServiceAgreement } from "./interface";

export async function fetchServiceAgreement(
  id: string
): Promise<ServiceAgreement> {
  const res = await fetch("/api/service-agreements/get-details", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const json = await res.json();
      if (json?.error) msg = json.error;
    } catch {}
    throw new Error(msg);
  }

  return res.json();
}

export function useServiceAgreement(id?: string) {
  return useQuery<ServiceAgreement, Error>({
    queryKey: ["serviceAgreement", id],
    queryFn: () => fetchServiceAgreement(id!), // id is defined because of enabled
    enabled: !!id, // only run when id is provided
    staleTime: 60_000, // optional: 1 min
    refetchOnWindowFocus: false, // optional: reduce refetch noise
  });
}

