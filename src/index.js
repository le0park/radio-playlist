const { YTMUSIC } = require('ytmusic')

const API = new YTMUSIC(document.cookie)

const playlistId = 'PLma835fHaaztKoG97FEpgMh_qp-bSuHmr';

const musics = [
    { "title": "Welcome to The Internet", "artist": "Bo Burnham" },
    { "title": "lovememore.", "artist": "dosii" },
    { "title": "Typa Girl", "artist": "블랙핑크" },
    { "title": "사랑한다는 말", "artist": "김동률" }
]

// playlist 정보를 가져온다. 
// 노래를 검색한다. 

console.log(`>> search musics`)
const searchPromises = musics.map(
    ({title, artist}) => 
        API.search(`${artist} ${title}`, { filter: 'songs' })
            .then((results) => results.length > 0 ? results[0].id : null)
)

const failedResults = 
Promise.allSettled(searchPromises)
    .then((results) => {
        results = results.map((result, index) => ({ ...result, target: musics[index] }))

        // 노래 정보가 있으면
            // 가져온 노래 정보를 playlist 에 추가한다. 
        const fulfilled = results.filter(result => result.status === 'fulfilled' && result.value);

        console.log(`>> add playlists: ${JSON.stringify(fulfilled.map(result => result.value))}`)
        API.addToPlaylist(fulfilled.map(({ value }) => value), playlistId)

        const rejected = results.filter(result => result.status === 'rejected' || !result.value);
        
        // 노래 정보가 없으면 
            // 실패 목록에 추가한다. 
        console.log(`>> show failed: ${JSON.stringify(rejected.map(result => result.target))}`)
        console.log(JSON.stringify(rejected, null, 2));
    });



