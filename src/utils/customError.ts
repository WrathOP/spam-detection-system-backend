class CustomError extends Error {
    name;
    httpCode;
    message;

    constructor({ name = '', httpCode, message }: { name?: string, httpCode: number, message: string }) {
        super(message);
        this.name = name;
        this.httpCode = httpCode;
        this.message = message;
    }
    
}

export default CustomError;