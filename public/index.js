async function getTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

// 노래를 저장할 playlist ID
let playlistId = 'PLma835fHaaztKoG97FEpgMh_qp-bSuHmr';

function setMusics(musics) {
    chrome.storage.local.get('radio-playlist', old => {
        chrome.storage.local.set({'radio-playlist' : { ...old['radio-playlist'], musics }});
    });
}

function setFail(fail) {
    chrome.storage.local.get('radio-playlist', old => {
        chrome.storage.local.set({'radio-playlist' : { ...old['radio-playlist'], fail }});
    });
}

function setSuccess(success) {
    chrome.storage.local.get('radio-playlist', old => {
        chrome.storage.local.set({'radio-playlist' : { ...old['radio-playlist'], success }});
    });
}

function getLocalData(callback) {
    return chrome.storage.local.get('radio-playlist', callback);
}

async function parseAndSetMusics() {
    const tab = await getTab();

    chrome.tabs.sendMessage(tab.id, { action: 'get_musics' }, (musics) => {
        setMusics(musics)
        document.querySelector('.music.result').innerText = JSON.stringify(musics, null, 2);
    });
}

async function musicsToPlaylist(musics) {
    const tab = await getTab();

    // 노래를 검색한다. 
    chrome.tabs.sendMessage(tab.id, { action: 'search_musics', params: { musics } });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === 'search_result') {
        const { values, musics } = msg.params;
        const results = values.map((result, index) => ({ ...result, target: musics[index] }))

        // 노래 정보가 있으면 playlist 에 추가한다.
        const success = results.filter(result => result.status === 'fulfilled' && result.value);
        setSuccess(success)
        console.log(`>> show success: ${JSON.stringify(success.map(result => result.value))}`);

        // 노래 정보가 없으면 실패 목록에 추가한다. 
        const fail = results.filter(result => result.status === 'rejected' || !result.value);
        setFail(fail)
        console.log(`>> show failed: ${JSON.stringify(fail.map(result => result.target))}`)
        
        getLocalData(({ 'radio-playlist': { success, fail }}) => {
            document.querySelector('.playlist.result-success').innerText = JSON.stringify(success.map(({ target }) => target), null, 2);
            document.querySelector('.playlist.result-fail').innerText = JSON.stringify(fail, null, 2);
        })

        getTab().then(tab => {
            chrome.tabs.sendMessage(
                tab.id, 
                { action: 'add_musics_playlist', params: { musicIds: success.map(({ value }) => value), playlistId } },
            );
        })
    } else if (msg.action === 'add_playlist_result') {
        // TODO
    }
});

document.querySelector('.music.btn-parse').addEventListener('click', parseAndSetMusics)
getLocalData(({ 'radio-playlist': { musics }}) => {
    document.querySelector('.playlist.btn-add').addEventListener('click', () => musicsToPlaylist(musics))
}); 

getLocalData((obj) => {
    const { musics, success, fail } = obj['radio-playlist'];
    document.querySelector('.music.result').innerText = JSON.stringify(musics);
    document.querySelector('.playlist.result-success').innerText = JSON.stringify(success);
    document.querySelector('.playlist.result-fail').innerText = JSON.stringify(fail);
})

getTab().then(({id}) => {
    chrome.scripting.executeScript({
        target: { 
            tabId: id,
        },
        files: ['app.bundle.js'] 
    });
});
