import React from "react"
import { getToken, tokenIsEmpty, clearToken } from "../services/token.service.js"
import SpotifyService from "../services/spotify.service.js"
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import ActionButton from '../components/action-button.jsx'
import VersionFooter from '../Footer/footer.jsx'
import SpotifyItem from "../components/spotify-item.jsx";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

const shareIdKey = "spotifySharedItem"
const newPlaylistKey = "newPlaylist"

export default class Share extends React.Component {
    constructor() {
        super()

        const sharedItem = this.getSharedObject()

        const token = getToken()
        if (tokenIsEmpty(token)) {
            this.redirectToRoot()
        }

        this.state = {
            hasError: false,
            errorMessage: null,
            token,
            sharedItem,
            sharedSpotifyItem: null,
            selectedPlaylist: null,
            selectedPlaylistId: newPlaylistKey,
            playlists: [],
            tracks: [],
            loading: false
        }

        this.spotify = new SpotifyService(`${token.token_type} ${token.access_token}`)
    }

    redirectToRoot() {
        window.location.replace("/")
    }

    onPlaylistChange(event) {
        this.setState({ selectedPlaylistId: event ?.target ?.value })
        if (event ?.target ?.value == newPlaylistKey) {
            this.setState({ selectedPlaylist: null })
            return
        }

        this.spotify.getPlaylist(event.target.value).then(playlist =>
            this.setState({ selectedPlaylist: playlist })
        )
    }

    add() {
        this.setState({ loading: true })

        if (this.state.selectedPlaylistId == newPlaylistKey) {
            this.spotify.createPlaylist(this.state.user, this.state.sharedSpotifyItem.name)
                .then(playlist => this.addToPlaylist(playlist.id, this.state.tracks))
        }
        else {
            this.addToPlaylist(this.state.selectedPlaylistId, this.state.tracks)
        }
    }

    addToPlaylist(playlistId, tracks) {
        return this.spotify.addTracksToPlaylistRecursive(playlistId, tracks)
            .then(() => this.spotify.getPlaylist(playlistId))
            .then(playlist => this.setState({
                selectedPlaylist: playlist,
                loading: false
            }))
    }

    parseUrlParam() {
        const parsedUrl = new URL(window.location)
        const url = parsedUrl.searchParams.get('text')

        if (!url) return

        const terminatorPos = url.indexOf("?")
        const strippedQueryParamsUrl = url.substring(0, terminatorPos > 0 ? terminatorPos : url.length)
        const urlParts = strippedQueryParamsUrl.split("/")

        // open.spotify.com uses singular notation for their URLs
        // but the Spotify API uses pluralized notation
        const shareObject = urlParts.length > 2 ? {
            id: urlParts[urlParts.length - 1],
            context: urlParts[urlParts.length - 2] + 's'
        } : null

        return shareObject
    }

    getSharedObject() {
        let sharedObject = this.parseUrlParam()
        const localObject = JSON.parse(localStorage.getItem(shareIdKey))

        if (!sharedObject) {
            sharedObject = localObject
            localStorage.removeItem(shareIdKey)
        }
        else {
            localStorage.setItem(shareIdKey, JSON.stringify(sharedObject))
        }

        return sharedObject || undefined
    }

    handleError(error) {
        this.setShareError("Error invoking Spotify API")

        if (error.response.status == 401) {
            clearToken()
            this.setState({ token: null })
            this.redirectToRoot()
        }
    }

    componentDidMount() {
        if (!this.state.sharedItem) {
            this.setShareError("Invalid item was provided. Needs to be an album, playlist or artist.")
            return
        }

        this.spotify.getUserPlaylists()
            .then(playlists => this.setState({ playlists }))
            .catch(error => this.handleError(error))

        this.spotify.getUser()
            .then(user => {
                this.setState({ user })
                return this.spotify.getById(this.state.sharedItem.id, user.country, this.state.sharedItem.context)
            }).then(item => {
                this.setState({ sharedSpotifyItem: item })

                // Playlist tracks have the track object inside of a 'track' parameter
                const trackUris = item.tracks.items.map((track) => track.uri || track.track.uri)
                this.setState({ tracks: trackUris })
            }).catch(error => this.handleError(error))
    }

    setShareError(errorMessage) {
        localStorage.removeItem(shareIdKey)
        this.setState({ hasError: true, errorMessage })
    }

    render() {
        var options = [].concat(this.state.playlists).map(({ id, name }) => {
            return <MenuItem key={id} value={id}>{name}</MenuItem>
        })

        return <div>
            {
                !this.state.hasError ?
                    <Grid container spacing={2} direction="column">
                        <Grid item>
                            <SpotifyItem value={this.state.sharedSpotifyItem}></SpotifyItem>
                        </Grid>

                        <Grid item>
                            <Typography variant="subtitle1">Add tracks to:</Typography>
                            <InputLabel id="playlists-label" shrink>Playlist</InputLabel>
                            <Select id="playlists" onChange={this.onPlaylistChange.bind(this)}
                                labelId="playlists-label" value={this.state.selectedPlaylistId}>
                                <MenuItem key={newPlaylistKey} value={newPlaylistKey}><i>New Playlist</i></MenuItem>
                                {options}
                            </Select>
                            <FormHelperText>{this.state ?.selectedPlaylist ?.tracks ?.total ?? 0} tracks</FormHelperText>
                        </Grid>

                        <Grid item>
                            <ActionButton onClick={this.add.bind(this)} text="Add" loading={this.state.loading} />
                        </Grid>

                        <Grid item>
                            <VersionFooter />
                        </Grid>
                    </Grid>

                    : <span>{this.state.errorMessage}</span>
            }
        </div>
    }
}