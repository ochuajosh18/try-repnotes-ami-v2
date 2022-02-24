import { useState, ChangeEvent } from "react";
import _ from "lodash";
import { SortColumn } from "./constants";

export default function useTableUtils() {
  const [sortColumn, setSortColumn] = useState<SortColumn>({
    path: "dateCreated",
    order: "desc",
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const resetToPageOne = () => setPage(0);

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // sort handler
  const sortHandler = (sortCol: SortColumn) => {
    if (!sortCol) return;
    setSortColumn({ ...sortCol });
  };

  // sort function
  const sort = (items: any[], path: string, order: "asc" | "desc") =>
    _.orderBy(items, [path], [order]);

  // for table pagination
  const paginate = (items: any[], currentPage: number, pageSize: number) => {
    const startIndex = currentPage * pageSize;
    return _(items).slice(startIndex).take(pageSize).value();
  };

  return {
    sortColumn,
    sortHandler,
    sort,
    paginate,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    resetToPageOne,
  };
}
