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

export interface UseEnhancedTableProps<T> {
  data: T[] | undefined;
  pageSize?: number;
  searchBy?: keyof T;
}

export interface UseEnhancedTableReturn<T> {
  data: T[] | undefined;
  page: number;
  setPage: Dispatch<React.SetStateAction<UseEnhancedTableReturn<T>["page"]>>;
  pageSize: number;
  setPageSize: Dispatch<
    React.SetStateAction<UseEnhancedTableReturn<T>["pageSize"]>
  >;
  rowCount: number | undefined;
  sortInfo: {
    order: "asc" | "desc";
    column: keyof T;
  } | null;
  setSortInfo: Dispatch<
    React.SetStateAction<UseEnhancedTableReturn<T>["sortInfo"]>
  >;
  search: string;
  setSearch: Dispatch<
    React.SetStateAction<UseEnhancedTableReturn<T>["search"]>
  >;
}

export function useEnhancedTable<T extends Record<string, any>>({
  data: initialData,
  searchBy,
  pageSize: initialPageSize,
}: UseEnhancedTableProps<T>): UseEnhancedTableReturn<T> {
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
      const newData = Object.assign([], data);
      if (sortInfo === null) return newData;

      return newData.sort((a: T, b: T) => {
        const { order, column } = sortInfo;
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
