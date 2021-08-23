export const setLocalStorage = (key, data) => {
  return localStorage.setItem(key, JSON.stringify(data));
};

export const getLocalStorage = (key) => {
  if (localStorage.getItem(key)){
    const storage = JSON.parse(localStorage.getItem(key))
    return storage.data;
  }
};

export const removeLocalStorage = () => {
  return localStorage.clear();
};