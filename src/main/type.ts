export interface TableSearchParams {
  pagination?: {
    current: number;
    pageSize: number;
  };
  sortField?: string;
  sortOrder?: string;
  filters?: any;
  searchStr?: string;
}
