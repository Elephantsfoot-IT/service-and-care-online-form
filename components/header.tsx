// components/Header.tsx
"use client";

export default function Header() {
  return (
    <header className="xl:hidden  top-0 left-0 right-0 z-[999] h-[100px] bg-white  flex items-center px-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo/Elephants FootService Care Dark.svg"
        alt="EFG Service and Care"
        className="w-[150px] h-auto"
      />
      
    </header>
  );
}
