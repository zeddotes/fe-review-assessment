import { Person } from "./model";
import { usePeopleQuery } from "./query";
import { useEffect } from "react";
import EnhancedTablePagination from "../../shared/components/enhanced-table-pagination/enhanced-table-pagination.component";
import EnhancedTableHeader from "../../shared/components/enhanced-table-header/enhanced-table-header.component";
import {
  EnhancedTableContext,
  useEnhancedTableContext,
} from "../../shared/context/enhanced-table.context";
import { useEnhancedTable } from "../../shared/hooks";
import "./people.css";
import EnhancedTableSearch from "../../shared/components/enhanced-table-search/enhanced-table-search.component";

export function People() {
  const { data: people, loading, error } = usePeopleQuery();
  const enhancedPeopleDataProps = useEnhancedTable<Person>({
    data: people,
    pageSize: 10,
    searchBy: "name",
  });
  const { setSortInfo, setSearch, search } = enhancedPeopleDataProps;

  useEffect(() => {
    setSortInfo({
      column: "name",
      order: "asc",
    });
  }, []);

  return (
    <>
      {loading ? (
        <p>Fetching People...</p>
      ) : enhancedPeopleDataProps.data === undefined || error ? (
        <h2>Oops! looks like something went wrong!</h2>
      ) : (
        <EnhancedTableContext.Provider value={enhancedPeopleDataProps}>
          <div className="flex justify-content-between">
            <EnhancedTableSearch />
            <EnhancedTablePagination pageSizes={[10, 15, 20]} />
          </div>
          {!enhancedPeopleDataProps.data.length ? (
            <h2>No People Available.</h2>
          ) : (
            <table>
              <thead>
                <tr>
                  <EnhancedTableHeader
                    headerKey="name"
                    label="Name"
                    isSortable
                  />
                  <EnhancedTableHeader
                    headerKey="show"
                    label="Show"
                    isSortable
                  />
                  <EnhancedTableHeader
                    headerKey="actor"
                    label="Actor/Actress"
                    isSortable
                  />
                  <EnhancedTableHeader headerKey="dob" label="Date of birth" />
                  <EnhancedTableHeader
                    headerKey="movies"
                    label="Movies"
                    isSortable
                  />
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
          )}
        </EnhancedTableContext.Provider>
      )}
    </>
  );
}

interface EnhancedTableBodyProps<T> {
  renderRow: (data: T) => JSX.Element;
}

function EnhancedTableBody<T>({ renderRow }: EnhancedTableBodyProps<T>) {
  const { data } = useEnhancedTableContext<T>();

  return <tbody>{(data as T[]).map((people) => renderRow(people))}</tbody>;
}
