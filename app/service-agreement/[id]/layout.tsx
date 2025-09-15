"use client";


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <title>
        Service Agreement
      </title>
      <div className="relative text-neutral-700">{children}</div>{" "}
    </>
  );
}
