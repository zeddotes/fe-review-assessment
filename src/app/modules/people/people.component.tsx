import { Person } from "./model";
import { usePeopleQuery } from "./query";
import { useEffect, useRef } from "react";
import EnhancedTablePagination from "../../shared/components/enhanced-table-pagination/enhanced-table-pagination.component";
import EnhancedTableHeader from "../../shared/components/enhanced-table-header/enhanced-table-header.component";
import {
  EnhancedTableContext,
  useEnhancedTableContext,
} from "../../shared/context/enhanced-table.context";
import { useEnhancedTable } from "../../shared/hooks";
import "./people.css";
import EnhancedTableSearch from "../../shared/components/enhanced-table-search/enhanced-table-search.component";
import EnhancedTableBody from "../../shared/components/enhanced-table-body/enhanced-table-body.component";
import CreatePersonDialog from "../../shared/components/create-person/create-person-dialog.component";

export function People() {
  const { data: people, loading, error } = usePeopleQuery();
  const enhancedPeopleDataProps = useEnhancedTable<Person>({
    data: people,
    pageSize: 10,
    searchBy: "name",
  });
  const { setSortInfo, setSearch, search } = enhancedPeopleDataProps;
  const addPersonModalRef = useRef<HTMLDialogElement | null>(null);

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
            <div className="flex gap-2 align-items-center">
              <CreatePersonDialog />

              <EnhancedTableSearch />
            </div>
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
                  const { name, show, actor, movies, dob, id } = data as Person;
                  return (
                    <tr key={`person-${id}`}>
                      <td>{name}</td>
                      <td>{show}</td>
                      <td>{actor}</td>
                      <td>{dob}</td>
                      <td>{movies.map(({ title }) => title).join(", ")}</td>
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
