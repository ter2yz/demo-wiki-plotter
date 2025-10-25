export interface ParsedTable {
  headers: string[];
  rows: string[][];
}

export interface NumericColumn {
  columnIndex: number;
  columnName: string;
  values: number[];
  rawValues: string[];
}
