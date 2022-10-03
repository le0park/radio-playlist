const { YTMUSIC } = require('ytmusic');
const API = new YTMUSIC(document.cookie)

/**
 * Search the musics from youtube.
 * @param {*} musics 
 * @returns 
 */
export function search(musics) {
    console.log(`>> search ${JSON.stringify(musics)}}`)

    return Promise.allSettled(
        musics.map(
            ({title, artist}) => 
                API.search(`${artist} ${title}`, { filter: 'songs' }).then((results) => results.length > 0 ? results[0].id : null)
        )
    );
}


/**
 * Add musics to playlist.
 * @param {*} musicIds 
 * @param {*} playlistId 
 * @returns 
 */
export function addToPlaylist(musicIds, playlistId) {
    console.log(`>> add playlists: ${JSON.stringify(musicIds)}`);

    return API.addToPlaylist(musicIds, playlistId, true);
}

/**
 * Get playlist details.
 * @param {*} playlistId 
 * @returns 
 */
export function getPlaylist(playlistId) {
    console.log(`>> get playlist detail: ${JSON.stringify(playlistId)}`);
    
    return API.getPlaylist(playlistId);
}

/**
 * Get all playlists.
 * @returns 
 */
export function getPlaylists() {
    console.log(`>> get playlists`);
    
    return API.getPlaylists();
}