import axios from "axios";

const LOCALSTORAGE_KEYS = {
  accessToken: "spotify_access_token",
  refreshToken: "spotify_refresh_token",
  expireTime: "spotify_token_expire_time",
  timeStamp: "spotify_token_timestamp",
};

const LOCALSTORAGE_VALUES = {
  accessToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
  refreshToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
  expireTime: window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
  timeStamp: window.localStorage.getItem(LOCALSTORAGE_KEYS.timeStamp),
};

/**
 * clear out all localstorage items we've set and reload the page
 * @returns {void}
 */

export const logout = () => {
  // clear localstorage
  for (const property in LOCALSTORAGE_KEYS) {
    window.localStorage.removeItem(LOCALSTORAGE_KEYS[property]);
  }
  // go to homepage
  window.location = window.location.origin;
};

/**
 *  use refresh token in local storage to hit the /refresh_token endpoint
 * then update values in local storage with data from response
 * @returns {void}
 */
const refreshToken = async () => {
  try {
    // logout if there is not token stored or we've managed to get into reload infinite loop
    if (
      !LOCALSTORAGE_VALUES.refreshToken ||
      LOCALSTORAGE_VALUES.refreshToken === "undefined" ||
      Date.now() - Number(LOCALSTORAGE_VALUES.timeStamp) / 1000 < 1000
    ) {
      console.error("no refresh token available");
      logout();
    }
    // use /refresh_token endpoint
    const { data } = await axios.get(
      `/refresh_token?refresh_token=${LOCALSTORAGE_VALUES.refreshToken}`
    );
    // update local storage values
    window.localStorage.setItem(
      LOCALSTORAGE_KEYS.accessToken,
      data.access_token
    );
    window.localStorage.setItem(LOCALSTORAGE_KEYS.timeStamp, Date.now());
    // reload the page for localstorage updates to be reflected
    window.location.reload();
  } catch (e) {
    console.error(e);
  }
};
/**
 * check if the amount of time that has elapsed between thr timestamp in localstorage
 * and now is greater than the expiration time of 3600 seconds (1hour)
 * @returns {boolean} whether or not the access token in locals storage has expired
 */

const hasTokenExpired = () => {
  const { accessToken, timeStamp, expireTime } = LOCALSTORAGE_VALUES;
  if (!accessToken || !timeStamp) {
    return false;
  }
  const millisecondsElapsed = Date.now() - Number(timeStamp);
  return millisecondsElapsed / 1000 > Number(expireTime);
};

/**
 * handles logic for retrieving spotify access token form local storage
 * or URL query params
 * @returns {string} a spotify access token
 */

const getAccessToken = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const queryParams = {
    [LOCALSTORAGE_KEYS.accessToken]: urlParams.get("access_token"),
    [LOCALSTORAGE_KEYS.refreshToken]: urlParams.get("refresh_token"),
    [LOCALSTORAGE_KEYS.expireTime]: urlParams.get("expires_in"),
  };
  const hasError = urlParams.get("error");
  // if theres an error OR the token expired , refresh the token
  if (
    hasError ||
    hasTokenExpired() ||
    LOCALSTORAGE_VALUES.accessToken === "undefined"
  ) {
    refreshToken();
  }
  // if there is an access token in local storage use it
  if (
    LOCALSTORAGE_VALUES.accessToken &&
    LOCALSTORAGE_VALUES.accessToken !== "undefined"
  ) {
    return LOCALSTORAGE_VALUES.accessToken;
  }
  //if there is a token in the URL query params user is logging in for the first time
  if (queryParams[LOCALSTORAGE_KEYS.accessToken]) {
    for (const property in queryParams) {
      window.localStorage.setItem(property, queryParams[property]);
    }
  }
  // set timestamp
  window.localStorage.setItem(LOCALSTORAGE_KEYS.timeStamp, Date.now());
  // return the access token from query params
  return queryParams[LOCALSTORAGE_KEYS.accessToken];
  //we should never get here
  return false;
};

export const accessToken = getAccessToken();

/**
 * axios global request headers
 */
axios.defaults.baseURL = "https://api.spotify.com/v1";
axios.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
axios.defaults.headers["Content-Type"] = "application/json";

/**
 * get current user profile
 * https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-current-users-profile
 * @returns {promise}
 */

export const getCurrentUserProfile = () => axios.get("/me");

/**
 * get current user playlists
 * @return {promise}
 */

export const getCurrentUserPlaylists = (limit = 20) => {
  return axios.get(`/me/playlists?limit=${limit}`);
};

/**
 * get users top artists and tracks
 * @param {string} time_range - 'short term' (last 4 weeks) 
  'medium term' (last 6 months) or 'long term' (calculated from several years of data including all new data 
  as it becomes available.) default is 'short term' 
* @return {promise}
 */

export const getTopArtists = (time_range = "short_term") => {
  return axios.get(`/me/top/artists?time_range=${time_range}`);
};

/**
 * get users top track 
 * @param {string} time_range - 'short_term (last 4 weeks) 
  'medium term' (last 6 months) or 'long term' (calculated from several years of data including all new data 
  as it becomes available.) default is 'short term'   
  * @return {promise} 
 */

export const getTopTracks = (time_range = "short_term") => {
  return axios.get(`/me/top/tracks?time_range=${time_range}`);
};
