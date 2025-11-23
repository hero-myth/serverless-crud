import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
	baseURL: apiBaseUrl
});

api.interceptors.request.use(async (config) => {
	try {
		const session = await fetchAuthSession();
		const jwt = session?.tokens?.idToken?.toString() || session?.tokens?.accessToken?.toString();
		if (jwt) {
			config.headers.Authorization = `Bearer ${jwt}`;
		}
	} catch {
		// unauthenticated
	}
	return config;
});

export default api;


