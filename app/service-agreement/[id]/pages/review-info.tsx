"use client";
import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { scrollToTop } from "@/lib/utils";
import { ArrowLeftIcon, ListCheckIcon } from "lucide-react";
import { useEffect } from "react";

export default function ReviewInfo() {
  const state = useServiceAgreementStore();

  useEffect(() => {
    scrollToTop();
  }, []);

  const goBack = () => state.setPage(5); // back to Site Info
  const goNext = () => state.setPage(7); // forward to Terms & Signature

  return (
    <div className="w-full mx-auto">
      <div className="size-12 border border-neutral-200 rounded-md flex items-center justify-center shadow-xs mb-4">
        <ListCheckIcon className="size-6 text-neutral-600"></ListCheckIcon>
      </div>
      <Label className="text-xl mb-1">Review Details</Label>
      <span className="text-lg mb-10 text-neutral-500">
        Please review your selected services and the information you’ve
        provided.
      </span>

      {/* Company Details */}
      <div className="p-4 md:p-6 2xl:p-8 flex flex-col gap-2 mt-4 mb-6 border border-neutral-200 rounded-md shadow-xs">
        <div className="flex flex-row space-x-4 items-center">
          <Label className="text-lg break-words ">Company Details</Label>
          <Button
            variant="ghost"
            className="text-sm ml-auto"
            onClick={() => state.setPage(2)} // go edit Customer/Company step
          >
            Edit
          </Button>
        </div>

        <div className="flex flex-col">
          <div className="flex flex-col space-y-4 rounded-md">
            <div className="flex flex-col space-y-1">
              <Label className="text-neutral-500 text-sm">
                {state.companyType === "Other"
                  ? "Company name"
                  : "Strata plan number (CTS/SP/OC)"}
              </Label>
              <span className="text-base break-words">
                {state.companyName || "N/A"}
              </span>
            </div>

            <div className="flex flex-col space-y-1">
              <Label className="text-neutral-500 text-sm">ABN</Label>
              <span className="text-base break-words">
                {state.abn || "N/A"}
              </span>
            </div>

            <div className="flex flex-col space-y-1">
              <Label className="text-neutral-500">Business address</Label>
              {state.businessStreetAddress &&
              state.businessCity &&
              state.businessPostcode &&
              state.businessState ? (
                <span className="text-base break-words">
                  {state.businessStreetAddress}, {state.businessCity}{" "}
                  {state.businessState} {state.businessPostcode}, Australia
                </span>
              ) : (
                <span className="text-base break-words">N/A</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Billing Details */}
      <div className="p-4 md:p-6 2xl:p-8 flex flex-col gap-2 mt-4 mb-6 border border-neutral-200 rounded-md shadow-xs">
        <div className="flex flex-row space-x-4 items-center">
          <Label className="text-lg break-words ">Billing Details</Label>
          <Button
            variant="ghost"
            className="text-sm ml-auto"
            onClick={() => state.setPage(3)} // go edit Billing step
          >
            Edit
          </Button>
        </div>

        <div className="flex flex-col">
          <div className="flex flex-col space-y-4 rounded-md">
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 w-full">
              <div className="flex-1 flex flex-col space-y-1">
                <Label className="text-neutral-500 text-sm">First name</Label>
                <span className="text-base break-words">
                  {state.accountFirstName || "N/A"}
                </span>
              </div>
              <div className="flex-1 flex flex-col space-y-1">
                <Label className="text-neutral-500 text-sm">Last name</Label>
                <span className="text-base break-words">
                  {state.accountLastName || "N/A"}
                </span>
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <Label className="text-neutral-500 text-sm">Email address</Label>
              <span className="text-base break-words">
                {state.accountEmail || "N/A"}
              </span>
            </div>

            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 w-full">
              <div className="flex flex-col space-y-1 w-1/2">
                <Label className="text-neutral-500 text-sm">Mobile phone</Label>
                <span className="text-base break-words">
                  {state.accountMobile || "N/A"}
                </span>
              </div>
              <div className="flex flex-col space-y-1 w-1/2">
                <Label className="text-neutral-500 text-sm">Office phone</Label>
                <span className="text-base break-words">
                  {state.accountPhone || "N/A"}
                </span>
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <Label className="text-neutral-500">Postal address</Label>
              {state.postalStreetAddress &&
              state.postalCity &&
              state.postalState &&
              state.postalPostcode ? (
                <span className="text-base break-words">
                  {state.postalStreetAddress}, {state.postalCity}{" "}
                  {state.postalState} {state.postalPostcode}, Australia
                </span>
              ) : (
                <span className="text-base break-words">N/A</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <>
        {state.additionalContacts.map((contact, index) => (
          <div
            key={contact.id}
            className="p-4 md:p-6 2xl:p-8 flex flex-col gap-2 mt-4 mb-6 border border-neutral-200 rounded-md shadow-xs"
          >
            <div className="flex flex-row space-x-4 items-center">
              <Label className="text-lg break-words ">
                Additional Contact ({index + 1})
              </Label>
              <Button
                variant="ghost"
                className="text-sm ml-auto"
                onClick={() => state.setPage(4)} // go edit Billing step
              >
                Edit
              </Button>
            </div>

            <div className="flex flex-col">
              <div className="flex flex-col space-y-4 rounded-md">
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 w-full">
                  <div className="flex-1 flex flex-col space-y-1">
                    <Label className="text-neutral-500 text-sm">
                      First name
                    </Label>
                    <span className="text-base break-words">
                      {contact.GivenName || "N/A"}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col space-y-1">
                    <Label className="text-neutral-500 text-sm">
                      Last name
                    </Label>
                    <span className="text-base break-words">
                      {contact.FamilyName || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 w-full">
                  <div className="flex flex-col space-y-1 flex-1">
                    <Label className="text-neutral-500 text-sm">
                      Department
                    </Label>
                    <span className="text-base break-words">
                      {contact.Department || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col space-y-1 flex-1">
                    <Label className="text-neutral-500 text-sm">Position</Label>
                    <span className="text-base break-words">
                      {contact.Position || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <Label className="text-neutral-500 text-sm">
                    Email address
                  </Label>
                  <span className="text-base break-words">
                    {contact.Email || "N/A"}
                  </span>
                </div>

                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 w-full">
                  <div className="flex flex-col space-y-1 w-1/2">
                    <Label className="text-neutral-500 text-sm">
                      Mobile phone
                    </Label>
                    <span className="text-base break-words">
                      {contact.CellPhone || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col space-y-1 w-1/2">
                    <Label className="text-neutral-500 text-sm">
                      Office phone
                    </Label>
                    <span className="text-base break-words">
                      {contact.WorkPhone || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </>

      {/* Nav */}
      <div className="flex flex-row gap-2 justify-between mt-10">
        <Button
          variant="outline"
          onClick={goBack}
          className="w-fit cursor-pointer"
        >
          <ArrowLeftIcon /> Back
        </Button>
        <Button
          onClick={goNext}
          className="w-[200px] cursor-pointer"
          variant="efg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
