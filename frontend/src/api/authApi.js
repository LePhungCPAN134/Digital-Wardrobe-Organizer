import api from "./client";

export function register(data) {
  return api.post("/users/register", data);
}

export function login(data) {
  return api.post("/users/login", data);           // step 1
}

export function verifyLogin(data) {
  return api.post("/users/verify-login", data);   // step 2 (email + otp)
}