import React from 'react'
import { parse } from "query-string"
import { setToken, tokenIsEmpty } from "../services/token.service"
import CircularProgress from '@material-ui/core/CircularProgress'

const absoluteStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}

function Callback() {
    const token = parse(window.location.hash)
    if (tokenIsEmpty(token)) {
        window.location.replace("/")
    }

    setToken(parse(window.location.hash))
    window.location.replace("/share")

    return <div style={absoluteStyle}>
        <CircularProgress size={128} />
    </div>
}

export default Callback