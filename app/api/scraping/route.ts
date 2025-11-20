import { start } from "workflow/api";
import { supermarketScrapingWorkflow } from "@/workflows/supermarket-scraping.workflow";

export async function POST(request: Request) {
  const { productNames }: { productNames: string[] } = await request.json();

  // Executes asynchronously and doesn't block your app
  const run = await start(supermarketScrapingWorkflow, [productNames]);
  const stream = run.getReadable();

  return new Response(stream, {
    headers: {
      "Content-Type": "text/text-plain",
    },
  });
}
