export default interface ILog {
    id: number
    createdAt: Date
    userId: number
    userName: string
    action: string
    description: string
}