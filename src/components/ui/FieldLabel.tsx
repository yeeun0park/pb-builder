import type { ReactNode } from "react";

export const FieldLabel = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-[13px] font-bold text-porcelain-700">{label}</span>
    {children}
  </label>
);
