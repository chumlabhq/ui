import { Pagination } from "../../../components/Pagination/index.js";
import type { Previews } from "./types.js";

function Phone() {
  return <Pagination defaultValue={118} totalPages={240} />;
}

export default { phone: Phone } satisfies Previews;
