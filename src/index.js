const { YTMUSIC } = require('ytmusic')

const API = new YTMUSIC(document.cookie)

const musics = [
    { "title": "Welcome to The Internet", "artist": "Bo Burnham" },
    { "title": "lovememore.", "artist": "dosii" },
    { "title": "Typa Girl", "artist": "블랙핑크" },
    { "title": "사랑한다는 말", "artist": "김동률" }
]

// playlist 정보를 가져온다. 
// 노래를 검색한다. 
const searchPromises = musics.map(({title, artist}) => API.search(`${artist} ${title}`, { filter: 'songs' }).then((results) => results[0].id))

// 노래 정보가 있으면
    // 가져온 노래 정보를 playlist 에 추가한다. 
Promise.allSettled(searchPromises).then((results) => console.log(results) || API.addToPlaylist(results.map(({ value }) => value), 'PLma835fHaaztKoG97FEpgMh_qp-bSuHmr'))

// 노래 정보가 없으면 
    // 실패 목록에 추가한다. 
