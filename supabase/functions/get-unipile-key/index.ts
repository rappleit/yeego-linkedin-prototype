// @ts-nocheck
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (_req: Request) => {
  const apiKey = Deno.env.get("UNIPILE_API_KEY");

  if (!apiKey) {
    return new Response("API key not found", { status: 500 });
  }

  return new Response(JSON.stringify({ apiKey }), {
    headers: { "Content-Type": "application/json" },
  });
});
