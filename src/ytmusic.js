const { YTMUSIC } = require('ytmusic');
const API = new YTMUSIC(document.cookie)

export function search(musics) {
    console.log(`>> search ${JSON.stringify(musics)}}`)

    return Promise.allSettled(
        musics.map(
            ({title, artist}) => 
                API.search(`${artist} ${title}`, { filter: 'songs' }).then((results) => results.length > 0 ? results[0].id : null)
        )
    );
}


// 가져온 노래 정보를 playlist 에 추가한다. 
export function addToPlaylist(musicIds, playlistId) {
    console.log(`>> add playlists: ${JSON.stringify(musicIds)}`);
    return API.addToPlaylist(musicIds, playlistId, true);
}

export function getPlaylist(playlistId) {
    console.log(`>> get playlist detail: ${JSON.stringify(playlistId)}`);
    return API.getPlaylist(playlistId);
}