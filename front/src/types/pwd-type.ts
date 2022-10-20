export default interface IPwd {
    expireAt: Date

    passwordExpiration: number
    passwordLength: number
    oneDigit: boolean
    specialCharacter: boolean
}