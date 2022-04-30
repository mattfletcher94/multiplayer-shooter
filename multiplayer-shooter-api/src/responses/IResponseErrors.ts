export default interface IResponseErrors {
    message: string,
    errors: Array<{
        field: string,
        message: string
    }>
}