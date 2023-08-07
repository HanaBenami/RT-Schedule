export default function serializeError(error) {
    return error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
}
