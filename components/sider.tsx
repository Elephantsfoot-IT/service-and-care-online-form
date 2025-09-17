// components/Sider.tsx
"use client";

import FormVerticalProgress from "./service-agreement/form-vertical-progress";
import ServiceVerticalProgress from "./service-agreement/service-vertical-progress";
import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";

export default function Sider({ activeId, onJump }: { activeId: string, onJump: (id: string) => void }) {
  const state = useServiceAgreementStore();
  return (
    <aside className="hidden xl:flex fixed left-0 top-[100px] z-[99] w-[400px] h-[calc(100vh-100px)] flex flex-col ">
      {state.page === 1 && <div className="p-10 pt-20">
        <ServiceVerticalProgress activeId={activeId} onJump={onJump} />
      </div>}

      {state.page >= 2 && (
        <div className="p-10 pt-20">
          <FormVerticalProgress />
        </div>
      )}
    </aside>
  );
}
