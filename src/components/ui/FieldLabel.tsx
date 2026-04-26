import type { ReactNode } from "react";

export const FieldLabel = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <label className="flex flex-col gap-1">
    <span className="text-sm text-fg-muted">{label}</span>
    {children}
  </label>
);
