import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  console.log("Building with environment:", mode);
  console.log("API URL from env:", env.VITE_API_URL);
  
  return {
    define: {
      'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'https://transpacharity-api.onrender.com/api'),
    },
    plugins: [
      // Use react-swc plugin without additional options
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
