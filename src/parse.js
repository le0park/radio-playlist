export function parsePlaylist() {
    const tableElement = document.querySelector('#musicView > table > tbody');
    return Array.from(tableElement.children).map(rowElement => {
        return {
            title: rowElement.querySelector('p.title').innerText,
            artist: rowElement.querySelector('p.singer').innerText,
        }
    })
}
