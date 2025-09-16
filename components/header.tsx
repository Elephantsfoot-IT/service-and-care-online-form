// components/Header.tsx
"use client";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-[999] h-[100px] bg-white border-b border-neutral-200 flex items-center px-4">
      <img
        src="/logo/Elephants FootService Care Dark.svg"
        alt="EFG Service and Care"
        className="w-[150px] h-auto"
      />
      
    </header>
  );
}
