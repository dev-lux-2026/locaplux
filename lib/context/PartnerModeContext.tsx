"use client";

import { createContext, useContext } from "react";

type PartnerModeContextType = {
  readOnly: boolean;
};

const PartnerModeContext = createContext<PartnerModeContextType>({
  readOnly: false,
});

export function PartnerModeProvider({
  readOnly,
  children,
}: {
  readOnly: boolean;
  children: React.ReactNode;
}) {
  return (
    <PartnerModeContext.Provider value={{ readOnly }}>
      {children}
    </PartnerModeContext.Provider>
  );
}

export function usePartnerMode() {
  return useContext(PartnerModeContext);
}
