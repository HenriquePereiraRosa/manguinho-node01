import { SignUpController } from './signup'

describe('Signup Controller', () => {
 it('Should return 400 if no email is provided', () => {
  const sut = new SignUpController()
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
  const sut = new SignUpController()
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
  const sut = new SignUpController()
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
 it('Should return 200 if all params are provided', () => {
  const sut = new SignUpController()
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