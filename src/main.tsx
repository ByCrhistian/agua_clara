import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Dejamos solo a <App />, ya que el RouterProvider de tu maestro vive adentro */}
    <App /> 
  </StrictMode>
);