const config = {
  development: {
    backendUrl: "http://localhost:8000/api/v1/img",
  },
  production: {
    backendUrl: import.meta.env.VITE_PRODUCTION_BACKEND_URL,
  },
};

export default config;
