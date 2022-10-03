/**
 * Parse music table element.
 * @param {*} table 
 * @returns musics
 */
export function parseMusicTable(table) {
    return Array.from(table.children)
        .filter(element => element.querySelector('td').classList.length === 0)
        .map(element => {
            return {
                title: element.querySelector('p.title').innerText,
                artist: element.querySelector('p.singer').innerText,
            }
        })
}
