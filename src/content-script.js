import { parseMusicTable } from "./parse";
import { search, addToPlaylist, getPlaylist, getPlaylists} from "./ytmusic";

/**
 * Message handlers for chrome tab.
 * - Deal with requests to youtube or something because of CORS issues.
 */
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.action === 'get_musics') {
        const table = document.querySelector('#songlist_frame').contentDocument.querySelector('#musicView > table > tbody')
        sendResponse(parseMusicTable(table));
    } else if (msg.action === 'search_musics') {
        const {musics} = msg.params;
        search(musics).then(values => 
            chrome.runtime.sendMessage('alaidjagmphdjliibkabmpcdflmagglj', { action: 'search_result', params: {values, musics} }));
    } else if (msg.action === 'get_playlists') {
        getPlaylists().then(values => 
            chrome.runtime.sendMessage('alaidjagmphdjliibkabmpcdflmagglj', { action: 'get_playlists_result', params: {values} }));
    } else if (msg.action === 'add_musics_playlist') {
        const {musicIds, playlistId} = msg.params;

        let targetIds = [...musicIds];
        getPlaylist(playlistId)
            .then(({ content }) => {
                const existIds = content.map(({ id }) => id);
                console.log(JSON.stringify(existIds));
                targetIds = targetIds.filter(id => !(id in existIds))
                addToPlaylist(targetIds, playlistId)
                    .then(({status}) => {
                        chrome.runtime.sendMessage(
                            'alaidjagmphdjliibkabmpcdflmagglj', 
                            { action: 'add_musics_playlist_result', params: { status } }
                        );
                    });
            })
    }
});

