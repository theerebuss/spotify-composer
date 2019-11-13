import axios from "axios"

export default class SpotifyService {
  constructor(token) {
    this.token = token
  }

  getById(id, context = "albums") {
    return this.get(`https://api.spotify.com/v1/${context}/${id}`)
  }

  getElementTracks(element) {
    return this.get(element.tracks.href).then((response) => response.items)
  }

  getUserPlaylists() {
    return this.get("https://api.spotify.com/v1/me/playlists").then((response) => response.items)
  }

  addTracksToPlaylist(playlistId, trackUris) {
    return axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, { uris: trackUris }, {
      headers: {
        'Authorization': this.token,
        'Content-Type': 'application/json'
      }
    }).then((response) => response.data)
  }

  getPlaylist(playlistId) {
    return this.get(`https://api.spotify.com/v1/playlists/${playlistId}`)
  }

  get(url) {
    return axios.get(url, {
      headers: {
        'Authorization': this.token
      }
    }).then((response) => response.data)
  }
}