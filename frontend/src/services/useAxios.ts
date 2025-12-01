import axios from "axios";

const baseURL = "http://localhost:8000";
const headers = {
  "Content-Type": "application/json",
};

function useAxios() {
  return axios.create({
    baseURL,
    headers,
    withCredentials: true,
  });
}

export default useAxios;
