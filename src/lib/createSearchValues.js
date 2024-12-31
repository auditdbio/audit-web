import dayjs from 'dayjs';

const createSearchValues = (values, kind) => {
  const searchValues = {
    query: values?.search || '',
    tags: values?.tags || [],
    ready_to_wait: values?.ready_to_wait || '',
    dateFrom:
      +new Date() + 60000 < +new Date(values?.dateFrom)
        ? dayjs().valueOf(values?.dateFrom)
        : '',
    dateTo:
      +new Date() + 60000 < +new Date(values?.dateTo)
        ? dayjs().valueOf(values?.dateTo)
        : '',
    priceFrom: parseInt(values?.price?.from) || '',
    priceTo: parseInt(values?.price?.to) || '',
    sort: values?.sort || 1,
    page: values?.page || 0,
    perPage: values?.perPage ?? 10,
  };

  const queryParams = [
    `query=${searchValues.query}`,
    `tags=${searchValues.tags?.join(' ')}`,
    `sort_order=${searchValues.sort}`,
    `page=${searchValues.page}`,
    `sort_by=${values?.sort_by || 'price'}`,
    `per_page=${searchValues.perPage}`,
    `kind=${kind}`,
  ];

  if (searchValues.ready_to_wait) {
    queryParams.push(`ready_to_wait=${searchValues.ready_to_wait}`);
  }
  if (searchValues.priceFrom) {
    queryParams.push(`price_from=${searchValues.priceFrom}`);
  }
  if (searchValues.priceTo) {
    queryParams.push(`price_to=${searchValues.priceTo}`);
  }
  if (searchValues.dateFrom) {
    queryParams.push(`date_from=${searchValues.dateFrom}`);
  }
  if (searchValues.dateTo) {
    queryParams.push(`date_to=${searchValues.dateTo}`);
  }

  return queryParams.join('&');
};

export default createSearchValues;
