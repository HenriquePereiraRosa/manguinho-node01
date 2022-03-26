import { InvalidParamError } from "@/api/errors/invalid-params-error";
import { ServerError } from "@/api/errors/server-error";
import { badRequest } from "@/api/helpers/http-helpers";
import { Controller } from "@/api/protocols/controller";
import { EmailValidator } from "@/api/protocols/email-validator";
import { MissingParamError } from "../../errors/missing-params-error";
import { HttpRequest, HttpResponse } from "../../protocols/http";

export class SignUpController implements Controller {

	constructor(
		private readonly emailValidator: EmailValidator
	) { }


	exec(req: HttpRequest): HttpResponse {
		try {
			const { email, pwd, pwdConfirmation } = req.body;
			const requiredFields = ['email', 'pwd', 'pwdConfirmation']

			for (const field of requiredFields) {
				if (!req.body[field]) {
					return badRequest(new MissingParamError(field))
				}
			}

			if (!this.emailValidator.isValid(email)) {
				return badRequest(new InvalidParamError('email'))
			}

			return {
				statusCode: 200,
				body: 'To refactor'
			}
		} catch (error) {
			return {
				statusCode: 500,
				body: new ServerError()
			}
		}
	}
}