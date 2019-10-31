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
            sharedItem: null,
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
        }).catch(() => this.logout())

        this.spotify.getAlbumById(this.state.shareId)
            .then((album) => {
                this.setState({ sharedItem: album })

                return this.spotify.getAlbumTracks(album)
            })
            .then((tracks) => {
                const trackUris = tracks.map((track) => track.uri)
                this.setState({ tracks: trackUris })
            })
            .catch(() => this.logout())
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
                                <ActionButton onClick={this.logout.bind(this)} variant="outlined" text="🚧 Logout 🚧" />
                            </Grid>

                            <Grid item>
                                <Typography variant="h6" gutterBottom>
                                    Album being added:
                                </Typography>
                                <SpotifyItem item={this.state.sharedItem}></SpotifyItem>
                            </Grid>

                            <Grid item>
                                <Typography variant="h6">Add to:</Typography>
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

                    : <span>No valid URL was provided</span>
            }
        </div>
    }
}