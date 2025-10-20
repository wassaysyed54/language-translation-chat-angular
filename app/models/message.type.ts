export type Message = {
    text: string,
    timeStamp: Date,
    user: 'sender' | 'receiver',
}
