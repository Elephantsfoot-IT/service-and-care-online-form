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

export interface ServiceAgreement {
  id: string;
  simpro_customer_id: string;
  simpro_account_id: string;
  quote_for: string;
  created_at: string;
  status: string;
  sites: Site[];
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
}

// src/lib/service-agreement/services.ts
export type ServiceType =
  | "chute_cleaning"
  | "equipment_maintenance"
  | "hopper_door_inspection"
  | "waste_room_pressure_clean"
  | "odour_control"
  | "bin_cleaning";

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
