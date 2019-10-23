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
        this.setState({selectedPlaylist: event.target.value});
    }

    add() {
        this.spotify.addTracksToPlaylist(this.state.selectedPlaylist, this.state.tracks)
    }

    componentDidMount() {
        this.spotify.getUserPlaylists().then(res => this.setState({ playlists: res, selectedPlaylist: res[0].id }))

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
        </div>
    }
}