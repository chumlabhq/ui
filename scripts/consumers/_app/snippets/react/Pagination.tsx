import { useState } from "react";
import { Pagination } from "@chumlab/ui/pagination";

export default function Example() {
  const [page, setPage] = useState(1);
  return <Pagination value={page} totalPages={10} onValueChange={setPage} />;
}
