import { useEnhancedTableContext } from "../../context/enhanced-table.context";

interface EnhancedTablePaginationProps<T> {
  pageSizes: number[];
  className?: string;
}

export default function EnhancedTablePagination<T>({
  pageSizes,
  className,
}: EnhancedTablePaginationProps<T>) {
  const { data, page, pageSize, rowCount, setPageSize, setPage } =
    useEnhancedTableContext<T>();

  if (!data || rowCount === undefined) return null;

  const starting = page * pageSize + 1;
  const until = starting + data.length - 1;
  const totalPages = Math.ceil(rowCount / pageSize);

  return (
    <div className={`flex align-items-center gap-2 mb-2 ${className || ""}`}>
      <div>
        Showing {starting}-{until} of {rowCount}
      </div>
      <div className="flex align-items-center gap-1">
        <button
          disabled={page === 0}
          onClick={() => {
            setPage(0);
          }}
          className="button-secondary"
        >
          First
        </button>
        <button
          disabled={page === 0}
          onClick={() => {
            setPage(page - 1);
          }}
          className="button-secondary"
        >
          Previous
        </button>
        <select
          value={pageSize.toString()}
          onChange={(c) => {
            setPage(0);
            setPageSize(Number(c.target.value));
          }}
        >
          {pageSizes.map((pageSizeOpt) => {
            return (
              <option
                key={`pagination-page-size-${pageSizeOpt}`}
                value={pageSizeOpt}
              >
                {pageSizeOpt}
              </option>
            );
          })}
        </select>
        <button
          disabled={page + 1 >= totalPages}
          onClick={() => {
            setPage(page + 1);
          }}
          className="button-secondary"
        >
          Next
        </button>
        <button
          disabled={page + 1 === totalPages}
          onClick={() => {
            setPage(totalPages - 1);
          }}
          className="button-secondary"
        >
          Last
        </button>
      </div>
    </div>
  );
}
