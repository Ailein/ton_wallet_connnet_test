// ProvideBackendAuth.tsx

import React, { useState } from "react";
import { BackendTokenContext } from "./BackendTokenContext";

export const ProvideBackendAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | undefined>(undefined);

  return (
    <BackendTokenContext.Provider value={{ token, setToken }}>
      {children}
    </BackendTokenContext.Provider>
  );
};
