/**
 * Gets the current pathname without the language information.
 *
 * @param {string} pathname - The full pathname (may include language information).
 * @param {string} lang - The language information to be removed from the pathname.
 * @returns {string} - The pathname without the language information.
 */
export const getCurrentLocation = (pathname: string, lang: string) => {
  const urlEnd = pathname.split(`/${lang}`);
  return urlEnd.find((url) => url !== "") || "";
};

/**
 * Gets the current query parameters from the URL.
 *
 * @param {URLSearchParams} searchParams - The URL search parameters.
 * @returns {Record<string, string>} - The current query parameters.
 */
export const currentQueryParams = (searchParams: URLSearchParams) => {
  return Object.fromEntries(searchParams.entries());
};
