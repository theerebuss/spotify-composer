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
        if(!tokenIsEmpty(token))
        {
            window.location.replace("/share")
        }
    }

    redirectSpotify() {
        window.location.replace(`https://accounts.spotify.com/authorize?client_id=4311e063f31d4d0283389f60ad5785c1&redirect_uri=${"https:%2F%2Flocalhost:8080/callback"}&response_type=token`)
    }

    render() {
        return (
            <div>
                <Typography variant="h4" gutterBottom>
                    Log into your Spotify account
                </Typography>
                <SpotifyButton onClick={this.redirectSpotify} variant="contained" color="primary">
                    Login with Spotify
                </SpotifyButton>
            </div>
        );
    }
}