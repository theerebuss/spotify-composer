import React from "react"
import { getToken, tokenIsEmpty, clearToken } from "../services/token.service.js"
import SpotifyService from "../services/spotify.service.js"

export default class Share extends React.Component {
    constructor() {
        super()

        const token = getToken()
        if (tokenIsEmpty(token)) {
            window.location.replace("/")
        }
        this.state = {
            token: token,
            selectedPlaylist: null,
            playlists: [],
            tracks: []
        }

        this.spotify = new SpotifyService(`${token.token_type} ${token.access_token}`)
    }

    logout() {
        clearToken()
        this.setState({ token: null })
        window.location.replace("/")
    }

    setPlaylist(event){
        this.spotify.getPlaylist(event.target.value).then(playlist => {
            this.setState({ selectedPlaylist: playlist.id, trackCount: playlist.tracks.total})
        })
    }

    add() {
        const playlistId = this.state.selectedPlaylist
        this.spotify.addTracksToPlaylist(playlistId, this.state.tracks)
            .then(() => {
                this.spotify.getPlaylist(playlistId).then((playlist) => this.setState({trackCount: playlist.tracks.total}))
            })
    }

    componentDidMount() {
        this.spotify.getUserPlaylists().then(playlists => {
            const playlist = playlists[0]
            this.setState({ playlists, selectedPlaylist: playlist.id, trackCount: playlist.tracks.total})
        })

        const albumId = "1seeMmdvQUplCh1cTRbWJx"
        this.spotify.getAlbumById(albumId)
            .then((album) => this.spotify.getAlbumTracks(album))
            .then((tracks) => {
                const trackUris = tracks.map((track) => track.uri)
                this.setState({ tracks: trackUris})
            })
    }

    render() {
        var options = [].concat(this.state.playlists).map(({ id, name }) => <option key={id} value={id}>{name}</option>)

        return <div>
            <button onClick={this.logout.bind(this)}>🚧 Logout 🚧</button><br /><br />

            <select onChange={this.setPlaylist.bind(this)}>{options}</select>
            <button onClick={this.add.bind(this)}>Add</button>
            <span> {this.state.trackCount} tracks</span>
        </div>
    }
}