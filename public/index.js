/**
 * 
 * State reducers for application.
 * 
 */

/**
 * Store musics in local storage.
 * @param {*} musics 
 */
function setMusics(musics) {
    chrome.storage.local.get('radio-playlist', old => {
        chrome.storage.local.set({'radio-playlist' : { ...old['radio-playlist'], musics }});
    });
}

/**
 * Store failed musics in local storage.
 * @param {*} musics 
 */
function setFail(musics) {
    chrome.storage.local.get('radio-playlist', old => {
        chrome.storage.local.set({'radio-playlist' : { ...old['radio-playlist'], fail: musics }});
    });
}


/**
 * Store success musics in local storage.
 * @param {*} musics 
 */
function setSuccess(musics) {
    chrome.storage.local.get('radio-playlist', old => {
        chrome.storage.local.set({'radio-playlist' : { ...old['radio-playlist'], success: musics }});
    });
}

/**
 * Store youtube playlist ID in local storage.
 * @param {string} playlistId 
 */
function setPlaylistId(playlistId) {
    chrome.storage.local.get('radio-playlist', old => {
        chrome.storage.local.set({'radio-playlist' : { ...old['radio-playlist'], playlistId }});
    });
}

/**
 * Get local storage data.
 * @param {function(): object} callback 
 * @returns 
 */
function getLocalData(callback) {
    return chrome.storage.local.get('radio-playlist', callback);
}

/**
 * 
 * Application Logics.
 * 
*/

/**
 * Replace children of element to music li elements.
 * @param {*} query query of target element
 * @param {*} musics 
 */
function replaceMusicListItems(query, musics) {
    const listItems = 
        musics.map(({ title, artist }) => {
            let element = document.createElement('li');
            element.setAttribute('class', 'list-group-item');
            element.innerText = `${artist} - ${title}`;
            return element;
        });

    document.querySelector(query).replaceChildren(...listItems)
};

/**
 * Parse music table to musics.
 */
async function parseAndSetMusics() {
    const tab = await getTab();

    chrome.tabs.sendMessage(tab.id, { action: 'get_musics' }, (musics) => {
        setMusics(musics)

        replaceMusicListItems('.music.result', musics);
    });
}

/**
 * Trigger to search the musics and add to the playlist.
 * @param {*} musics 
 */
async function musicsToPlaylist(musics) {
    const tab = await getTab();

    // request to search the musics on youtube.
    chrome.tabs.sendMessage(tab.id, { action: 'search_musics', params: { musics } });
}

/**
 * Button event listeners
 */
document.querySelector('.music.btn-parse').addEventListener('click', parseAndSetMusics)
getLocalData(({ 'radio-playlist': { musics }}) => {
    document.querySelector('.playlist.btn-add').addEventListener('click', () => musicsToPlaylist(musics))
}); 

/**
 * Input event listeners
 */
document.querySelector('#youtube_playlist_id').addEventListener('change', ({ target: { value }}) => {
    setPlaylistId(value);
});

/**
 * Initialize an application.
 */
getLocalData((obj) => {
    const { musics, success, fail, playlistId } = obj['radio-playlist'];

    // initialize list items
    replaceMusicListItems('.music.result', musics);
    replaceMusicListItems('.playlist.result-success', success);
    replaceMusicListItems('.playlist.result-fail', fail);

    // initialize playlist id
    document.querySelector('#youtube_playlist_id').setAttribute('value', playlistId);
})


/**
 * Get current tab from chrome
 * @returns tab
 */
async function getTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

/**
 * inject content scripts to the tab.
 */
getTab().then(({id}) => {
    chrome.scripting.executeScript({
        target: { 
            tabId: id,
        },
        files: ['app.bundle.js'] 
    });
});


/**
 * Chrome Message handlers.
 * - Dealing the results of searching or adding requests.
 */
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === 'search_result') {
        /**
         * handle youtube music search result. 
         * - try to add music ids to playlist.
         */
        const { values, musics } = msg.params;
        const results = values.map((result, index) => ({ ...result, target: musics[index] }))

        // if ytmusic has music info, add musics to the playlist.
        const success = results.filter(result => result.status === 'fulfilled' && result.value).map(({ target, value }) => ({...target, id: value}));
        setSuccess(success)
        console.log(`>> show success: ${JSON.stringify(success)}`);

        // if ytmusic does not have music info, add musics to failure list.
        const fail = results.filter(result => result.status === 'rejected' || !result.value).map(({ target }) => target);
        setFail(fail)
        console.log(`>> show failed: ${JSON.stringify(fail)}`)
        
        getLocalData(({ 'radio-playlist': { success, fail }}) => {
            replaceMusicListItems('.playlist.result-success', success);
            replaceMusicListItems('.playlist.result-fail', fail);
        })

        getTab().then(tab => {
            chrome.tabs.sendMessage(
                tab.id, 
                { action: 'add_musics_playlist', params: { musicIds: success.map(({ id }) => id), playlistId } },
            );
        })
    } else if (msg.action === 'get_playlists_result') {
        /**
         * handle playlists result.
         * - add playlist ID options to select form.
         */
        document.querySelector('#youtube_playlist_id').replaceChildren(
            ...msg.params.values.map(({ playlistId }) => {
                const element = document.createElement('option');
                element.setAttribute('value', playlistId);
                return element;
            })
        )
    } else if (msg.action === 'add_musics_playlist_result') {
        /**
         * handle after add musics to playlist.
         * - alert status to user.
         */
        alert(msg.params.status);
    }
});
