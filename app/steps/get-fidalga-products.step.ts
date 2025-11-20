import { getWritable } from "workflow";

import type { Product } from "@/types";

export async function getFidalgaProducts(productName: string): Promise<Product[]> {
  "use step";

  const writable = getWritable();
  const writer = writable.getWriter();
  await writer.write(
    new TextEncoder().encode(
      JSON.stringify({
        type: "progress",
        message: `Searching for ${productName} in Fidalga...`,
      })
    )
  );
  writer.releaseLock();

  return [
    {
      productId: "1",
      name: "Fernet Branca 750ml",
      price: 140,
      imageUrl: "",
    },
    {
      productId: "2",
      name: "Fernet Branca 1L",
      price: 170,
      imageUrl: "",
    },
    {
      productId: "3",
      name: "Fernet Branca Menta 750ml",
      price: 150,
      imageUrl: "",
    },
  ];
}
