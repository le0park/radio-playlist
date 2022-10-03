import { parseMusicTable } from "./parse";
import { search, addToPlaylist, getPlaylist, getPlaylists} from "./ytmusic";

/**
 * Message handlers for chrome tab.
 * - Deal with requests to youtube or something because of CORS issues.
 */
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.action === 'get_musics') {
        /**
         * Parse a music table and return the musics.
         */
        const table = document.querySelector('#songlist_frame').contentDocument.querySelector('#musicView > table > tbody')
        sendResponse(parseMusicTable(table));
    } else if (msg.action === 'search_musics') {
        /**
         * Search the musics from youtube and return musics with id.
         */
        const {musics} = msg.params;
        search(musics).then(values => 
            chrome.runtime.sendMessage('alaidjagmphdjliibkabmpcdflmagglj', { action: 'search_result', params: {values, musics} }));
    } else if (msg.action === 'get_playlists') {
        /**
         * Get playlist and return the playlist with id.
         */
        getPlaylists().then(values => 
            chrome.runtime.sendMessage('alaidjagmphdjliibkabmpcdflmagglj', { action: 'get_playlists_result', params: {values} }));
    } else if (msg.action === 'add_musics_playlist') {
        /**
         * Add the musics to playlist and return the request status.
         */
        const {musicIds, playlistId} = msg.params;

        let targetIds = [...musicIds];
        getPlaylist(playlistId)
            .then(({ content }) => {
                const existIds = content.map(({ id }) => id);
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

