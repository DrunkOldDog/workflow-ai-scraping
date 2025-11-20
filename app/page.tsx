"use client";

import { useState } from "react";

import type { Product } from "./types";

export default function Home() {
  const [progress, setProgress] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");

  const handleChunk = (chunk: string) => {
    const parsedChunk = JSON.parse(chunk) as {
      type: string;
      message: string;
      products: Product[];
    };
    switch (parsedChunk.type) {
      case "progress":
        setProgress(parsedChunk.message);
        break;
      case "result":
        setProducts(parsedChunk.products);
        break;
    }
  };

  const startScraping = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const productNames = searchInput
      .split(",")
      .map((product) => product.trim());

    try {
      const response = await fetch("http://localhost:3000/api/scraping", {
        method: "POST",
        body: JSON.stringify({ productNames }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      if (!reader) {
        throw new Error("Reader not found");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = value ? decoder.decode(value, { stream: !done }) : null;
        if (chunk) {
          buffer += chunk;
          handleChunk(chunk);
        }
      }

      reader.releaseLock();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-4 min-h-screen items-center bg-zinc-50 font-sans dark:bg-black py-12">
      <h1 className="text-4xl font-bold">Supermarket Scaping</h1>
      <form onSubmit={startScraping} className="flex gap-4">
        <input
          type="text"
          name="products"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-[600px]"
          placeholder="Products to search separated by commas (e.g. fernet, vodka, gin)"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Search
        </button>
      </form>

      <div className="flex flex-col gap-2">
        {progress && <div className="border border-gray-300 rounded-md p-4 bg-gray-800">{progress}</div>}
        {products.length > 0 && (
          <div className="flex flex-col gap-2">
            {products.map((product, index) => (
              <div key={index}>{product.name}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
