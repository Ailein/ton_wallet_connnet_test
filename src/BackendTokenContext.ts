// BackendTokenContext.tsx

import { createContext } from "react";

export const BackendTokenContext = createContext({
  token: undefined as string | undefined,
  setToken: (token: string | undefined) => {}, // 默认空函数
});
