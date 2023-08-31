export interface DeserializedError {
    response?: { data: { detail?: string; message?: string } };
    message?: string;
}

export type SerializedError = string | null;

export default function serializeError(error: DeserializedError): SerializedError {
    return error.response?.data?.message
        ? error.response.data.message
        : error.response?.data?.detail
        ? error.response.data.detail
        : error.message
        ? error.message
        : null;
}
