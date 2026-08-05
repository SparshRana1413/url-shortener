import api from "./client";

export async function shorten({
    url,
    customAlias,
    expiresAt,
}: {
    url: string;
    customAlias?: string;
    expiresAt?: string;
}) {
    const response = await api.post("/urls", {
        url,
        customAlias,
        expiresAt,
    });

    return response.data;
}

export async function getUrls(page: number = 1) {
    const response = await api.get("/urls", {
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
    const response = await api.get(`/urls/${shortCode}/analytics`, {
        params: {
            range,
        },
    });

    return response.data;
}

export async function deleteUrl(shortCode: string) {
    const response = await api.delete(`/urls/${shortCode}`);

    return response.data;
}