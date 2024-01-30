export const API_URL = import.meta.env.VITE_API_BASE_URL;
export const ASSET_URL = `${API_URL}/file`;
export const createBlopUrl = (repoOwner, sha, path) => {
  return `https://github.com/${repoOwner}/blob/` + sha + '/' + path;
};
