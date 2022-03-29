import { InvalidParamError } from "@/api/errors/invalid-params-error";
import { badRequest, serverError } from "@/api/helpers/http-helpers";
import { AddAccount } from "@/domain/usecases/add-account";
import { MissingParamError } from "../../errors/missing-params-error";
import {
  Controller,
  HttpRequest,
  HttpResponse
} from "../../protocols";
import { EmailValidator } from "./signup-protocols/email-validator";

export class SignUpController implements Controller {

  constructor(
		private readonly emailValidator: EmailValidator,
		private readonly addAccount: AddAccount
  ) { }


  exec(req: HttpRequest): HttpResponse {
    try {
      const { name, email, pwd, pwdConfirmation } = req.body;
      const requiredFields = ['name', 'email', 'pwd', 'pwdConfirmation']

      for (const field of requiredFields) {
        if (!req.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }

      this.addAccount.add({
        name,
        email,
        pwd
      })

      return {
        statusCode: 200,
        body: 'To refactor'
      }
    } catch (error) {
      return serverError()
    }
  }
}