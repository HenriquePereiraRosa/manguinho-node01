import { InvalidParamError } from "@/api/errors/invalid-params-error";
import { badRequest, serverError } from "@/api/helpers/http-helpers";
import {
	Controller,
	EmailValidator,
	HttpRequest,
	HttpResponse
} from "../../protocols";
import { MissingParamError } from "../../errors/missing-params-error";

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
			return serverError()
		}
	}
}