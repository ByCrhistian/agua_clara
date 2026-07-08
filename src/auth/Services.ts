import axios from "axios";
import { LoginRequest, LoginResponse } from "./types";

const API = axios.create({
  baseURL: "http://localhost:5173",
});

export const loginRequest = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const response = await API.post<LoginResponse>("/login", data);
  return response.data;
};