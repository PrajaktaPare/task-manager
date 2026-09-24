// "Remember me" ticked  -> localStorage (survives closing the browser)
// "Remember me" unticked -> sessionStorage (gone when the tab closes)
const TOKEN_KEY = 'tm_token';
const USER_KEY = 'tm_user';

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const getToken = () =>
  localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);

export const getStoredUser = () =>
  safeParse(localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY));

export const saveAuth = (token, user, remember) => {
  clearAuth();
  const store = remember ? localStorage : sessionStorage;
  store.setItem(TOKEN_KEY, token);
  store.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuth = () => {
  [localStorage, sessionStorage].forEach((s) => {
    s.removeItem(TOKEN_KEY);
    s.removeItem(USER_KEY);
  });
};
