import { useEnhancedTableContext } from "../../context/enhanced-table.context";

export default function EnhancedTableSearch() {
  const { search, setSearch, setPage, page } = useEnhancedTableContext();
  return (
    <input
      type="text"
      aria-label="Search"
      value={search}
      placeholder="Search"
      className="h-fit p-1"
      onChange={(e) => {
        setSearch(e.target.value.trim());
        if (page !== 0) setPage(0);
      }}
    />
  );
}
