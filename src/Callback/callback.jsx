import React from "react"
import { parse } from "query-string"
import { setToken, tokenIsEmpty } from "../services/token.service"

class Callback extends React.Component {
    constructor() {
        super()
        
        const token = parse(window.location.hash)
        if(tokenIsEmpty(token))
        {
            window.location.replace("/")
        }

        setToken(parse(window.location.hash))
        window.location.replace("/share")
    }
}

export default Callback