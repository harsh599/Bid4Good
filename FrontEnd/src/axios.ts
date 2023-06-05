import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://csci5308vm5.research.cs.dal.ca:3000", // Replace with your API base URL
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

declare const process: {
  env: {
    [key: string]: string | undefined;
  };
};


apiClient.interceptors.request.use(function (config) {
  // modify the request config
  if (window.location.hostname === 'csci5308vm5.research.cs.dal.ca') {
    config.baseURL = 'http://csci5308vm5.research.cs.dal.ca:3000';
    
  } else {
    config.baseURL = 'http://localhost:3000';
   
  }
  return config;
});

export default apiClient;
