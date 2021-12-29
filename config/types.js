const mimeTypes = {
	HTML: 'text/html',
  JS: 'text/javascript',
	JSON: 'application/json',
  CSS: 'text/css',
  PNG: 'image/png',
  JPG: 'image/jpg'
};

const errorTypes = {
  MISSING_DATA: "ALL_FIELDS_REQUIRED",
  NOT_ALLOWED: "ACTION_NOT_ALLOWED",
  USER_EXISTS: "USER_EXISTS",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS"
};

const loginActionTypes = {
	LOGIN: 'login',
	REGISTER: 'register'
};

module.exports = {mimeTypes, errorTypes, loginActionTypes};