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

export interface Url {
    id: number;
    shortCode: string;
    shortUrl: string;
    originalUrl: string;
    clickCount: number;
    createdAt: string;
}

export interface GetUrlsResponse {
    success: boolean;
    data: {
        urls: Url[];
        page: number;
        totalPages: number;
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

export async function getUrls(
    page: number = 1
): Promise<GetUrlsResponse> {
    const response = await api.get<GetUrlsResponse>("/url", {
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