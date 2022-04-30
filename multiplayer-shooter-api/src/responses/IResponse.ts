export default interface IResponse<T = null> {
    message: string,
    data?: T
}