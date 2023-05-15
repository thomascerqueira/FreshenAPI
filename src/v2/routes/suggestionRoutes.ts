import express from "express"
import SuggestionController from "~/controllers/suggestionController"
import { SuggestionValidator, Validator } from "~/middlewares/validators.handler"

const router = express.Router()

const routerToken = express.Router()

const { addSuggestion } = SuggestionController

routerToken.post(
    "/",
    SuggestionValidator.add(),
    Validator.confirm,
    //@ts-ignore
    addSuggestion
)

export {
    router, routerToken
}