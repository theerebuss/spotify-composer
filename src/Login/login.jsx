import React from "react"
import Button from '@material-ui/core/Button';
import { styled } from '@material-ui/styles';
import { Typography } from "@material-ui/core";
import { getToken, tokenIsEmpty } from "../services/token.service";

const SpotifyButton = styled(Button)({
    background: '#1DB954'
});

export default class Login extends React.Component {
    constructor() {
        super()

        const token = getToken()
        if (!tokenIsEmpty(token)) {
            window.location.replace("/share")
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
                <SpotifyButton onClick={this.redirectSpotify.bind(this)} variant="contained" color="primary">
                    Login with Spotify
                </SpotifyButton>
            </div>
        );
    }
}