import { useEnhancedTableContext } from "../../context/enhanced-table.context";
import "./enhanced-table-header.css";

export interface SortableHeaderProps<T> {
  label: string;
  headerKey: keyof T;
  isSortable?: boolean;
}

export default function EnhancedTableHeader<T>({
  label,
  headerKey,
  isSortable = false,
}: SortableHeaderProps<T>) {
  const { sortInfo, setSortInfo } = useEnhancedTableContext<T>();
  const { column, order } = sortInfo || {};
  const isSorted = column === headerKey;

  return (
    <th
      onClick={() => {
        if (isSortable) {
          setSortInfo((sortOrder) => {
            if (!sortOrder || headerKey !== sortOrder.column) {
              return {
                column: headerKey as keyof T,
                order: "asc",
              };
            } else if (sortOrder.order === "asc") {
              return {
                column: headerKey as keyof T,
                order: "desc",
              };
            } else {
              return null;
            }
          });
        }
      }}
      aria-sort={
        isSortable && isSorted
          ? order === "asc"
            ? "ascending"
            : "descending"
          : "none"
      }
    >
      <div className={isSortable ? "sortable-header" : ""}>
        {label}
        {isSortable && isSorted && (
          <>
            {order === "asc" ? (
              <i className="fa-solid fa-arrow-down-a-z"></i>
            ) : order === "desc" ? (
              <i className="fa-solid fa-arrow-up-a-z"></i>
            ) : null}
          </>
        )}
      </div>
    </th>
  );
}
