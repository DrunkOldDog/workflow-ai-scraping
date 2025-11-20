import { getFidalgaProducts } from "@/steps/get-fidalga-products.step";
import { getHipermaxiProducts } from "@/steps/get-hipermaxi-products.step";
import { getProductResults } from "@/steps/get-product-results.step";
import { sleep } from "workflow";

export async function supermarketScrapingWorkflow(productNames: string[]) {
  "use workflow";

  const productName = productNames[0];

  const fidalgaProducts = await getFidalgaProducts(productName);
  await sleep("5s");

  const hipermaxiProducts = await getHipermaxiProducts(productName);
  await sleep("5s");

  const products = [...fidalgaProducts, ...hipermaxiProducts];
  await getProductResults(products);

  return products;
}
