import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./", // <--- ADICIONE ISSO AQUI! Garante que o app funcione sem servidor
});
