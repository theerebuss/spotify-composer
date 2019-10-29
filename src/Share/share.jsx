import React from "react"
import { getToken, tokenIsEmpty, clearToken } from "../services/token.service.js"
import SpotifyService from "../services/spotify.service.js"
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import InputLabel from "@material-ui/core/InputLabel";
import { FormHelperText, Grid } from "@material-ui/core";
import ActionButton from '../components/action-button.jsx'

const shareIdKey = "spotifySharedIdKey"

export default class Share extends React.Component {
    constructor() {
        super()

        const shareId = this.parseUrlParam() || JSON.parse(localStorage.getItem(shareIdKey))
        localStorage.setItem(shareIdKey, JSON.stringify(shareId))

        const token = getToken()
        if (tokenIsEmpty(token)) {
            window.location.replace("/")
        }
        this.state = {
            token,
            selectedPlaylist: null,
            playlists: [],
            tracks: [],
            shareId: shareId || undefined,
            loading: false
        }

        this.spotify = new SpotifyService(`${token.token_type} ${token.access_token}`)
    }

    redirectToRoot() {
        window.location.replace("/")
    }

    logout() {
        clearToken()
        this.setState({ token: null })
        this.redirectToRoot()
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
        const url = parsedUrl.searchParams.get('text') || ""
        const matches = url.match(/\/(?!.*\/)(.+?)\?/) || []
        return matches.length == 2 ? matches[1] : null
    }

    componentDidMount() {
        if (!this.state.shareId) return

        this.spotify.getUserPlaylists().then(playlists => {
            const playlist = playlists[0]
            this.setState({ playlists, selectedPlaylistId: playlist.id, selectedPlaylistTrackCount: playlist.tracks.total })
        }).catch(error => this.logout())

        this.spotify.getAlbumById(this.state.shareId)
            .then((album) => this.spotify.getAlbumTracks(album))
            .then((tracks) => {
                const trackUris = tracks.map((track) => track.uri)
                this.setState({ tracks: trackUris })
            })
            .catch(error => this.logout())
    }

    render() {
        var options = [].concat(this.state.playlists).map(({ id, name }) => {
            return <MenuItem key={id} value={id}>{name}</MenuItem>
        })

        return <div>
            {
                this.state.shareId ?
                    this.state.selectedPlaylistId ?
                        <Grid container spacing={2} direction="column">
                            <Grid item>
                                <Button onClick={this.logout.bind(this)} variant="outlined">🚧 Logout 🚧</Button>
                            </Grid>

                            <Grid item xs={12}>
                                <InputLabel id="playlists-label" shrink>Playlist</InputLabel>
                                <Select id="playlists" onChange={this.setPlaylist.bind(this)}
                                    labelId="playlists-label" value={this.state.selectedPlaylistId} displayEmpty>
                                    {options}
                                </Select>
                                <FormHelperText>{this.state.selectedPlaylistTrackCount} tracks</FormHelperText>
                            </Grid>

                            <Grid item>
                                <ActionButton onClick={this.add.bind(this)} text="Add" loading={this.state.loading}></ActionButton>
                            </Grid>
                        </Grid>
                        : <div></div>

                    : <span>No valid URL was provided</span>
            }
        </div>
    }
}