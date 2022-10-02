export function search(musics) {
    console.log(`>> search ${JSON.stringify(musics)}}`)

    return musics.map(
        ({title, artist}) => 
            API.search(`${artist} ${title}`, { filter: 'songs' })
                .then((results) => results.length > 0 ? results[0].id : null)
    )
}


// 가져온 노래 정보를 playlist 에 추가한다. 
export function addToPlaylist(musicIds) {
    console.log(`>> add playlists: ${JSON.stringify(musicIds)}`)
    return API.addToPlaylist(musicIds, playlistId)
}
