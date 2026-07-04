import type { ReactNode } from "react";

export interface TableColumn<Row> {
  readonly key: string;
  readonly header: string;
  readonly render: (row: Row) => ReactNode;
}

export interface TableProps<Row> {
  readonly columns: readonly TableColumn<Row>[];
  readonly rows: readonly Row[];
  readonly getRowKey: (row: Row) => string;
}

export function Table<Row>({ columns, rows, getRowKey }: TableProps<Row>) {
  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key} scope="col">
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={getRowKey(row)}>
            {columns.map((column) => (
              <td key={column.key}>{column.render(row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
