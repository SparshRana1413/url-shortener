import api from "./client";

export interface ShortenResponse {
    success: boolean;
    data: {
        shortCode: string;
        shortUrl: string;
        originalUrl: string;
        createdAt: string;
    };
}

export async function shorten({
    url,
    customAlias,
    expiresAt,
}: {
    url: string;
    customAlias?: string;
    expiresAt?: string;
}): Promise<ShortenResponse> {
    const response = await api.post<ShortenResponse>("/url/create", {
        url,
        customAlias,
        expiresAt,
    });

    return response.data;
}

export async function getUrls(page: number = 1) {
    const response = await api.get("/url", {
        params: {
            page,
        },
    });

    return response.data;
}

export async function getAnalytics(
    shortCode: string,
    range: string
) {
    const response = await api.get(`/url/${shortCode}/analytics`, {
        params: {
            range,
        },
    });

    return response.data;
}

export async function deleteUrl(shortCode: string) {
    const response = await api.delete(`/url/${shortCode}`);

    return response.data;
}
