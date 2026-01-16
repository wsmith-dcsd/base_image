// google reCAPTCHA v2
export const CAPTCHA_SITE_KEY = "6Lckuw0TAAAAAJXPV7NGr64645MlNXpER-jGNdAQ";
// google reCAPTCHA v3
export const RECAPTCHA_SITE_KEY = "6Lf_7EgaAAAAAJucXI2v6PoKieowFyeSUC3icGx8";
export const DCSD_COOKIE = "dcsdToken";

export const EXPIRY_BUFFER_MILLI = 60000;
// dynamic service host
export const SERVICE_HOST =
    process.env.NODE_ENV !== "production" ? "https://twpp-service.dcsdk12.org" : "https://service.dcsdk12.org";

export const SPRING_COOKIE = "JESSIONID";
export const START_SESSION_URL = `${SERVICE_HOST}/auth/v1/auth/session`;
// how often to check if token is expired
export const TOKEN_EXPIRY_CHECK_MILLI = 60000;
export const TOKEN_URL = `${SERVICE_HOST}/auth/v1/auth/token`;
export const TOKEN_URL_DEV = `${SERVICE_HOST}/auth-token/v1/auth`;

// Google Analytics tracking ID
export const TRACKING_ID = "UA-168847218-1";
