import { InvalidParamError } from '@/api/errors/invalid-params-error'
import { EmailValidator } from '@/api/protocols/email-validator'
import { SignUpController } from './signup'

interface SutTypes {
	sut: SignUpController,
	emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
	class EmailValidatorStub implements EmailValidator {
		isValid(email: string): boolean {
			return true
		}

	}
	const emailValidatorStub = new EmailValidatorStub()
	const sut = new SignUpController(emailValidatorStub)
	return {
		sut,
		emailValidatorStub
	}
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