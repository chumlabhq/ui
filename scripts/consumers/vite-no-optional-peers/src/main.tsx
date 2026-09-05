import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@chumlab/ui/styles.css";
import Showcase from "./Showcase";

const root = document.getElementById("root");
if (!root) throw new Error("no root");
createRoot(root).render(
  <StrictMode>
    <Showcase />
  </StrictMode>,
);
