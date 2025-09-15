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

    // Contact preferences
    QuoteContact: false,
    JobContact: false,
    InvoiceContact: false,
    StatementContact: false,
    PrimaryQuoteContact: false,
    PrimaryJobContact: false,
    PrimaryInvoiceContact: false,
    PrimaryStatementContact: false,

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

        // Contact preferences
        QuoteContact: false,
        JobContact: false,
        InvoiceContact: false,
        StatementContact: false,
        PrimaryQuoteContact: false,
        PrimaryJobContact: false,
        PrimaryInvoiceContact: false,
        PrimaryStatementContact: false,
      }),
  })
);
