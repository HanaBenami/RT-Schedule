export default function getApiAuthHeaders(accessToken) {
    const apiAuthHeaders = {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
    };

    return apiAuthHeaders;
}
