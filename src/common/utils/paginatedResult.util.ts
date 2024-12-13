export class PaginatedResult<T> {
  results: T[];
  pagination: {
    perPage: number;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    nextPage: string | null;
    prevPage: string | null;
  };

  constructor(
    results: T[],
    perPage: number,
    currentPage: number,
    totalItems: number,
    baseUrl: string,
  ) {
    const totalPages = Math.ceil(totalItems / perPage);

    this.results = results;
    this.pagination = {
      perPage,
      currentPage,
      totalPages,
      totalItems,
      nextPage:
        currentPage < totalPages
          ? `${baseUrl}?page=${currentPage + 1}&offset=${currentPage * perPage}`
          : null,
      prevPage:
        currentPage > 1
          ? `${baseUrl}?page=${currentPage - 1}&offset=${(currentPage - 2) * perPage}`
          : null,
    };
  }
}
