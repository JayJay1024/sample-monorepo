import { Dispatch, PropsWithChildren, SetStateAction, createContext, useState } from "react";

interface AppCtx {
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
}

export const AppContext = createContext<AppCtx>({ count: 0, setCount: () => undefined });

export function AppProvider({ children }: PropsWithChildren<unknown>) {
  const [count, setCount] = useState<AppCtx["count"]>(0);

  return <AppContext.Provider value={{ count, setCount }}>{children}</AppContext.Provider>;
}
