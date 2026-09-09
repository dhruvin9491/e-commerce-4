import { GenerateMetaData } from "../helper/DataGenrateHelper"

export const ROLES = {
    ADMIN: "admin",
    USER: "user"
}

export const DEFAULT_ADMIN = {
    name: "admin",
    email: "admin@gmail.com",
    password: "admin@123",
    role: ROLES.ADMIN,
    ...GenerateMetaData()
}

export const LANG_VALUE = {
    EN: "en",
    HI: "hi",
    GJ: "gj"
}

export const LANG_TEXT = {
    EN: "english",
    HI: "hindi",
    GJ: "gujrati"
}