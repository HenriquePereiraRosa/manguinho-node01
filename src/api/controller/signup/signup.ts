import { InvalidParamError, MissingParamError } from "@/api/errors"
import { badRequest, ok, serverError } from "@/api/helpers/http-helpers"
import { AddAccount } from "@/domain/usecases/add-account"
import {
  Controller,
  HttpRequest,
  HttpResponse,
  EmailValidator
} from "./signup-protocols"

export class SignUpController implements Controller {

  constructor(
		private readonly emailValidator: EmailValidator,
		private readonly addAccount: AddAccount
  ) { }


  async exec(req: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email, pwd, pwdConfirmation } = req.body;
      const requiredFields = ['name', 'email', 'pwd', 'pwdConfirmation']

      for (const field of requiredFields) {
        if (!req.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      if (pwd !== pwdConfirmation) {
        return badRequest(new InvalidParamError('pwdConfirmation'))
      }
      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({
        name,
        email,
        pwd
      })

      return ok(account)
    } catch (error) {
      return serverError()
    }
  }
}