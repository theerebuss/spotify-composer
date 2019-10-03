import React from "react"
import { getToken, tokenIsEmpty } from "../services/token.service.js"
import axios from "axios"

export default class Share extends React.Component {
    constructor() {
        super()

        const token = getToken()
        if (tokenIsEmpty(token)) {
            window.location.replace("/")
        }
        this.state = {
            token: token
        }
    }

    componentDidMount() {
        axios.get("https://api.spotify.com/v1/me/playlists", {
            headers: {
                'Authorization': `${this.state.token.token_type} ${this.state.token.access_token}`
            }
        }).then(res => this.setState({ playlists: res }));
    }


    render() {
        return <span>{JSON.stringify(this.state.playlists)}</span>
    }
}