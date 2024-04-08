export const API_URL = import.meta.env.VITE_API_BASE_URL;
export const BASE_URL = import.meta.env.BASE_URL;
export const TWITTER_CLIENT_ID = import.meta.env.VITE_TWITTER_CLIENT_ID;
export const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
export const LINKEDIN_CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
export const ASSET_URL = `${API_URL}/file`;
export const createBlopUrl = (repoOwner, sha, path) => {
  return `https://github.com/${repoOwner}/blob/` + sha + '/' + path;
};
