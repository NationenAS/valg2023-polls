export default async function handler(req, res) {

    /* SERVER */

    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')
    
    // Enable cache
    res.setHeader('Cache-Control', 's-maxage=43200') // 12 hours

    fetch('http://www.pollofpolls.no/api/gallup.php', { method: "post" })
    .then(response => {
        return response.text()
    })
    .then(data => {
        // Parse
        data = data.replace(/(?:\r\n|\r|\n)/g, ',').slice(0,-1)
        const json = JSON.parse(`[${data}]`)
        // Filter
        const newPolls = json.filter(p => p.dato.startsWith("2023-07") || p.dato.startsWith("2023-08"))
        const localPolls = newPolls.filter(p => p.type == "kommune" && p.kommuneid != "0")
        // Modify
        const cleaned = localPolls.map(p => {
            return {
                id: p.gallupid,
                kommuneid: p.kommuneid,
                dato: p.dato,
                url: p.url,
                kilde: p.kilde_lang,
                institutt: p.institutt_lang,
                spurte: p.spurte,
                periodeStart: p.periode_start,
                periodeSlutt: p.periode_slutt,
                Ap: p.Ap,
                SV: p.SV,
                Sp: p.Sp,
                R: p.R,
                MDG: p.MDG,
                V: p.V,
                KrF: p.KrF,
                H: p.H,
                Frp: p.Frp,
                A: p.A,
                LIB: p.LIB,
                IND: p.IND,
                HP: p.HP,
                DEM: p.DEM,
                FNB: p.FNB,
                KYST: p.KYST,
                PP: p.PP,
                DK: p.DK
            }
        })
        console.log(localPolls.length)
        console.log(cleaned.length)
        res.send(cleaned)
    })
}