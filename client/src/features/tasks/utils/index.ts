type TaskQueryParams = {
  page: string | null;
  completed: string | null;
  priority: string | null;
  limit: string | null;
};

export function getTaskQueryParams(): TaskQueryParams {
  const searchParams = new URLSearchParams(window.location.search);
  return {
    page: searchParams.get('page'),
    completed: searchParams.get('completed'),
    priority: searchParams.get('priority'),
    limit: searchParams.get('limit'),
  };
}
