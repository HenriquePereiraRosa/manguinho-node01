import { MissingParamError } from "../../erros/missing-params-error";
import { HttpRequest, HttpResponse } from "../../protocols/http";

export class SignUpController {
 handle(httpRequest: HttpRequest): HttpResponse {
  return {
   statusCode: 400,
   body: new MissingParamError('name')
  }
 }
}