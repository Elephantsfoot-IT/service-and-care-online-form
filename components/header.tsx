// components/Header.tsx
"use client";

export default function Header() {
  return (
    
    <header className="xl:hidden top-0 left-0 right-0 z-[999] h-[120px]  flex items-center px-4 xl:px-20">
      <div className="w-full max-w-screen-lg mx-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo/Elephants FootService Care Dark.svg"
        alt="EFG Service and Care"
        className="w-[150px] h-auto"
      />
      </div>
      
      
    </header>
  );
}
