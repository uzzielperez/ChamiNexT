/** Routes that use the immersive studio shell (no site header/footer). */
export function isStudioPath(pathname: string): boolean {
  return (
    pathname === '/studio' ||
    pathname.startsWith('/studio/') ||
    pathname.startsWith('/embed/')
  );
}

export function isEmbedPath(pathname: string): boolean {
  return pathname.startsWith('/embed/');
}
