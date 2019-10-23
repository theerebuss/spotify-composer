import axios from "axios"

export default class SpotifyService {
  constructor(token) {
    this.token = token
  }

  getAlbumById(id) {
    return this.get(`https://api.spotify.com/v1/albums/${id}`)
  }

  getAlbumTracks(album) {
    return this.get(album.tracks.href).then((data) => data.items)
  }

  getUserPlaylists() {
    return this.get("https://api.spotify.com/v1/me/playlists").then((data) => data.items)
  }

  addTracksToPlaylist(playlistId, trackUris) {
    return axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, { uris: trackUris }, {
      headers: {
        'Authorization': this.token,
        'Content-Type': 'application/json'
      }
    }).then((data) => console.log(data))
  }

  get(url) {
    return axios.get(url, {
      headers: {
        'Authorization': this.token
      }
    }).then((response) => response.data)
      .catch((response) => { console.log(response) })
  }
}