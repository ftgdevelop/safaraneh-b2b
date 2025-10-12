import { createContext, useContext } from "react";
import { StrapiData } from "../../types/common";

interface StrapiContextType {
  strapiData: StrapiData | null;
}

export const StrapiContext = createContext<StrapiContextType>({
  strapiData: null,
});

export const useStrapiData = () => useContext(StrapiContext);