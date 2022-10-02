const { YTMUSIC } = require('ytmusic');
const { parsePlaylist } = require('./parse');
const { addToPlaylist } = require('./ytmusic');

const API = new YTMUSIC(document.cookie)

// 노래를 저장할 playlist ID
let playlistId = 'PLma835fHaaztKoG97FEpgMh_qp-bSuHmr';

let musics = [];
let fail = [];
let success = [];

export function getMusics() {
    return musics;
}

export function getFail() {
    return fail;
}

export function getSuccess() {
    return success;
}

export function setPlaylistId(_playlistId) {
    playlistId = _playlistId;
}

export function getPlaylistId() {
    return playlistId;
}

export function parseAndSetMusics() {
    musics = parsePlaylist();
}

export async function musicsToPlaylist(musics) {
    // 노래를 검색한다. 
    let results = await Promise.allSettled(search(musics))
    results = results.map((result, index) => ({ ...result, target: musics[index] }))

    // 노래 정보가 있으면 playlist 에 추가한다.
    this.success = results.filter(result => result.status === 'fulfilled' && result.value);
    await addToPlaylist(this.success);

    // 노래 정보가 없으면 실패 목록에 추가한다. 
    this.fail = results.filter(result => result.status === 'rejected' || !result.value);        
    console.log(`>> show failed: ${JSON.stringify(rejected.map(result => result.target))}`)
    console.log(JSON.stringify(rejected, null, 2));
}
