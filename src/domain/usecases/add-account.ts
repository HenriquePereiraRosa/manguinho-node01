import { AccountModel } from "./models/account"

export interface AddAccountModel {
	name: string,
	email: string
	pwd: string
}

export interface AddAccount {
	add (account: AddAccountModel): Promise<AccountModel>
}