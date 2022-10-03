import { parsePlaylist } from "./parse";
import { search, addToPlaylist, getPlaylist} from "./ytmusic";

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.action === 'get_musics') {
        const table = document.querySelector('#songlist_frame').contentDocument.querySelector('#musicView > table > tbody')
        sendResponse(parsePlaylist(table));
    } else if (msg.action === 'search_musics') {
        const {musics} = msg.params;
        search(musics).then(values => 
            chrome.runtime.sendMessage('alaidjagmphdjliibkabmpcdflmagglj', { action: 'search_result', params: {values, musics} }));
    } else if (msg.action === 'add_musics_playlist') {
        const {musicIds, playlistId} = msg.params;

        let targetIds = [...musicIds];
        getPlaylist(playlistId)
            .then(({ content }) => {
                const existIds = content.map(({ id }) => id);
                alert(JSON.stringify(existIds));
                targetIds = targetIds.filter(id => !(id in existIds))
                addToPlaylist(targetIds, playlistId).then(({status}) => alert(status));
            })
    }
});

