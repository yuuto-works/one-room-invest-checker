import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/one-room-invest-checker/",
  plugins: [react()],
});