import { HttpRequest, HttpResponse } from "./http"

export interface Controller {
	exec(httpRequest: HttpRequest): Promise<HttpResponse>
}