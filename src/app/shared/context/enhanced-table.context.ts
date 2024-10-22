import { createContext, useContext } from "react";
import { UseEnhancedTableReturn, useEnhancedTable } from "../hooks";

export const EnhancedTableContext = createContext<
  UseEnhancedTableReturn<any> | undefined
>(undefined);

export const useEnhancedTableContext = <T>() => {
  const context = useContext(EnhancedTableContext);
  if (context === undefined) {
    throw new Error(
      "useEnhancedTableContext must be used within a EnhancedTableContext"
    );
  }

  return context;
};
