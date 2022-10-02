const { YTMUSIC } = require('ytmusic')
const API = new YTMUSIC('HSID=AsrD6Y5dw2VyKRq0a; SSID=A3yBYGOh0pcSrbAeg; APISID=bNHilIEas86onINw/AuvfShAW9SeGdoDHG; SAPISID=GdQQxdwLOVmJFKR7/AT-Wx0btVccJwloV9; __Secure-1PAPISID=GdQQxdwLOVmJFKR7/AT-Wx0btVccJwloV9; __Secure-3PAPISID=GdQQxdwLOVmJFKR7/AT-Wx0btVccJwloV9; VISITOR_INFO1_LIVE=Wc-9BytI_gU; LOGIN_INFO=AFmmF2swRQIgLXS9Xk9as55uvU3Tc_5TBfgKJMOaMNBIBwaB4XmjntECIQCvEqaOfppkuxdbHx2N8h8GGxvPU3WKn7yxg7S034CRSw:QUQ3MjNmeExSNkY5U1d5OUpJU1R5TGg4dGw0YWJQZDBpWnZhN0dIbnU3QUNLMTRpbl9mckZSYU56c3ZiNEVRd0hGandTWjV6OUxjcEhiaEw2VDkxRWQtTFdNWXVQd09KTG1uZ0Iwa0V6YUdZRi1RWF9IUTc0M3lOUDF2b1V1c2hIMHRITEozUlNBekd1Y0g0aDd0UzY4cjk1UUN0LTg0LS1R; _gcl_au=1.1.2125976294.1661400170; _ga_TDJ867GL5F=GS1.1.1661400170.1.0.1661400170.0.0.0; _ga=GA1.1.979974662.1661400170; _ga_VCGEPY40VB=GS1.1.1663576983.6.0.1663576983.0.0.0; SID=OwglOoFvwARViQFLUZ6vGq7XZWIVTNt7QsZiZYNjdZ-Kv-sZxcknivP-DNSPnGLaOvXpdA.; __Secure-1PSID=OwglOoFvwARViQFLUZ6vGq7XZWIVTNt7QsZiZYNjdZ-Kv-sZsiIIYkSW5xxTR6pyS7VbuQ.; __Secure-3PSID=OwglOoFvwARViQFLUZ6vGq7XZWIVTNt7QsZiZYNjdZ-Kv-sZuGKqRUbIQeK8a8J0sS5asg.; YSC=4O7QnpBBr6g; PREF=f6=80&f4=4000000&tz=Asia.Seoul&autoplay=true&library_tab_browse_id=FEmusic_liked_playlists; SIDCC=AEf-XMSoG3aTeYzYT4GEbkUf0mkToWUq2K7PjyMRSHi8gmRv0KjzbXxuYCQnfTyBGLJ3VGFpJMY; __Secure-1PSIDCC=AEf-XMT4Ha7NdB57CjChwSfhEMdnp1LKfJGX-gMMFaqLZMUEKLy9Yf5vsI4T5d3dfBFacagGfg; __Secure-3PSIDCC=AEf-XMS3D6upQ85b1xVYF6LT_MirsJUh8LbVacP7YbQ8uVVWC_w-kec7MhWug7bCwq_K_N5UIxE')

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


