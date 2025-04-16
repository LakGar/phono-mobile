const BASE_URL = "https://api.discogs.com";

// Discogs API credentials
const CONSUMER_KEY = "kHqtfTvHthzsQKXfhvNy";
const CONSUMER_SECRET = "xfvDnCyODmYnzDmiCHbaMKbZSdUAxpNB";

export interface SearchResult {
  id: number;
  title: string;
  year: string;
  cover_image: string;
  resource_url: string;
  type: string;
  master_id: number;
  master_url: string;
  uri: string;
  thumb: string;
  country: string;
  format: string[];
  label: string[];
  genre: string[];
  style: string[];
  barcode: string[];
  catno: string;
  community: {
    want: number;
    have: number;
  };
  format_quantity: number;
  formats: {
    name: string;
    qty: string;
    descriptions: string[];
  }[];
  labels: {
    name: string;
    catno: string;
    entity_type: string;
    entity_type_name: string;
    id: number;
    resource_url: string;
  }[];
  artists: {
    id: number;
    name: string;
    anv: string;
    join: string;
    role: string;
    tracks: string;
  }[];
  tracklist: {
    position: string;
    title: string;
    duration: string;
    type_: string;
  }[];
}

export const searchDiscogs = async (
  barcode: string
): Promise<SearchResult[]> => {
  const params = new URLSearchParams({
    barcode,
    key: CONSUMER_KEY,
    secret: CONSUMER_SECRET,
    per_page: "50",
  });

  const url = `${BASE_URL}/database/search?${params}`;
  console.log("Discogs search URL:", url);

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Phono/1.0",
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    console.error("Discogs error status:", res.status);
    throw new Error(`Discogs API error ${res.status}`);
  }

  const json = await res.json();
  return Array.isArray(json.results) ? json.results : [];
};

export const getRecordById = async (
  id: string
): Promise<SearchResult | null> => {
  const url = `${BASE_URL}/releases/${id}?key=${CONSUMER_KEY}&secret=${CONSUMER_SECRET}`;
  console.log("Discogs release URL:", url);

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Phono/1.0",
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    console.error("Discogs error status:", res.status);
    return null;
  }

  const data = await res.json();
  return {
    id: data.id,
    title: data.title,
    year: data.year,
    cover_image: data.images?.[0]?.uri || "",
    resource_url: data.resource_url,
    type: data.type,
    master_id: data.master_id,
    master_url: data.master_url,
    uri: data.uri,
    thumb: data.images?.[0]?.uri150 || "",
    country: data.country,
    format: data.formats?.map((f: any) => f.name) || [],
    label: data.labels?.map((l: any) => l.name) || [],
    genre: data.genres || [],
    style: data.styles || [],
    barcode:
      data.identifiers
        ?.filter((i: any) => i.type === "Barcode")
        .map((i: any) => i.value) || [],
    catno: data.labels?.[0]?.catno || "",
    community: {
      want: data.community?.want || 0,
      have: data.community?.have || 0,
    },
    format_quantity: data.formats?.length || 0,
    formats:
      data.formats?.map((f: any) => ({
        name: f.name,
        qty: f.qty,
        descriptions: f.descriptions || [],
      })) || [],
    labels:
      data.labels?.map((l: any) => ({
        name: l.name,
        catno: l.catno,
        entity_type: l.entity_type,
        entity_type_name: l.entity_type_name,
        id: l.id,
        resource_url: l.resource_url,
      })) || [],
    artists:
      data.artists?.map((a: any) => ({
        id: a.id,
        name: a.name,
        anv: a.anv || "",
        join: a.join || "",
        role: a.role || "",
        tracks: a.tracks || "",
      })) || [],
    tracklist:
      data.tracklist?.map((t: any) => ({
        position: t.position,
        title: t.title,
        duration: t.duration,
        type_: t.type_,
      })) || [],
  };
};
