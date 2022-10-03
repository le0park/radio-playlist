export function parsePlaylist(table) {
    return Array.from(table.children).map(rowElement => {
        return {
            title: rowElement.querySelector('p.title').innerText,
            artist: rowElement.querySelector('p.singer').innerText,
        }
    })
}
