import { useEnhancedTableContext } from "../../context/enhanced-table.context";

interface EnhancedTableBodyProps<T> {
  renderRow: (data: T) => JSX.Element;
}

export default function EnhancedTableBody<T>({
  renderRow,
}: EnhancedTableBodyProps<T>) {
  const { data } = useEnhancedTableContext<T>();

  return <tbody>{(data as T[]).map((people) => renderRow(people))}</tbody>;
}
