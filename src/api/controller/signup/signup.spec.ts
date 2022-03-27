import { InvalidParamError, ServerError } from '@/api/errors'
import { EmailValidator } from '@/api/protocols'
import { SignUpController } from './signup'

interface SutTypes {
	sut: SignUpController,
	emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
	const emailValidatorStub = makeEmailValidator()
	const sut = new SignUpController(emailValidatorStub)
	return {
		sut,
		emailValidatorStub
	}
}

const makeEmailValidator = (): EmailValidator => {
	class EmailValidatorStub implements EmailValidator {
		isValid(email: string): boolean {
			return true
		}
	}
	return new EmailValidatorStub()
}

const makeEmailValidatorWithError = (): EmailValidator => {
	class EmailValidatorStub implements EmailValidator {
		isValid(email: string): boolean {
			throw new Error()
		}
	}
	return new EmailValidatorStub()
}


describe('Signup Controller', () => {
	it('Should return 400 if no email is provided', () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				pwd: '1234@56',
				pwdConfimation: '1234@56'
			}
		}
		const httpResponse = sut.exec(httpRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new Error('Missing param: email'))
	})
})


describe('Signup Controller', () => {
	it('Should return 400 if no pwd is provided', () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				email: 'any_email@server.com',
				pwdConfimation: '1234@56'
			}
		}
		const httpResponse = sut.exec(httpRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new Error('Missing param: pwd'))
	})
})


describe('Signup Controller', () => {
	it('Should return 400 if no pwdConfirmation is provided', () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				email: 'any_email@server.com',
				pwd: '1234@56',
			}
		}
		const httpResponse = sut.exec(httpRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new Error('Missing param: pwdConfirmation'))
	})
})


describe('Signup Controller', () => {
	it('Should return 400 if email is invalid', () => {
		const { sut, emailValidatorStub } = makeSut()
		jest.spyOn(emailValidatorStub, 'isValid')
			.mockReturnValueOnce(false)

		const httpRequest = {
			body: {
				email: 'invalid_email@',
				pwd: '1234@56',
				pwdConfirmation: '1234@56',
			}
		}
		const httpResponse = sut.exec(httpRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new InvalidParamError('email'))
	})
})


describe('Signup Controller', () => {
	it('Should call EmailValidator with correct email', () => {
		const { sut, emailValidatorStub } = makeSut()
		const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
		const httpRequest = {
			body: {
				email: 'correct_email@server.com',
				pwd: '1234@56',
				pwdConfirmation: '1234@56',
			}
		}
		const httpResponse = sut.exec(httpRequest)
		expect(httpResponse.statusCode).toBe(200)
		expect(isValidSpy).toHaveBeenCalledWith('correct_email@server.com')
	})
})


describe('Signup Controller', () => {
	it('Should return 500 if EmailValidator throws', () => {

		const emailValidatorStub = makeEmailValidatorWithError()
		const sut = new SignUpController(emailValidatorStub)
		const httpRequest = {
			body: {
				email: 'correct_email@server.com',
				pwd: '1234@56',
				pwdConfirmation: '1234@56',
			}
		}
		const httpResponse = sut.exec(httpRequest)
		expect(httpResponse.statusCode).toBe(500)
		expect(httpResponse.body).toEqual(new ServerError())
	})
})


describe('Signup Controller', () => {
	it('Should return 500 if EmailValidator throws (2nd way to impl)', () => {
		const { sut, emailValidatorStub } = makeSut()
		jest.spyOn(emailValidatorStub, 'isValid')
			.mockImplementationOnce( () => {
				throw new Error()
			})
		const httpRequest = {
			body: {
				email: 'correct_email@server.com',
				pwd: '1234@56',
				pwdConfirmation: '1234@56',
			}
		}
		const httpResponse = sut.exec(httpRequest)
		expect(httpResponse.statusCode).toBe(500)
		expect(httpResponse.body).toEqual(new ServerError())
	})
})


describe('Signup Controller', () => {
	it('Should return 200 if all params are provided', () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				email: 'any_email@server.com',
				pwd: '1234@56',
				pwdConfirmation: '1234@56',
			}
		}
		const httpResponse = sut.exec(httpRequest)
		expect(httpResponse.statusCode).toBe(200)
		// expect(httpResponse.body).toEqual(new Error('Missing param: pwdConfirmation'))
	})
})