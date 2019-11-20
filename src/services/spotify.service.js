import axios from "axios"

export default class SpotifyService {
  constructor(token) {
    this.token = token
    this.endpoint = "https://api.spotify.com/v1"
  }

  getById(id, countryCode, context = "albums") {
    return new Promise(resolve => {
      if (context === "artists") {
        return this.getArtistWithTracks(id, countryCode).then(artist => resolve(artist))
      } else {
        this.get(`${this.endpoint}/${context}/${id}`).then(item => {
          if (!item.tracks.next) {
            return resolve(item)
          }

          this.getAllTracks(item.tracks.next, item.tracks.items).then(tracks => {
            item.tracks.items = tracks
            item.tracks.total = tracks.length
            return resolve(item)
          })
        })
      }
    })
  }

  getArtistWithTracks(id, countryCode) {
    let artist = {}

    return Promise.all([
      this.getArtist(id).then(result => artist = { ...artist, ...result }),
      this.getArtistsAlbums(id, countryCode)
        .then(albums => Promise.all(albums.items.map(album => this.getAlbumTracks(album.id))))
        .then(result => {
          const totalTracks = result.flatMap(albumTracks => albumTracks.items)

          artist.tracks = {
            items: totalTracks,
            total: totalTracks.length
          }
        })
    ]).then(() => artist)
  }

  getAlbumTracks(id) {
    return this.get(`${this.endpoint}/albums/${id}/tracks`)
  }

  getArtist(id) {
    return this.get(`${this.endpoint}/artists/${id}`)
  }

  getArtistsAlbums(id, country = "US") {
    return this.get(`${this.endpoint}/artists/${id}/albums`, {
      include_groups: "album",
      limit: 50,
      country: country
    })
  }

  getUser() {
    return this.get(`${this.endpoint}/me`)
  }

  getAllTracks(url, accumulator = []) {
    return this.get(url).then(result => {
      accumulator = accumulator.concat(result.items.map(item => item.track))

      if (result.next) return this.getAllTracks(url, accumulator)

      return accumulator
    })
  }

  getUserPlaylists() {
    return this.get(`${this.endpoint}/me/playlists`).then(response => response.items)
  }

  getPlaylist(playlistId) {
    return this.get(`${this.endpoint}/playlists/${playlistId}`)
  }

  addTracksToPlaylist(playlistId, trackUris) {
    return this.post(`${this.endpoint}/playlists/${playlistId}/tracks`, { uris: trackUris })
  }

  addTracksToPlaylistRecursive(playlistId, trackUris = [], limit = 100) {
    const tracksCopy = [...trackUris]
    const limitedTracks = tracksCopy.splice(0, limit)

    if (limitedTracks.length > 0) {
      return this.addTracksToPlaylist(playlistId, limitedTracks).then(() => {
        if (tracksCopy.length > 0)
          return this.addTracksToPlaylistRecursive(playlistId, tracksCopy, limit)
      })
    }
  }

  createPlaylist(user, name) {
    return this.post(`${this.endpoint}/users/${user.id}/playlists`, {
      name,
      public: false,
      collaborative: false
    }).then(playlist => {
      if (playlist.images ?.length > 0) {
        // this.post(`${this.endpoint}/playlists/${playlist.id}/images`, base64CoverImage, 'image/jpeg')
      }
    })
  }

  get(uri, params) {
    return axios.get(uri, {
      headers: {
        'Authorization': this.token
      },
      params
    }).then(response => response.data)
  }

  post(uri, body, contentType = 'application/json') {
    return axios.post(uri, body, {
      headers: {
        'Authorization': this.token,
        'Content-Type': contentType
      }
    }).then(response => response.data)
  }
}