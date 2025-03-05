import dayjs from 'dayjs';

const createSearchValuesV2 = (values, kind) => {
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
    ratingFrom: parseInt(values?.rating?.from) || '',
    ratingTo: parseInt(values?.rating?.to) || '',
    sort: values?.sort || 1,
    page: values?.page || 1,
    perPage: values?.perPage ?? 10,
  };

  const queryParams = [
    searchValues.query ? `text=${searchValues.query}` : '',
    searchValues.tags.length > 0 ? `tags=${searchValues.tags?.join(' ')}` : '',
    searchValues.ratingFrom ? `rating_from=${searchValues.ratingFrom}` : '',
    searchValues.ratingTo ? `rating_to=${searchValues.ratingTo}` : '',
    `sort_order=${searchValues.sort}`,
    `page=${searchValues.page}`,
    `sort_by=${values?.sort_by || 'relevance'}`,
    `per_page=${searchValues.perPage}`,
    `partial_match=true`,
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

  return queryParams.filter(Boolean).join('&');
};

export default createSearchValuesV2;
