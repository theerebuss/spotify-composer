import React from "react"
import Typography from "@material-ui/core/Typography";
import { getToken, tokenIsEmpty } from "../services/token.service";
import ActionButton from "../components/action-button.jsx";

export default class Login extends React.Component {
    constructor() {
        super()

        const token = getToken()
        if (!tokenIsEmpty(token)) {
            window.location.replace("/share")
        }
        
        this.state = {
            loading: false
        }
    }

    getAuthorizationUri(client_id, redirect_uri, scopes = []) {
        const url = "https://accounts.spotify.com/authorize"
        const params = {
            client_id,
            redirect_uri,
            response_type: "token"
        }

        if (scopes.length > 0) {
            params.scope = scopes
        }

        const paramString = new URLSearchParams(params)
        return `${url}?${paramString}`
    }

    redirectSpotify() {
        this.setState({loading: true})
        const authScopes = ["playlist-modify-private", "playlist-modify-public"]

        const baseUrl = process.env.NODE_ENV == "production"
            ? "https://spotify-composer.azurewebsites.net"
            : "http://localhost:9000"

        const authUri = this.getAuthorizationUri("4311e063f31d4d0283389f60ad5785c1", `${baseUrl}/callback`, authScopes)

        window.location.replace(authUri)
    }

    render() {
        return (
            <div>
                <Typography variant="h4" gutterBottom>
                    Log into your Spotify account
                </Typography>
                <ActionButton onClick={this.redirectSpotify.bind(this)} text="Login with Spotify" loading={this.state.loading}></ActionButton>
            </div>
        );
    }
}