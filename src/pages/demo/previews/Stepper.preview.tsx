import { Stepper } from "../../../components/Stepper/index.js";
import type { Previews } from "./types.js";

const CHECKOUT = [
  { id: "cart", label: "Cart", description: "Review items" },
  { id: "shipping", label: "Shipping", description: "Where it goes" },
  { id: "payment", label: "Payment", description: "Card details" },
  { id: "done", label: "Done", description: "Order placed" },
];

function Phone() {
  return <Stepper steps={CHECKOUT} value={1} showDescriptions />;
}

export default { phone: Phone } satisfies Previews;
