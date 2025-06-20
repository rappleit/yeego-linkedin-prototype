export const UNIPILE_CONFIG = {
  BASE_URL: "https://api14.unipile.com:14496",
  LINKEDIN_ENDPOINT: "/linkedin",
  DSN: "api14.unipile.com:14496",
}

export const getUnipileHeaders = (apiKey: string) => ({
  "X-API-KEY": apiKey,
  "accept": "application/json",
  "content-type": "application/json",
});

export async function fetchUnipileApiKeyFromSupabase(): Promise<string> {
  const response = await fetch('https://rzzhsadiatfvgyiqdjmd.supabase.co/functions/v1/get-unipile-key', {
    headers: {
      Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch Unipile API key from Supabase Edge Function');
  }
  const data = await response.json();
  if (!data || !data.apiKey) {
    throw new Error('UNIPILE_API_KEY not found in Supabase response');
  }
  return data.apiKey;
}

let cachedApiKey: string | null = null;

export async function getCachedUnipileApiKey(): Promise<string> {
  if (cachedApiKey) return cachedApiKey;
  cachedApiKey = await fetchUnipileApiKeyFromSupabase();
  return cachedApiKey;
}

export async function unipileFetch(input: RequestInfo, init?: RequestInit) {
  const apiKey = await getCachedUnipileApiKey();
  const headers = {
    ...getUnipileHeaders(apiKey),
    ...(init?.headers || {}),
  };
  return fetch(input, { ...init, headers });
} 