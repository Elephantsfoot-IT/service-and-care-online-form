import { create } from "zustand";
import { AdditionalContact, MaybeOption, ServiceAgreement } from "@/lib/interface";

/* -------------------------------- Types ------------------------------- */

export interface ServiceAgreementStore {
  /* ---------- UI / Progress ---------- */
  page: number;
  progress: number;
  setPage: (page: number) => void;
  setProgress: (progress: number) => void;

  /* ---------- Signature & Agreement ---------- */
  signFullName: string;
  signTitle: string;
  conditionAgree: boolean;
  trimmedDataURL: string | undefined;
  setTrimmedDataURL: (trimmedDataURL: string | undefined) => void;

  /* ---------- Account Contact Details ---------- */
  accountFirstName: string;
  accountLastName: string;
  accountTitle: string;
  accountEmail: string;
  accountPhone: string;
  accountMobile: string;

  /* ---------- Postal Address ---------- */
  postalStreetAddress: string;
  postalCity: string;
  postalState: string;
  postalPostcode: string;
  postalCountry: string;

  /* ---------- Contact Preferences ---------- */
  QuoteContact: boolean;
  JobContact: boolean;
  InvoiceContact: boolean;
  StatementContact: boolean;
  PrimaryQuoteContact: boolean;
  PrimaryJobContact: boolean;
  PrimaryInvoiceContact: boolean;
  PrimaryStatementContact: boolean;

  /* ---------- Business / Billing ---------- */
  businessStreetAddress: string;
  businessCity: string;
  businessPostcode: string;
  businessState: string;
  companyName: string;
  abn: string;

  /** Kept as-is for backward compatibility (typo preserved intentionally). */
  sameAddres: boolean;
  setSameAddress: (sameAddres: boolean) => void;

  /** Mark when user has edited company details so Simpro hydration won't overwrite. */
  companyDetailsEdited: boolean;
  setCompanyDetailsEdited: (edited: boolean) => void;

  /* ---------- Additional Contacts ---------- */
  additionalContacts: AdditionalContact[];
  setAdditionalContacts: (additionalContacts: AdditionalContact[]) => void;

  /* ---------- Loaded Service Agreement ---------- */
  serviceAgreement: ServiceAgreement | null;
  setServiceAgreement: (sa: ServiceAgreement | null) => void;

  /* ---------- Service Frequencies ---------- */
  chuteCleaningFrequency: MaybeOption;
  equipmentMaintenanceFrequency: MaybeOption;
  wasteRoomCleaningFrequency: MaybeOption;
  odourControlFrequency: MaybeOption;
  selfClosingHopperDoorInspectionFrequency: MaybeOption;
  binCleaningFrequency: MaybeOption;
  odourControlUnits: Record<string, number>;

  setChuteCleaningFrequency: (frequency: MaybeOption) => void;
  setEquipmentMaintenanceFrequency: (frequency: MaybeOption) => void;
  setWasteRoomCleaningFrequency: (frequency: MaybeOption) => void;
  setOdourControlFrequency: (frequency: MaybeOption) => void;
  setSelfClosingHopperDoorInspectionFrequency: (frequency: MaybeOption) => void;
  setBinCleaningFrequency: (frequency: MaybeOption) => void;
  setOdourControlUnit: (key: string, qty: number) => void;

  /* ---------- Generic field updates & reset ---------- */
  updateField: (field: string, value: string) => void;
  updateFieldBoolean: (field: string, value: boolean) => void;
  reset: () => void;
}

/* -------------------------- Initial State Slice ------------------------- */
/** Only state (no actions) so we can safely reuse it in reset(). */
type StateOnly = Omit<
  ServiceAgreementStore,
  | "setPage"
  | "setProgress"
  | "setTrimmedDataURL"
  | "setSameAddress"
  | "setCompanyDetailsEdited"
  | "setAdditionalContacts"
  | "setServiceAgreement"
  | "setChuteCleaningFrequency"
  | "setEquipmentMaintenanceFrequency"
  | "setWasteRoomCleaningFrequency"
  | "setOdourControlFrequency"
  | "setSelfClosingHopperDoorInspectionFrequency"
  | "setBinCleaningFrequency"
  | "updateField"
  | "setOdourControlUnit"
  | "updateFieldBoolean"
  | "reset"
>;

const initialState: StateOnly = {
  /* ---------- UI / Progress ---------- */
  page: 1,
  progress: 1,

  /* ---------- Signature & Agreement ---------- */
  signFullName: "",
  signTitle: "",
  conditionAgree: false,
  trimmedDataURL: undefined,

  /* ---------- Account Contact Details ---------- */
  accountFirstName: "",
  accountLastName: "",
  accountTitle: "",
  accountEmail: "",
  accountPhone: "",
  accountMobile: "",

  /* ---------- Postal Address ---------- */
  postalStreetAddress: "",
  postalCity: "",
  postalState: "",
  postalPostcode: "",
  postalCountry: "",

  /* ---------- Contact Preferences ---------- */
  QuoteContact: false,
  JobContact: false,
  InvoiceContact: false,
  StatementContact: false,
  PrimaryQuoteContact: false,
  PrimaryJobContact: false,
  PrimaryInvoiceContact: false,
  PrimaryStatementContact: false,

  /* ---------- Business / Billing ---------- */
  businessStreetAddress: "",
  businessCity: "",
  businessPostcode: "",
  businessState: "",
  companyName: "",
  abn: "",
  sameAddres: false,
  companyDetailsEdited: false,
  odourControlUnits: {},

  /* ---------- Additional Contacts ---------- */
  additionalContacts: [],

  /* ---------- Loaded Service Agreement ---------- */
  serviceAgreement: null,

  /* ---------- Service Frequencies ---------- */
  chuteCleaningFrequency: null,
  equipmentMaintenanceFrequency: null,
  wasteRoomCleaningFrequency: null,
  odourControlFrequency: null,
  selfClosingHopperDoorInspectionFrequency: null,
  binCleaningFrequency: null,
  
};

/* -------------------------------- Store -------------------------------- */

export const useServiceAgreementStore = create<ServiceAgreementStore>((set) => ({
  ...initialState,

  /* ---------- UI / Progress ---------- */
  setPage: (page) => set({ page }),
  setProgress: (progress) => set({ progress }),

  /* ---------- Signature & Agreement ---------- */
  setTrimmedDataURL: (trimmedDataURL) => set({ trimmedDataURL }),

  /* ---------- Business / Billing ---------- */
  setSameAddress: (sameAddres) => set({ sameAddres }),
  setCompanyDetailsEdited: (edited) => set({ companyDetailsEdited: edited }),

  /* ---------- Additional Contacts ---------- */
  setAdditionalContacts: (additionalContacts) => set({ additionalContacts }),

  /* ---------- Loaded Service Agreement ---------- */
  setServiceAgreement: (sa) => set({ serviceAgreement: sa }),

  /* ---------- Service Frequencies ---------- */
  setChuteCleaningFrequency: (frequency) =>
    set({ chuteCleaningFrequency: frequency }),
  setEquipmentMaintenanceFrequency: (frequency) =>
    set({ equipmentMaintenanceFrequency: frequency }),
  setWasteRoomCleaningFrequency: (frequency) =>
    set({ wasteRoomCleaningFrequency: frequency }),
  setOdourControlFrequency: (frequency) =>
    set({ odourControlFrequency: frequency }),
  setSelfClosingHopperDoorInspectionFrequency: (frequency) =>
    set({ selfClosingHopperDoorInspectionFrequency: frequency }),
  setBinCleaningFrequency: (frequency) =>
    set({ binCleaningFrequency: frequency }),
  setOdourControlUnit: (key, qty) =>
    set((s) => ({
      odourControlUnits: {
        ...s.odourControlUnits,
        [key]: Math.max(0, Number.isFinite(qty) ? qty : 0),
      },
    })),

  /* ---------- Generic field updates & reset ---------- */
  updateField: (field, value) =>
    set(() => ({ [field]: value } as Partial<ServiceAgreementStore>)),
  updateFieldBoolean: (field, value) =>
    set(() => ({ [field]: value } as Partial<ServiceAgreementStore>)),

  reset: () => set({ ...initialState }),
}));
