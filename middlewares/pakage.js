const createResponse = (code, message, data) => {
    return {
        code: code,
        message: message,
        data: data,
    };
};

export default createResponse;
