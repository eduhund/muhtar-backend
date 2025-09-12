export function getProjection(returns: string[] = []) {
  const projection: { [key: string]: 0 | 1 } = {};
  for (const param of returns) {
    projection[param] = 1;
  }
  return projection;
}

export function buildQuery(params: { [key: string]: any }) {
  const query: { [key: string]: any } = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) return;
    query[key] = value;
  });
  return query;
}
