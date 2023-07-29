import axiosinstance from './axios';
import qs from 'qs';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import jwtDecode from 'jwt-decode';
import { history } from 'helpers';
import { setAuthorizationToken } from '../helpers/setAuthorizationToken';
const api = process.env.REACT_APP_IDENTITY_DOMAIN;
const legacyapi = process.env.REACT_APP_LEGACY_DOMAIN;
const headers = {
	'Accept-Language': navigator.language,
	// 'Api-Key': '/QcOg8MuI4TZNT/eAIpLbicVqpGxkxz1YeqAilOOj4s=',
	'Content-Type': 'application/json',
	// Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
};
const refreshToken = localStorage.getItem('refreshToken');
const token = localStorage.getItem('jwtToken');

// Function that will be called to refresh authorization
const refreshAuthLogic = (failedRequest) =>
	axiosinstance
		.get(
			`${api}/v2.1/auth/token/refresh?${qs.stringify(
				{ refreshToken },
				{ format: 'RFC3986' },
			)}&oldToken=${token}`,
			{
				headers,
			},
		)
		.then((tokenRefreshResponse) => {
			localStorage.setItem('jwtToken', tokenRefreshResponse.data.data.accessToken);
			localStorage.setItem('refreshToken', tokenRefreshResponse.data.data.refreshToken);
			failedRequest.response.config.headers.Authorization = `Bearer ${tokenRefreshResponse.data.data.accessToken}`;
			setAuthorizationToken(tokenRefreshResponse.data.data.accessToken);
			return Promise.resolve();
		})
		.catch(() => {
			localStorage.setItem('jwtToken', '');
			localStorage.setItem('refreshToken', '');
			history.push({
				pathname: `${process.env.PUBLIC_URL}/login`,
			});
		});
createAuthRefreshInterceptor(axiosinstance, refreshAuthLogic);
const userInfo = token && jwtDecode(token);

export default { api, legacyapi, setAuthorizationToken, headers, userInfo };
