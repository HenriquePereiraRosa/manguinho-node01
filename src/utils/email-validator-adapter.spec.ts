import validator from "validator"
import { EmailValidatorAdapter } from "./email-validator-adapter"

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true
  }
}))

const makeSut = () => {
  return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter', () => {
  it('Should return false if validator returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_email@server.com')
    expect(isValid).toBe(false)
  })
})

describe('EmailValidator Adapter', () => {
  it('Should return true if validator returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('valid_email@server.com')
    expect(isValid).toBe(true)
  })
})

describe('EmailValidator Adapter', () => {
  it('Should call validator with correct email', () => {
    const sut = makeSut()
    const email = 'any_email@server.com'
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    const isValid = sut.isValid(email)
    expect(isValid).toBe(true)
    expect(isEmailSpy).toBeCalledWith(email)
  })
})