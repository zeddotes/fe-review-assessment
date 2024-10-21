import { Person } from "./model";
import { usePeopleQuery } from "./query";

import "./people.css";
import {
  EnhancedTableContext,
  useContextFallback,
  useEnhancedTableContext,
  useEnhancedTableData,
} from "../../shared/hooks";
import { useEffect, useState } from "react";

export function People() {
  const { data: people, loading, error } = usePeopleQuery();
  const [pageSize, setPageSize] = useState(10);
  const enhancedTableDataProps = useEnhancedTableData<Person>({
    data: people,
    pageSize: 10,
    searchBy: "name",
  });
  const { setSortInfo, setSearch, search } = enhancedTableDataProps;

  useEffect(() => {
    setSortInfo({
      column: "name",
      order: "asc",
    });
  }, []);

  return (
    <>
      <input
        type="text"
        aria-label="Search"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value.trim());
        }}
      />
      {loading ? (
        <p>Fetching People...</p>
      ) : enhancedTableDataProps.data === undefined || error ? (
        <h2>Oops! looks like something went wrong!</h2>
      ) : !enhancedTableDataProps.data.length ? (
        <h2>No People Available.</h2>
      ) : (
        <EnhancedTableContext.Provider value={enhancedTableDataProps}>
          <table>
            <thead>
              <tr>
                <SortableHeader headerKey="name" label="Name" />
                <SortableHeader headerKey="show" label="Show" />
                <SortableHeader headerKey="actor" label="Actor/Actress" />
                <SortableHeader headerKey="dob" label="Date of birth" />
                <SortableHeader headerKey="movies" label="Movies" />
              </tr>
            </thead>
            <EnhancedTableBody
              renderRow={(data) => {
                const { name, show, actor, movies, dob } = data as Person;
                return (
                  <tr>
                    <td>{name}</td>
                    <td>{show}</td>
                    <td>{actor}</td>
                    <td>{dob}</td>
                    <td
                      dangerouslySetInnerHTML={{
                        __html: movies.map(({ title }) => title).join(", "),
                      }}
                    ></td>
                  </tr>
                );
              }}
            />
          </table>
          <EnhancedTablePagination />
        </EnhancedTableContext.Provider>
      )}
    </>
  );
}

interface SortableHeaderProps<T> {
  label: string;
  headerKey: keyof T;
}

function SortableHeader<T>({ label, headerKey }: SortableHeaderProps<T>) {
  const { sortInfo, setSortInfo } = useEnhancedTableContext<T>();
  const { column, order } = sortInfo || {};
  const isSorted = column === headerKey;

  return (
    <th
      onClick={() => {
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
      }}
      aria-sort={
        isSorted ? (order === "asc" ? "ascending" : "descending") : "none"
      }
    >
      <div className="sorted-column">
        {label}
        {isSorted && (
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

interface EnhancedTableBodyProps<T> {
  renderRow: (data: T) => JSX.Element;
}

function EnhancedTableBody<T>({ renderRow }: EnhancedTableBodyProps<T>) {
  const { data } = useEnhancedTableContext<T>();

  return <tbody>{(data as T[]).map((people) => renderRow(people))}</tbody>;
}

const PAGINATION_OPTIONS = ["10", "15", "20"];
interface EnhancedTablePaginationProps<T> {}

function EnhancedTablePagination<T>({}: EnhancedTablePaginationProps<T>) {
  const { data, page, pageSize, rowCount, setPageSize, setPage } =
    useEnhancedTableContext<T>();

  if (!data || rowCount === undefined) return null;

  const starting = page * pageSize + 1;
  const until = starting + data.length - 1;
  const totalPages = Math.ceil(rowCount / pageSize);

  return (
    <div>
      Showing {starting}-{until} of {rowCount}
      <button
        disabled={page === 0}
        onClick={() => {
          setPage(page - 1);
        }}
      >
        Previous
      </button>
      <select
        value={pageSize.toString()}
        onChange={(c) => {
          setPage(0);
          setPageSize(Number(c.target.value));
          console.log(c);
        }}
      >
        {PAGINATION_OPTIONS.map((pageSizeOpt) => {
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
      >
        Next
      </button>
      <button
        disabled={page + 1 === totalPages}
        onClick={() => {
          setPage(totalPages - 1);
        }}
      >
        Last
      </button>
    </div>
  );
}
