import "dotenv/config";

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

    // 2. Check if URL is in an acceptable format
    let parsedUrl: URL;

    try {
        parsedUrl = new URL(rawUrl);
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