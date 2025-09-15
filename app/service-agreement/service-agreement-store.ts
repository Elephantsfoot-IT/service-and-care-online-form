import { create } from "zustand";

export interface ServiceAgreementStore {
  page: number;
  setPage: (page: number) => void;
  reset: () => void;
  trimmedDataURL: string | undefined;
  setTrimmedDataURL: (trimmedDataURL: string | undefined) => void;
  updateField: (field: string, value: string) => void;
  updateFieldBoolean: (field: string, value: boolean) => void;
  signFullName: string;
  signTitle: string;
  conditionAgree: boolean;
}

export const useServiceAgreementStore = create<ServiceAgreementStore>(
  (set) => ({
    page: 4,
    setPage: (page) => set({ page: page }),
    signFullName: "",
    signTitle: "",
    conditionAgree: false,
    trimmedDataURL: undefined,
    setTrimmedDataURL: (trimmedDataURL: string | undefined) =>
      set({ trimmedDataURL: trimmedDataURL }),

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

    reset: () => set({ page: 1 }),
  })
);
