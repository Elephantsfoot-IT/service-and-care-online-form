import { create } from "zustand";

export interface ServiceAgreementStore {
  page: number;
  setPage: (page: number) => void;
  reset: () => void;
  trimmedDataURL: string | undefined;
  setTrimmedDataURL: (trimmedDataURL: string | undefined) => void;
}

export const useServiceAgreementStore = create<ServiceAgreementStore>(
  (set) => ({
    page: 4,
    setPage: (page) => set({ page: page }),

    trimmedDataURL: undefined,
    setTrimmedDataURL: (trimmedDataURL: string | undefined) =>
      set({ trimmedDataURL: trimmedDataURL }),

    reset: () => set({ page: 1 }),
  })
);
