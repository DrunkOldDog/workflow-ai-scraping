import { getWritable } from "workflow";

import type { Product } from "@/types";

export async function getProductResults(products: Product[]) {
  "use step";

  const writable = getWritable();
  const writer = writable.getWriter();
  await writer.write(
    new TextEncoder().encode(
      JSON.stringify({
        type: "result",
        products,
      })
    )
  );
  writer.releaseLock();
}
