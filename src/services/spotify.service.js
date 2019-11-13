import axios from "axios"

export default class SpotifyService {
  constructor(token) {
    this.token = token
  }

  getById(id, context = "albums") {
    return new Promise(resolve => {
      this.get(`https://api.spotify.com/v1/${context}/${id}`).then((item) => {
        if (!item.tracks.next) {
          resolve(item)
        }

        this.getAllTracks(item.tracks.next, item.tracks.items).then(tracks => {
          item.tracks.items = tracks
          item.tracks.total = tracks.length
          resolve(item)
        })
      })
    })
  }

  getAllTracks(url, accumulator = []) {
    return this.get(url).then(result => {
      accumulator = accumulator.concat(result.items.map(item => item.track))

      if (result.next) return this.getAllTracks(url, accumulator)

      return accumulator
    })
  }

  getElementTracks(element) {
    console.log("getElementTracks", element)
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

  addTracksToPlaylistRecursive(playlistId, trackUris = [], limit = 100) {
    const tracksCopy = [].concat(trackUris)
    const limitedTracks = tracksCopy.splice(0, limit)

    if(limitedTracks.length > 0) {
      return this.addTracksToPlaylist(playlistId, limitedTracks).then(() => {
        if(tracksCopy.length > 0)
          return this.addTracksToPlaylistRecursive(playlistId, tracksCopy, limit)
      })
    }
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