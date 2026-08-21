import "dotenv/config";
import { parse } from "tldts";

type UrlValidationResult =
    | { valid: true; url: string }
    | { valid: false; error: string };

export function validateUrl(
    rawUrl: string | undefined
): UrlValidationResult {

    // 1. Check if URL is empty
    if (!rawUrl) {
        return {
            valid: false,
            error: "URL can't be empty"
        };
    }

    // check if the url comes with a protocol or not
    const hasProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(rawUrl);

    // if yes, check if it is http or not
    if (hasProtocol && !/^https?:\/\//i.test(rawUrl)) {
        return {
            valid: false,
            error: "Only http/https protocol allowed"
        };
    }

    // if not, then add a https protocol
    const normalizedUrl = hasProtocol
        ? rawUrl
        : `https://${rawUrl}`;

    // 2. Check if URL is in an acceptable format
    let parsedUrl: URL;

    try {
        parsedUrl = new URL(normalizedUrl);
    } catch {
        return {
            valid: false,
            error: "Invalid URL format"
        };
    }

    // 3. Check if URL's protocol is HTTP or HTTPS
    if (
        parsedUrl.protocol !== "http:" &&
        parsedUrl.protocol !== "https:"
    ) {
        return {
            valid: false,
            error: "Only HTTP and HTTPS protocol URLs are allowed"
        };
    }

    // 4. Get the hostname for private/local URL checks
    const hostname = parsedUrl.hostname.toLowerCase();

    // 4b. Check that the hostname is a real, registrable domain
    // (blocks things like "not-a-url", "https://foo", "justnotaurl.bullshit")
    // Note: this also naturally catches "localhost" (no valid public suffix),
    // but we keep the explicit localhost check below for clarity/defense-in-depth.
    const tld = parse(hostname, { allowPrivateDomains: false });

    if (
        !tld.isIcann ||          // suffix isn't a real ICANN-recognized TLD (.com, .edu.in, etc.)
        !tld.domain ||           // no valid registrable domain (e.g. "not-a-url")
        tld.isIp                 // raw IP literals — decide below if you want to allow these
    ) {
        return {
            valid: false,
            error: "URL must point to a valid domain"
        };
    }

    // Check for the 172.16.x.x - 172.31.x.x private IP range
    const hostnameParts = hostname.split(".");
    const secondOctet = Number(hostnameParts[1]);

    const isPrivate172 =
        hostname.startsWith("172.") &&
        secondOctet >= 16 &&
        secondOctet <= 31;

    // 5. Check if URL points to a private or local address
    // This helps prevent SSRF attacks against internal services
    if (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname.startsWith("192.168.") ||
        hostname.startsWith("10.") ||
        isPrivate172
    ) {
        return {
            valid: false,
            error: "Private or local URLs are not allowed"
        };
    }

    // 6. Check if URL points to this application's own domain
    const appDomain = process.env.APP_DOMAIN?.toLowerCase();

    if (appDomain && hostname === appDomain) {
        return {
            valid: false,
            error: "URL cannot be this website's domain"
        };
    }

    // 7. If URL passes every check, return its normalized form
    return {
        valid: true,
        url: parsedUrl.href
    };
}