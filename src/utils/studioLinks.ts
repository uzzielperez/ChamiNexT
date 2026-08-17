/** Deep-link helpers for the browser coding studio. */

export function studioProblemUrl(problemId: string): string {
  return `/studio?problem=${encodeURIComponent(problemId)}`;
}

export function studioTicketUrl(ticketId: string): string {
  return `/studio?ticket=${encodeURIComponent(ticketId)}`;
}

export function studioEmbedAssessUrl(roleId: string): string {
  return `/embed/assess/${encodeURIComponent(roleId)}`;
}
