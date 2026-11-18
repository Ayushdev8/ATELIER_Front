import axios from "axios";


const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers:{
        "Content-Type":"application/json"
    }
}
    
);

api.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem("access")
        if(token){
            // const decoded = jwtDecode(token)
            // const expiry_date = decoded.exp
            // const current_time = Date.now()/1000
            
                config.headers.Authorization =`Bearer ${token}`
            
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => response,

    async (error) => {

        if (error.response?.status === 401) {

            const refreshToken =
                localStorage.getItem("refresh");

            const response = await axios.post(
                "http://localhost:8080/api/v2/auth/refresh",
                {
                    refreshToken: refreshToken
                }
            );

            const newAccessToken =
                response.data.accessToken;

            localStorage.setItem(
                "access",
                newAccessToken
            );

            error.config.headers.Authorization =
                `Bearer ${newAccessToken}`;

            return api(error.config);
        }

        return Promise.reject(error);
    }
);
export default api;