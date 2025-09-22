export interface AddressOption {
  label: string;
  value: string;
  placeId: string;
}

export interface Address {
  Address: string;
  City: string;
  State: string;
  PostalCode: string;
  Country: string;
}

export interface AdditionalContact {
  id: string;
  GivenName: string;
  FamilyName: string;
  Email: string;
  WorkPhone: string;
  CellPhone: string;
  Position: string;
  Department: string;
  QuoteContact: boolean;
  JobContact: boolean;
  InvoiceContact: boolean;
  StatementContact: boolean;
  PrimaryStatementContact: boolean;
  PrimaryInvoiceContact: boolean;
  PrimaryJobContact: boolean;
  PrimaryQuoteContact: boolean;
}

export interface SiteContact {
  id: string;
  GivenName: string;
  FamilyName: string;
  Email: string;
  WorkPhone: string;
  CellPhone: string;
  Position: string;
  Department: string;
}

export interface BillingDetails {
  accountFirstName?: string;
  accountLastName?: string;
  accountEmail?: string;
  accountPhone?: string;
  accountMobile?: string;
  postalStreetAddress?: string;
  postalCity?: string;
  postalState?: string;
  postalPostcode?: string;
  postalCountry?: string;
}

export interface CompanyInfo {
  abn?: string;
  companyName?: string;
  businessStreetAddress?: string;
  businessCity?: string;
  businessState?: string;
  businessPostcode?: string;
  businessCountry?: string;
}

export interface ServiceAgreement {
  id: string;
  simpro_customer_id: string;
  quote_for: string;
  created_at: string;
  status: string;
  sites: Site[];
  incentives: boolean;
  end_date: Date;
  start_date: Date;
  expire_at: Date;
  company_details?: CompanyInfo;
  billing_details?: BillingDetails;
}

export interface Building {
  id: string;
  name: string;
  services: Service[];
}

export interface Site {
  site_name: string;
  simpro_site_id: string;
  buildings: Building[];
  mode: "new" | "existing";
  site_address: Address;
  site_contacts?: SiteContact[];
}

// src/lib/service-agreement/services.ts
export type ServiceType =
  | "chute_cleaning"
  | "equipment_maintenance"
  | "hopper_door_inspection"
  | "waste_room_pressure_clean"
  | "bin_cleaning"
  | "odour_control";

export type ServiceBase = { id: string; type: ServiceType };

export type ChuteCleaningService = ServiceBase & {
  type: "chute_cleaning";
  levels: string;
  chutes: string;
  price: string;
};

export type EquipmentMaintenanceService = ServiceBase & {
  type: "equipment_maintenance";
  equipment: string;
  equipment_label: string;
  price: string;
};

export type HopperDoorInspectionService = ServiceBase & {
  type: "hopper_door_inspection";
  price: string;
};

export type WasteRoomPressureCleanService = ServiceBase & {
  type: "waste_room_pressure_clean";
  price: string;
  area: string;
  area_label: string;
};

export type OdourControlService = ServiceBase & {
  type: "odour_control";
  price: string;
};

export type BinCleaningService = ServiceBase & {
  type: "bin_cleaning";
  price: string;
};

export type Service =
  | ChuteCleaningService
  | EquipmentMaintenanceService
  | HopperDoorInspectionService
  | WasteRoomPressureCleanService
  | OdourControlService
  | BinCleaningService;

export const SECTION_IDS = [
  "chute_cleaning",
  "equipment_maintenance",
  "hopper_door_inspection",
  "waste_room_pressure_clean",
  "bin_cleaning",
  "odour_control",
  "rewards",
] as const;

export type Option = "quarterly" | "six-monthly" | "yearly";
export type MaybeOption = Option | null;

export const options: {
  label: string;
  value: Option;
  subtext: string;
  recommended?: boolean;
}[] = [
  { label: "Yearly", value: "yearly", subtext: "1 service per year" },
  {
    label: "Six-Monthly",
    value: "six-monthly",
    subtext: "2 services per year",
  },
  {
    label: "Quarterly",
    value: "quarterly",
    subtext: "4 services per year",
    recommended: true,
  },
];

export const defaultSiteContact: SiteContact = {
  id: "",
  GivenName: "",
  FamilyName: "",
  Email: "",
  WorkPhone: "",
  CellPhone: "",
  Position: "",
  Department: "",
};

export type ServiceByType<T extends ServiceType> = T extends "chute_cleaning"
  ? ChuteCleaningService
  : T extends "equipment_maintenance"
    ? EquipmentMaintenanceService
    : T extends "hopper_door_inspection"
      ? HopperDoorInspectionService
      : T extends "waste_room_pressure_clean"
        ? WasteRoomPressureCleanService
        : T extends "odour_control"
          ? OdourControlService
          : T extends "bin_cleaning"
            ? BinCleaningService
            : never;

type WithContext<S> = S & {
  site_name: string;
  site_id: string;
  building_id: string;
  building_name: string | null;
};

export type GetServicesReturnTyped<T extends ServiceType> = {
  type: T;
  items: Array<WithContext<ServiceByType<T>>>;
};
