import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initTikTokPixel } from "./lib/tiktokPixel";

// Initialize TikTok Pixel
initTikTokPixel();

createRoot(document.getElementById("root")!).render(<App />);
