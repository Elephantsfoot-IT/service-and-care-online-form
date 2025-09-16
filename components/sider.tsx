// components/Sider.tsx
"use client";

import FormVerticalProgress from "./service-agreement/form-vertical-progress";
import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";

export default function Sider() {
  const state = useServiceAgreementStore();
  return (
    <aside className="hidden xl:flex fixed left-0 top-[80px] z-[99] w-[400px] h-[calc(100vh-80px)] flex flex-col ">
      {state.page >= 2 && (
        <div className="p-10 pt-20">
          <FormVerticalProgress />
        </div>
      )}

      
    </aside>
  );
}
