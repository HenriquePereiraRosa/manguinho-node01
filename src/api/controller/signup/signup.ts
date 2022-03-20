import { badRequest } from "@/api/helpers/http-helpers";
import { Controller } from "@/api/protocols/controller";
import { MissingParamError } from "../../erros/missing-params-error";
import { HttpRequest, HttpResponse } from "../../protocols/http";

export class SignUpController implements Controller {
	exec(httpRequest: HttpRequest): HttpResponse {
		const { email, pwd, pwdConfirmation } = httpRequest.body;

		if (!email) {
			return badRequest(new MissingParamError('email'))
		}
		if (!pwd) {
			return badRequest(new MissingParamError('pwd'))
		}
		if (!pwdConfirmation) {
			return badRequest(new MissingParamError('pwdConfirmation'))
		}

		return {
			statusCode: 200,
			body: 'To refactor'
		}
	}
}