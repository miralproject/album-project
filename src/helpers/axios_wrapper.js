import axios from "axios";
import config from "./../config";
import { getLocalStorage } from "./local_storage";

const axiosWrapper = axios.create({
  baseURL: config.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  }
});

const storage = getLocalStorage('authenticated');
if (storage !== undefined) {
  axiosWrapper.defaults.headers.common['Authorization'] = 'Bearer '+storage.token;
} else {
  axiosWrapper.defaults.headers.common['Authorization'] = null;
}

export { axiosWrapper };