import {
  Context,
  createContext,
  Dispatch,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface UseEnhancedTableDataProps<T> {
  data: T[] | undefined;
  pageSize?: number;
  searchBy?: keyof T;
}

interface UseEnhancedTableDataContext<T> {
  data: T[] | undefined;
  page: number;
  setPage: Dispatch<
    React.SetStateAction<UseEnhancedTableDataContext<T>["page"]>
  >;
  pageSize: number;
  setPageSize: Dispatch<
    React.SetStateAction<UseEnhancedTableDataContext<T>["pageSize"]>
  >;
  rowCount: number | undefined;
  sortInfo: {
    order: "asc" | "desc";
    column: keyof T;
  } | null;
  setSortInfo: Dispatch<
    React.SetStateAction<UseEnhancedTableDataContext<T>["sortInfo"]>
  >;
  search: string;
  setSearch: Dispatch<
    React.SetStateAction<UseEnhancedTableDataContext<T>["search"]>
  >;
}

export function useEnhancedTableData<T extends Record<string, any>>({
  data: initialData,
  searchBy,
  pageSize: initialPageSize,
}: UseEnhancedTableDataProps<T>): UseEnhancedTableDataContext<T> {
  const [pageSize, setPageSize] = useState(initialPageSize ?? 10);
  const [page, setPage] = useState(0);
  const [rowCount, setRowCount] = useState<number | undefined>();
  const [sortInfo, setSortInfo] = useState<{
    order: "asc" | "desc";
    column: keyof T;
  } | null>(null);
  const [search, setSearch] = useState<string>("");

  const paginateFn = useCallback(
    (data: T[]) => {
      if (pageSize !== null && pageSize !== undefined) {
        const startIndex = page * pageSize;
        const endIndex = startIndex + pageSize;
        return data.slice(startIndex, endIndex);
      }
      return data;
    },
    [pageSize, page]
  );

  const sortFn = useCallback(
    (data: T[]) => {
      if (sortInfo === null) return data;
      const { order, column } = sortInfo;
      return data.sort((a: T, b: T) => {
        if (a[column] < b[column]) return order === "asc" ? -1 : 1;
        if (a[column] > b[column]) return order === "asc" ? 1 : -1;
        return 0;
      });
    },
    [sortInfo]
  );

  const searchFn = useCallback(
    (data: T[]) => {
      const searchVal = search.trim().toLowerCase();
      if (searchBy === undefined || searchVal === "") return data;
      return data.filter((dataObj) => {
        const searchByPropValue = dataObj[searchBy];
        return searchByPropValue?.toLowerCase?.().trim().includes(searchVal);
      });
    },
    [search, searchBy]
  );

  const data = useMemo(() => {
    if (initialData === undefined) {
      setRowCount(undefined);
      return;
    }

    const results = sortFn(searchFn(initialData));
    setRowCount(results.length);
    return paginateFn(results);
  }, [initialData, sortFn, paginateFn, searchFn]);

  return {
    data,
    page,
    pageSize,
    sortInfo,
    setSortInfo,
    setSearch,
    setPageSize,
    search,
    rowCount,
    setPage,
  };
}

export const EnhancedTableContext = createContext<
  UseEnhancedTableDataContext<any> | undefined
>(undefined);
EnhancedTableContext.displayName = "EnhancedTableContext";

export const useEnhancedTableContext = <T>() => {
  const context = useContext(
    EnhancedTableContext
  ) as UseEnhancedTableDataContext<T>;
  if (context === undefined) {
    throw new Error(
      "useEnhancedTableContext must be used within a EnhancedTableContext"
    );
  }

  return context;
};
