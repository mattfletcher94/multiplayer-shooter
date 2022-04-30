export default interface IResponseServerError {
    message: string,
    error: { [key: string]: string };
}