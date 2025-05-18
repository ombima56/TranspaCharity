import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Always use production API URL in production mode
  const apiUrl = mode === 'production' 
    ? 'https://transpacharity-api.onrender.com/api'
    : (env.VITE_API_URL || 'http://localhost:8080/api');
  
  console.log("Building with environment:", mode);
  console.log("API URL from env:", apiUrl);
  
  return {
    define: {
      // Always use the production URL in production mode
      'process.env.VITE_API_URL': JSON.stringify(apiUrl),
    },
    plugins: [
      react(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      sourcemap: true,
    },
  };
});
