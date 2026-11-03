import { Stepper } from "../../../components/Stepper/index.js";

const CHECKOUT = [
  { id: "cart", label: "Cart", description: "Review items" },
  { id: "shipping", label: "Shipping", description: "Where it goes" },
  { id: "payment", label: "Payment", description: "Card details" },
  { id: "done", label: "Done", description: "Order placed" },
];

export function Phone() {
  return <Stepper steps={CHECKOUT} value={1} showDescriptions />;
}
