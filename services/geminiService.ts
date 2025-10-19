import { GoogleGenAI } from "@google/genai";

export interface AdItem {
  text: string;
  link: string;
}

// Cached ads
let allAds: AdItem[] | null = null;

async function fetchAndCacheAds(): Promise<void> {
    if (allAds) return; // Return if ads are already cached.

    try {
        const response = await fetch('/ads.json'); // Fetch from local JSON file
        if (!response.ok) {
            throw new Error(`Failed to fetch ads.json: ${response.statusText}`);
        }
        const data = await response.json();
        // Ensure data.ads is an array before assigning it
        allAds = Array.isArray(data.ads) ? data.ads : [];
    } catch (error) {
        console.error("Error fetching or parsing ad data:", error);
        allAds = []; // Set to empty on error to prevent refetching
        throw error; // Re-throw the error to be handled by the caller
    }
}

export async function fetchAds(): Promise<AdItem[]> {
    // This function ensures data is fetched only once per session.
    if (allAds === null) {
        await fetchAndCacheAds();
    }
    return allAds || [];
}
