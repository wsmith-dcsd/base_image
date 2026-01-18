export const DCSD_COOKIE = "dcsdToken";
export const EXPIRY_BUFFER_MILLI = 60000;
export const SERVICE_HOST =
    process.env.NODE_ENV !== "production" ? "https://twpp-service.dcsdk12.org" : "https://service.dcsdk12.org";
export const SPRING_COOKIE = "JSESSIONID";
export const START_SESSION_URL = `${SERVICE_HOST}/auth/v1/auth/session`;
export const TOKEN_EXPIRY_CHECK_MILLI = 60000;
export const TOKEN_URL = `${SERVICE_HOST}/auth/v1/auth/token`;
export const TOKEN_URL_DEV = `${SERVICE_HOST}/auth-token/v1/auth`;
export const TRACKING_ID = "UA-168847218-1";
