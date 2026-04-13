/* config.js - Central configuration. Update URLs to match your deployment. */

const BACKEND_URL = "https://tapnap-backend.onrender.com";
const FRONTEND_URL = "https://tapnap.pages.dev";

const CONFIG = {
  BACKEND_URL,
  ROUTES: {
    LOGIN: `${FRONTEND_URL}/Login.html`,
    REGISTER: `${FRONTEND_URL}/Register.html`,
    FORGOT: `${FRONTEND_URL}/Forgot.html`,
    CODE_OTP: `${FRONTEND_URL}/EmailCode.html`,
    RESET: `${FRONTEND_URL}/ResetPassword.html`,
    MAIN: `${FRONTEND_URL}/`,
    CODE: `${FRONTEND_URL}/Code.html`,
  },
  API: {
    LOGIN: `${BACKEND_URL}/Login`,
    REGISTER: `${BACKEND_URL}/Register`,
    FORGOT: (email) => `${BACKEND_URL}/Forgot/${encodeURIComponent(email)}`,
    // Final password reset submit: POST /Verify with body { id, password }.
    VERIFY: `${BACKEND_URL}/Verify`,
    CODE: (code, password) =>
      password
        ? `${BACKEND_URL}/Code/${encodeURIComponent(code)}/${encodeURIComponent(password)}`
        : `${BACKEND_URL}/Code/${encodeURIComponent(code)}`,
    MAIN: `${BACKEND_URL}/`,
  },
};
