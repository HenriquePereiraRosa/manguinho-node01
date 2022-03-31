import { InvalidParamError, ServerError } from '@/api/errors'
import { AccountModel } from '@/domain/models/account'
import { AddAccount, AddAccountModel } from '@/domain/usecases/add-account'
import { SignUpController } from './signup'
import { EmailValidator } from './signup-protocols'

interface SutTypes {
	sut: SignUpController,
	emailValidatorStub: EmailValidator,
	addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
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

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@server.com',
        pwd: 'valid_pwd'
      }
      return new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountStub()
}


describe('Signup Controller', () => {
  it('Should return 400 if no email is provided', async() => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        pwd: '1234@56',
        pwdConfimation: '1234@56'
      }
    }
    const httpResponse = await sut.exec(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: email'))
  })
})


describe('Signup Controller', () => {
  it('Should return 400 if no pwd is provided', async() => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@server.com',
        pwdConfimation: '1234@56'
      }
    }
    const httpResponse = await await sut.exec(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: pwd'))
  })
})


describe('Signup Controller', () => {
  it('Should return 400 if no pwdConfirmation is provided', async() => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@server.com',
        pwd: '1234@56',
      }
    }
    const httpResponse = await sut.exec(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: pwdConfirmation'))
  })
})


describe('Signup Controller', () => {
  it('Should return 400 if no pwdConfirmation and pwd doesn\'t match', async() => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@server.com',
        pwd: '1234@56',
        pwdConfirmation: '1234',
      }
    }
    const httpResponse = await sut.exec(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('pwdConfirmation'))
  })
})


describe('Signup Controller', () => {
  it('Should return 400 if email is invalid', async() => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid')
      .mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@',
        pwd: '1234@56',
        pwdConfirmation: '1234@56',
      }
    }
    const httpResponse = await sut.exec(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
})


describe('Signup Controller', () => {
  it('Should call EmailValidator with correct email', async() => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'correct_email@server.com',
        pwd: '1234@56',
        pwdConfirmation: '1234@56',
      }
    }
    const httpResponse = await sut.exec(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(isValidSpy).toHaveBeenCalledWith('correct_email@server.com')
  })
})


describe('Signup Controller', () => {
  it('Should return 500 if EmailValidator throws', async() => {

    const emailValidatorStub = makeEmailValidatorWithError()
    const addAccountStub = makeAddAccount()
    const sut = new SignUpController(emailValidatorStub, addAccountStub)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'correct_email@server.com',
        pwd: '1234@56',
        pwdConfirmation: '1234@56',
      }
    }
    const httpResponse = await sut.exec(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})


describe('Signup Controller', () => {
  it('Should return 500 if EmailValidator throws (2nd way to impl)', async() => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid')
      .mockImplementationOnce( () => {
        throw new Error()
      })
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'correct_email@server.com',
        pwd: '1234@56',
        pwdConfirmation: '1234@56',
      }
    }
    const httpResponse = await sut.exec(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})



describe('Signup Controller', () => {
  it('Should call AddAccount with correct values', async() => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'correct_email@server.com',
        pwd: '1234@56',
        pwdConfirmation: '1234@56',
      }
    }
    const httpResponse = await sut.exec(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(addSpy).toBeCalledWith({
      name: 'any_name',
      email: 'correct_email@server.com',
      pwd: '1234@56',
    })
  })
})



describe('Signup Controller', () => {
  it('Should return 500 if AddAccount throws', async() => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'correct_email@server.com',
        pwd: '1234@56',
        pwdConfirmation: '1234@56',
      }
    }
    const httpResponse = await sut.exec(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})

describe('Signup Controller', () => {
  it('Should return 200 if all params are provided', async() => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@server.com',
        pwd: '1234@56',
        pwdConfirmation: '1234@56',
      }
    }
    const httpResponse = await sut.exec(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@server.com',
      pwd: 'valid_pwd',
    })
  })
})