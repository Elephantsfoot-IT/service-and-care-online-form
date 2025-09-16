export interface AddressOption {
  label: string;
  value: string;
  placeId: string;
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
