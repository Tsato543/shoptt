import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initTikTokPixel } from "./lib/tiktokPixel";
import { captureTrackingParams } from "./lib/trackingParams";

// Capture tracking params from URL (TikTok ads, UTM, etc.)
captureTrackingParams();

// Initialize TikTok Pixel
initTikTokPixel();

createRoot(document.getElementById("root")!).render(<App />);
