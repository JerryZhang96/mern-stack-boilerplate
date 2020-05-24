//SERVER ROUTES
export const USER_SERVER = '/api/users';
export const GOOGLE_CLIENT =
  '278897483633-a6gs2e67eh8vjvrkt2pqcua9i38ebamn.apps.googleusercontent.com';
export const FACEBOOK_CLIENT = '2293967624233245';

const config = {
  headers: {
    'Content-type': 'application/json',
  },
};

const token = localStorage.getItem('google_token');
const tokenExp = localStorage.getItem('google_tokenExp');
// If token, add to headers
if (token && tokenExp) {
  config.headers['google_token'] = token;
  config.headers['google_tokenExp'] = tokenExp;
}

config.headers['Content'] = 'application/json;charset=UTF-8';

export const headersConfig = config;
