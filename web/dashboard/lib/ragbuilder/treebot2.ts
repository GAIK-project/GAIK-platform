import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { URL } from "url";

// Define the structure for the tree node
interface LinkNode {
  title: string;
  linkUrl: string;
  children: LinkNode[];
}

// Constants
const MAX_DEPTH = 2; // Maximum depth for recursion
const MAX_TOTAL_LINKS = 20; // Global limit for total links I would keep this low or it go crazy on some sites

// Global counter for tracking processed links
let totalLinksProcessed = 0;

/**
 * Scrapes links from a given URL and builds a tree structure using a for loop.
 * @param url The starting URL to scrape.
 * @param domain The domain to restrict the search to.
 * @param depth The current recursion depth.
 * @param visited A set of visited URLs to prevent duplicate visits.
 * @returns A tree-like structure containing titles, URLs, and child links.
 */
const scrapeLinks = async (
  url: string,
  domain: string,
  depth: number = 0,
  visited: Set<string> = new Set(),
): Promise<LinkNode | null> => {
  if (
    depth > MAX_DEPTH ||
    totalLinksProcessed >= MAX_TOTAL_LINKS ||
    visited.has(url)
  ) {
    return null;
  }

  visited.add(url);
  totalLinksProcessed++;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Extract title or fallback to 'No Title'
    const title: string =
      document.querySelector("title")?.textContent || "No Title";
    console.log("found title: ", title);

    // Extract all valid links from the page
    let links: string[] = Array.from(document.querySelectorAll("a"))
      .map((a) => a.href)
      .map((link) => new URL(link, url).href) // Convert relative URLs to absolute
      .filter((link) => link.startsWith(domain)) // Stay within the same domain
      .filter((link) => !visited.has(link)); // Avoid revisiting links
    console.log("found: ", links.length, " links.");

    // Ensure we do not exceed MAX_TOTAL_LINKS
    links = links.slice(0, MAX_TOTAL_LINKS - totalLinksProcessed);

    const children: LinkNode[] = [];

    for (const link of links) {
      // console.log(totalLinksProcessed);
      if (totalLinksProcessed >= MAX_TOTAL_LINKS) break; // Stop if we reach the limit

      const child = await scrapeLinks(link, domain, depth + 1, visited);
      if (child) {
        children.push(child);
      }
    }

    return {
      title,
      linkUrl: url,
      children,
    };
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return null;
  }
};

/**
 * Wrapper function to reset the counter and start the crawling process.
 * @param startUrl The URL to begin scraping.
 * @returns A tree-like JSON structure of the site's links.
 */
export const buildLinkTree = async (
  startUrl: string,
): Promise<LinkNode | null> => {
  const domain = new URL(startUrl).origin; // Extract domain
  totalLinksProcessed = 0; // Reset global counter before starting
  return await scrapeLinks(startUrl, domain);
};
