import { Language } from "./language.type"

export type User = {
    name: string,
    email: string,
    defaultLanguage: Language[],
    password: string,
    conformPassword: string
}