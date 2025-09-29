// helpers.ts

import {
  AdditionalContact,
  CustomerContactRequest,
  CustomerRequest,
  ServiceAgreement,
  Site,
} from "./interface";
import { useQuery } from "@tanstack/react-query";
import { ServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { currentDate } from "./utils";

/* --------------------------- Service Agreement --------------------------- */

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

/* ---------------------------------- PDF ---------------------------------- */

export async function convertHtmlToPdfLambda(state: ServiceAgreementStore) {
  try {
    const response = await fetch(process.env.PDF_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: state,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `getPDF Failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error getPDF:", error);
    throw error;
  }
}

/* -------------------------------- Customers ------------------------------ */

export async function createCustomer(state: ServiceAgreementStore) {
  try {
    const customer: CustomerRequest = {
      CompanyName: state.companyName,
      Address: {
        Address: state.businessStreetAddress,
        City: state.businessCity,
        State: state.businessState,
        PostalCode: state.businessPostcode,
        Country: "Australia",
      },
      BillingAddress: {
        Address: state.postalStreetAddress,
        City: state.postalCity,
        State: state.postalState,
        PostalCode: state.postalPostcode,
        Country: "Australia",
      },
      CustomerType: "Customer",
      Archived: false,
      EIN: state.abn,
      Phone: state.accountPhone,
      Email: state.accountEmail,
    };

    const response = await fetch(
      `https://elephantsfoot.simprosuite.com/api/v1.0/companies/0/customers/companies/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SIMPRO_API_KEY}`,
        },
        body: JSON.stringify(customer),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Create Customer: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    return data.ID;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
}

export async function editCustomer(state: ServiceAgreementStore) {
  const simpro_customer_id = state.serviceAgreement?.simpro_customer_id;
  if (!simpro_customer_id) throw new Error("Missing simpro_customer_id");

  try {
    const customer: CustomerRequest = {
      CompanyName: state.companyName,
      Address: {
        Address: state.businessStreetAddress,
        City: state.businessCity,
        State: state.businessState,
        PostalCode: state.businessPostcode,
        Country: "Australia",
      },
      BillingAddress: {
        Address: state.postalStreetAddress,
        City: state.postalCity,
        State: state.postalState,
        PostalCode: state.postalPostcode,
        Country: "Australia",
      },
      CustomerType: "Customer",
      Archived: false,
      EIN: state.abn,
      Phone: state.accountPhone,
      Email: state.accountEmail,
    };

    const response = await fetch(
      `https://elephantsfoot.simprosuite.com/api/v1.0/companies/0/customers/companies/${simpro_customer_id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SIMPRO_API_KEY}`,
        },
        body: JSON.stringify(customer),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Edit Customer: ${response.status} ${response.statusText}`
      );
    }

    // Some PATCH endpoints return 204 No Content
    let id = Number(simpro_customer_id);
    const text = await response.text();
    if (text) {
      try {
        const data = JSON.parse(text);
        if (data?.ID) id = data.ID;
      } catch {}
    }
    return id;
  } catch (error) {
    console.error("Error editing customer:", error);
    throw error;
  }
}

/* ------------------------------- Attachments ----------------------------- */

export async function uploadPdfToSimPro(
  customer_ID: string | number | null,
  base64Data: string
) {
  if (!customer_ID) throw new Error("Upload PDF: customer_ID is required");

  try {
    const date = currentDate(new Date());

    const response = await fetch(
      `https://elephantsfoot.simprosuite.com/api/v1.0/companies/0/customers/${customer_ID}/attachments/files/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SIMPRO_API_KEY}`,
        },
        body: JSON.stringify({
          Filename: `Service-Agreement-${date}.pdf`,
          Base64Data: base64Data,
          Public: true,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Upload failed: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading PDF:", error);
    throw error;
  }
}

export async function base64FromUrl(fileUrl: string) {
  const res = await fetch(fileUrl);
  if (!res.ok) throw new Error(`Failed to download file: ${res.status}`);
  const ab = await res.arrayBuffer();
  return Buffer.from(ab).toString("base64"); // just the Base64 string, no data: prefix
}

/* -------------------------------- Contacts ------------------------------- */

export async function createCustomerBillingContact(
  state: ServiceAgreementStore,
  customerID: string
) {
  try {
    const contact: CustomerContactRequest = {
      GivenName: state.accountFirstName,
      FamilyName: state.accountLastName,
      Email: state.accountEmail,
      CellPhone: state.accountMobile,
      Position: state.accountTitle,
      QuoteContact: state.QuoteContact,
      JobContact: state.JobContact,
      InvoiceContact: state.InvoiceContact,
      StatementContact: state.StatementContact,
     
      // PrimaryQuoteContact: state.PrimaryQuoteContact,
    };
    if (state.QuoteContact) {
      contact.PrimaryQuoteContact = true;
    }
    if (state.JobContact) {
      contact.PrimaryJobContact = true;
    }
    if (state.InvoiceContact) {
      contact.PrimaryInvoiceContact = true;
    }
    if (state.StatementContact) {
      contact.PrimaryStatementContact = true;
    }

    const response = await fetch(
      `https://elephantsfoot.simprosuite.com/api/v1.0/companies/0/customers/${customerID}/contacts/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SIMPRO_API_KEY}`,
        },
        body: JSON.stringify(contact),
      }
    );
    const data = await response.json();
    console.log("data", data);

    if (!response.ok) {
      throw new Error(
        `Create Customer Contact: ${response.status} ${response.statusText}`
      );
    }

  
    return data;
  } catch (error) {
    console.error("Error creating customer contact:", error);
    throw error;
  }
}

export async function createMultipleContact(
  state: ServiceAgreementStore,
  customerID: string
) {
  try {
    const contacts = state.additionalContacts;
    const creationPromises = contacts.map((contact) =>
      createAdditionalContact(contact, customerID)
    );
    const results = await Promise.all(creationPromises);
    return results;
  } catch (error) {
    console.error("Error creating multiple contacts:", error);
    throw error;
  }
}

const createAdditionalContact = async (
  contact: CustomerContactRequest,
  customerID: string
) => {
  try {
    const contactBody = {
      GivenName: contact.GivenName,
      FamilyName: contact.FamilyName,
      Email: contact.Email,
      CellPhone: contact.CellPhone,
      Position: contact.Position,
      QuoteContact: contact.QuoteContact,
      JobContact: contact.JobContact,
      InvoiceContact: contact.InvoiceContact,
      StatementContact: contact.StatementContact,
    } as CustomerContactRequest;
    if (contact.QuoteContact) {
      contactBody.PrimaryQuoteContact = true;
    }
    if (contact.JobContact) {
      contactBody.PrimaryJobContact = true;
    }
    if (contact.InvoiceContact) {
      contactBody.PrimaryInvoiceContact = true;
    }
    if (contact.StatementContact) {
      contactBody.PrimaryStatementContact = true;
    }
    const response = await fetch(
      `https://elephantsfoot.simprosuite.com/api/v1.0/companies/0/customers/${customerID}/contacts/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SIMPRO_API_KEY}`,
        },
        body: JSON.stringify(contactBody),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        `Create Customer Contact: ${response.status} ${response.statusText}`
      );
    }


    return data;
  } catch (error) {
    console.error("Error creating customer contact:", error);
    throw error;
  }
};



/* ---------------------------------- Sites -------------------------------- */

export const handleSites = async (
  state: ServiceAgreementStore,
  customerID: string
) => {
  const sites = state.serviceAgreement?.sites ?? [];
  // FIX: "new" sites should have NO simpro_site_id yet
  const newSites = sites.filter((site) => site.mode === "new");
  // If you need existing sites later, you can use:
  const existingSites = sites.filter((site) => site.mode === "existing");

  if (newSites.length > 0) {
    await createMultipleSites(newSites, customerID);
  }
  if (existingSites.length > 0) {
    await editMultipleSites(existingSites);
  }
};

export async function editMultipleSites(sites: Site[]) {
  try {
    const creationPromises = sites.map((site) => editSite(site));
    const results = await Promise.all(creationPromises);
    return results;
  } catch (error) {
    console.error("Error editing multiple sites:", error);
    throw error;
  }
}

export async function createMultipleSites(sites: Site[], customerID: string) {
  try {
    const creationPromises = sites.map((site) => createSite(site, customerID));
    const results = await Promise.all(creationPromises);
    return results;
  } catch (error) {
    console.error("Error creating multiple sites:", error);
    throw error;
  }
}

async function createSite(site: Site, customerID: string) {
  try {
    const response = await fetch(
      "https://elephantsfoot.simprosuite.com/api/v1.0/companies/0/sites/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SIMPRO_API_KEY}`,
        },
        body: JSON.stringify({
          Name: site.site_name,
          Address: site.site_address,
          Customers: [Number(customerID)],
          Archived: false,
        }),
      }
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Create site failed: ${response.status} ${response.statusText}`
      );
    }

    // Primary contact (optional)

    const contactResponse = await fetch(
      `https://elephantsfoot.simprosuite.com/api/v1.0/companies/0/sites/${data.ID}/contacts/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SIMPRO_API_KEY}`,
        },
        body: JSON.stringify({
          GivenName: site.primary_contact?.GivenName,
          FamilyName: site.primary_contact?.FamilyName,
          Email: site.primary_contact?.Email,
          CellPhone: site.primary_contact?.CellPhone,
          Position: site.primary_contact?.Position,
          PrimaryContact: true,
        }),
      }
    );

    if (!contactResponse.ok) {
      throw new Error(
        `Create site contact failed: ${contactResponse.status} ${contactResponse.statusText}`
      );
    }
    const contactData = await contactResponse.json();

    // Additional contacts — await all (no fire-and-forget)
    const additionalSiteContacts = site.site_contacts ?? [];
    if (additionalSiteContacts.length) {
      await Promise.all(
        additionalSiteContacts.map(async (contact) => {
          const additionalContactResponse = await fetch(
            `https://elephantsfoot.simprosuite.com/api/v1.0/companies/0/sites/${data.ID}/contacts/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.SIMPRO_API_KEY}`,
              },
              body: JSON.stringify({
                GivenName: contact.GivenName,
                FamilyName: contact.FamilyName,
                Email: contact.Email,
                CellPhone: contact.CellPhone,
                Position: contact.Position,
                PrimaryContact: false,
              }),
            }
          );
          if (!additionalContactResponse.ok) {
            throw new Error(
              `Create site contact failed: ${additionalContactResponse.status} ${additionalContactResponse.statusText}`
            );
          }
          await additionalContactResponse.json().catch(() => null);
        })
      );
    }

    return { data, contactData };
  } catch (error) {
    console.error("Error creating sites:", error);
    throw error;
  }
}

async function editSite(site: Site) {
  try {
    const response = await fetch(
      `https://elephantsfoot.simprosuite.com/api/v1.0/companies/0/sites/${site.simpro_site_id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SIMPRO_API_KEY}`,
        },
        body: JSON.stringify({
          Name: site.site_name,
          Address: site.site_address,
          Archived: false,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Edit site failed: ${response.status} ${response.statusText}`
      );
    }

    // Primary contact (optional)

    const contactResponse = await fetch(
      `https://elephantsfoot.simprosuite.com/api/v1.0/companies/0/sites/${site.simpro_site_id}/contacts/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SIMPRO_API_KEY}`,
        },
        body: JSON.stringify({
          GivenName: site.primary_contact?.GivenName,
          FamilyName: site.primary_contact?.FamilyName,
          Email: site.primary_contact?.Email,
          CellPhone: site.primary_contact?.CellPhone,
          Position: site.primary_contact?.Position,
          PrimaryContact: true,
        }),
      }
    );

    if (!contactResponse.ok) {
      throw new Error(
        `Create site contact failed: ${contactResponse.status} ${contactResponse.statusText}`
      );
    }
    const contactData = await contactResponse.json();

    // Additional contacts — await all (no fire-and-forget)
    const additionalSiteContacts = site.site_contacts ?? [];
    if (additionalSiteContacts.length) {
      await Promise.all(
        additionalSiteContacts.map(async (contact) => {
          const additionalContactResponse = await fetch(
            `https://elephantsfoot.simprosuite.com/api/v1.0/companies/0/sites/${site.simpro_site_id}/contacts/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.SIMPRO_API_KEY}`,
              },
              body: JSON.stringify({
                GivenName: contact.GivenName,
                FamilyName: contact.FamilyName,
                Email: contact.Email,
                CellPhone: contact.CellPhone,
                Position: contact.Position,
                PrimaryContact: false,
              }),
            }
          );
          if (!additionalContactResponse.ok) {
            throw new Error(
              `Create site contact failed: ${additionalContactResponse.status} ${additionalContactResponse.statusText}`
            );
          }
          await additionalContactResponse.json().catch(() => null);
        })
      );
    }

    return { contactData };
  } catch (error) {
    console.error("Error edit sites:", error);
    throw error;
  }
}
