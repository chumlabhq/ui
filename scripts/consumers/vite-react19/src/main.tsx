import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@chumlab/ui/styles.css";
import Entry from "./Entry";

const root = document.getElementById("root");
if (!root) throw new Error("no root");
createRoot(root).render(
  <StrictMode>
    <Entry />
  </StrictMode>,
);
