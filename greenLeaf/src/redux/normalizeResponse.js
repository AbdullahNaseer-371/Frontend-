export const unwrapResponse = (payload) => {
    if (!payload || typeof payload !== "object") {
        return payload;
    }

    // Your backend sends actual response data in message.
    // Example: { success, statusCode, message: { plants: [] }, data: "..." }

    if (
        payload.message &&
        typeof payload.message === "object" &&
        !Array.isArray(payload.message)
    ) {
        return payload.message;
    }

    // Standard API response support
    if (payload.data !== undefined) {
        return unwrapResponse(payload.data);
    }

    return payload;
};

export const normalizeCollection = (payload, key) => {
    const data = unwrapResponse(payload);

    let items = [];

    if (Array.isArray(data)) {
        items = data;
    } else if (data && typeof data === "object") {
        if (Array.isArray(data[key])) {
            items = data[key];
        } else if (Array.isArray(data.items)) {
            items = data.items;
        } else if (Array.isArray(data.results)) {
            items = data.results;
        }
    }

    const pagination = data?.pagination || {};

    return {
        items,
        pagination: {
            page: Number(pagination.page ?? 1),
            limit: Number(pagination.limit ?? items.length),
            total: Number(
                pagination.total ??
                data?.total ??
                items.length
            ),
            pages: Number(
                pagination.pages ??
                pagination.totalPages ??
                0
            )
        }
    };
};

export const normalizeSingle = (payload, key) => {
    const data = unwrapResponse(payload);

    if (!data) return null;

    return data?.[key] ?? data;
};

export const normalizeReport = (payload) => {
    const data = unwrapResponse(payload);

    return data?.report ?? data ?? {};
};