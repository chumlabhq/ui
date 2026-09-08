import { useState } from "react";
import { Pagination } from "@chumlab/ui/pagination";

export default function PaginationExample() {
  const [basicPage, setBasicPage] = useState(1);
  return (
    <>
      {}
      <Pagination
                  value={basicPage}
                  totalPages={5}
                  onValueChange={setBasicPage}
                />
    </>
  );
}
