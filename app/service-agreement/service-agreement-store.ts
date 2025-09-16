import { AdditionalContact } from "@/lib/interface";
import { create } from "zustand";

export interface ServiceAgreementStore {
  /* ---------- State ---------- */
  page: number;

  // Signature & agreement
  signFullName: string;
  signTitle: string;
  conditionAgree: boolean;
  trimmedDataURL: string | undefined;

  // Account contact details
  accountFirstName: string;
  accountLastName: string;
  accountTitle: string;
  accountEmail: string;
  accountPhone: string;
  accountMobile: string;

  // Contact preferences
  QuoteContact: boolean;
  JobContact: boolean;
  InvoiceContact: boolean;
  StatementContact: boolean;
  PrimaryQuoteContact: boolean;
  PrimaryJobContact: boolean;
  PrimaryInvoiceContact: boolean;
  PrimaryStatementContact: boolean;
  postalStreetAddress: string;
  postalCity: string;
  postalState: string;
  postalPostcode: string;
  postalCountry: string;
  businessStreetAddress: string;
  businessCity: string;
  businessPostcode: string;
  businessState: string;
  companyName: string;
  abn: string;
  companyType: string;
  setSameAddress: (sameAddres: boolean) => void;
  sameAddres: boolean;
  additionalContacts: AdditionalContact[];
  setAdditionalContacts: (additionalContacts: AdditionalContact[]) => void;

  /* ---------- Actions ---------- */
  setPage: (page: number) => void;
  setTrimmedDataURL: (trimmedDataURL: string | undefined) => void;
  updateField: (field: string, value: string) => void;
  updateFieldBoolean: (field: string, value: boolean) => void;
  reset: () => void;
}

export const useServiceAgreementStore = create<ServiceAgreementStore>(
  (set) => ({
    /* ---------- State ---------- */
    page: 4,

    // Signature & agreement
    signFullName: "",
    signTitle: "",
    conditionAgree: false,
    trimmedDataURL: undefined,

    // Account contact details
    accountFirstName: "",
    accountLastName: "",
    accountTitle: "",
    accountEmail: "",
    accountPhone: "",
    accountMobile: "",
    postalStreetAddress: "",
    postalCity: "",
    postalState: "",
    postalPostcode: "",
    postalCountry: "",

    // Contact preferences
    QuoteContact: false,
    JobContact: false,
    InvoiceContact: false,
    StatementContact: false,
    PrimaryQuoteContact: false,
    PrimaryJobContact: false,
    PrimaryInvoiceContact: false,
    PrimaryStatementContact: false,
    businessStreetAddress: "",
    businessCity: "",
    businessPostcode: "",
    businessState: "",
    companyName: "",
    abn: "",
    companyType: "",
    sameAddres: false,
    setSameAddress: (sameAddres) => set({ sameAddres: sameAddres }),

    additionalContacts: [],
    setAdditionalContacts: (additionalContacts) => set({ additionalContacts }),
    

    /* ---------- Actions ---------- */
    setPage: (page) => set({ page }),
    setTrimmedDataURL: (trimmedDataURL) => set({ trimmedDataURL }),
    updateField: (field, value) =>
      set((state) => ({
        ...state,
        [field]: value,
      })),
    updateFieldBoolean: (field, value) =>
      set((state) => ({
        ...state,
        [field]: value,
      })),
    reset: () =>
      set({
        page: 1, // Signature & agreement
        signFullName: "",
        signTitle: "",
        conditionAgree: false,
        trimmedDataURL: undefined,

        // Account contact details
        accountFirstName: "",
        accountLastName: "",
        accountTitle: "",
        accountEmail: "",
        accountPhone: "",
        accountMobile: "",
        postalCity: "",
        postalState: "",
        postalPostcode: "",
        postalCountry: "",

        // Contact preferences
        QuoteContact: false,
        JobContact: false,
        InvoiceContact: false,
        StatementContact: false,
        PrimaryQuoteContact: false,
        PrimaryJobContact: false,
        PrimaryInvoiceContact: false,
        PrimaryStatementContact: false,

        // Billing details
        businessStreetAddress: "",
        businessCity: "",
        businessPostcode: "",
        businessState: "",
        companyName: "",
        abn: "",
        companyType: "",
        additionalContacts: [],
      }),
  })
);
