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
            playlists: [],
            tracks: [],
            loading: false
        }

        this.spotify = new SpotifyService(`${token.token_type} ${token.access_token}`)
    }

    redirectToRoot() {
        window.location.replace("/")
    }

    setPlaylist(event) {
        this.setState({ selectedPlaylistId: event.target.value })
        this.spotify.getPlaylist(event.target.value).then(playlist => {
            this.setState({ selectedPlaylistTrackCount: playlist.tracks.total })
        })
    }

    add() {
        this.setState({ loading: true })
        this.spotify.addTracksToPlaylist(this.state.selectedPlaylistId, this.state.tracks)
            .then(() => {
                this.spotify.getPlaylist(this.state.selectedPlaylistId).then((playlist) =>
                    this.setState({ selectedPlaylistTrackCount: playlist.tracks.total, loading: false }))
            })
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

        if(!sharedObject) {
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
            this.setShareError("Invalid item was provided. Needs to be an album or a playlist.")
            return
        }

        this.spotify.getUserPlaylists().then(playlists => {
            const playlist = playlists[0]
            this.setState({ playlists, selectedPlaylistId: playlist.id, selectedPlaylistTrackCount: playlist.tracks.total })
        }).catch(error => this.handleError(error))

        this.spotify.getById(this.state.sharedItem.id, this.state.sharedItem.context)
            .then((item) => {
                this.setState({ sharedSpotifyItem: item })

                return this.spotify.getElementTracks(item)
            })
            .then((tracks) => {
                // Playlist tracks have the track object inside of a 'track' parameter
                const trackUris = tracks.map((track) => track.uri || track.track.uri)
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
                    this.state.selectedPlaylistId ?
                        <Grid container spacing={2} direction="column">
                            <Grid item>
                                <SpotifyItem value={this.state.sharedSpotifyItem}></SpotifyItem>
                            </Grid>

                            <Grid item>
                                <Typography variant="subtitle1">Add tracks to:</Typography>
                                <InputLabel id="playlists-label" shrink>Playlist</InputLabel>
                                <Select id="playlists" onChange={this.setPlaylist.bind(this)}
                                    labelId="playlists-label" value={this.state.selectedPlaylistId} displayEmpty>
                                    {options}
                                </Select>
                                <FormHelperText>{this.state.selectedPlaylistTrackCount} tracks</FormHelperText>
                            </Grid>

                            <Grid item>
                                <ActionButton onClick={this.add.bind(this)} text="Add" loading={this.state.loading} />
                            </Grid>

                            <Grid item>
                                <VersionFooter />
                            </Grid>
                        </Grid>
                        : null

                    : <span>{this.state.errorMessage}</span>
            }
        </div>
    }
}