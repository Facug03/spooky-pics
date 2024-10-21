export interface ResponsePagination<T> {
  data: T[]
  currentPage: number
  nextPage: number | null
}
