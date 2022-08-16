import axios, { AxiosRequestConfig } from 'axios';

const myAxios = axios.create({
  baseURL: '/api',
  withCredentials: false,
});

myAxios.interceptors.response.use(function (response: any) {
  return response.data;
});

export const RestApis = myAxios;

export type RestApiConfig = AxiosRequestConfig;
