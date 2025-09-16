import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { AdditionalContact } from "@/lib/interface";
import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import AdditionalcontactForm from "./additional-contact-form";


function AdditionalContactInfo() {
  const { additionalContacts, setAdditionalContacts } =
    useServiceAgreementStore();

    const handleChange = (data: AdditionalContact) => {
      setAdditionalContacts(
        additionalContacts.map(c => (c.id === data.id ? data : c))
      );
    };

  const handleDelete = (id: string) => {
    setAdditionalContacts(additionalContacts.filter((c) => c.id !== id));
  };

  const handleAddContact = () => {
    if (additionalContacts.length >= 3) {
      return;
    }
    setAdditionalContacts([
      ...additionalContacts,
      {
        id: crypto.randomUUID(),
        GivenName: "",
        FamilyName: "",
        Email: "",
        WorkPhone: "",
        CellPhone: "",
        Position: "",
        Department: "",
        QuoteContact: false,
        JobContact: false,
        InvoiceContact: false,
        StatementContact: false,
        PrimaryQuoteContact: false,
        PrimaryJobContact: false,
        PrimaryInvoiceContact: false,
        PrimaryStatementContact: false,
      },
    ]);
  };

  return (
    <div>
      <div className="flex justify-end mb-2">
        <Button
          disabled={additionalContacts.length >= 3}
          onClick={handleAddContact}
          variant="ghost"
        >
          <PlusIcon></PlusIcon>Add Contact
        </Button>
      </div>
      {additionalContacts.length === 0 ? (
        <div
          onClick={handleAddContact}
          className="text-sm w-full h-40 bg-neutral-50 rounded-md flex justify-center items-center gap-2 hover:underline cursor-pointer"
        >
          <PlusIcon className="size-4" /> Add Contact
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {additionalContacts.map((contact, index) => (
            <AdditionalcontactForm
              key={contact.id}
              contact={contact}
              index={index}
              handleDelete={handleDelete}
              handleChange={handleChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AdditionalContactInfo;
