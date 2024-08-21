import React from "react";

export function Center({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex-col justify-center">
      <div className="flex justify-center">{children}</div>
    </div>
  );
}
