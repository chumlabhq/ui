import { createRoot } from "react-dom/client";
// Their stylesheet first, the library's second — the order a consumer would
// write, and the one where their preflight can reach the library's markup.
import "./app.css";
import "@chumlab/ui/styles.css";
import Showcase from "./Showcase";

const root = document.getElementById("root");
if (!root) throw new Error("no root");
createRoot(root).render(<Showcase />);
