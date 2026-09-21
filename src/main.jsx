import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/newsreader/700.css";
import "@fontsource/newsreader/800.css";
import "@fontsource/oswald/500.css";
import "@fontsource/oswald/600.css";
import "@fontsource/oswald/700.css";
import "@fontsource/libre-franklin/400.css";
import "@fontsource/libre-franklin/600.css";
import "@fontsource/libre-franklin/800.css";
import { App } from "./App.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
