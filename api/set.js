import { kv } from "@vercel/kv"

export default async function handler(req, res) {

    /* SERVER */

    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

    /* SET KV */

    let data = await fetch('http://www.pollofpolls.no/api/gallup.php', { method: "post" })
    .then(r => {
        return r.text()
    })
    .then(d => {
        // Parse
        d = d.replace(/(?:\r\n|\r|\n)/g, ',').slice(0,-1)
        const json = JSON.parse(`[${d}]`)
        // Filter
        const newPolls = json.filter(p => p.dato.startsWith("2023-07") || p.dato.startsWith("2023-08"))
        const localPolls = newPolls.filter(p => p.type == "kommune" && p.kommuneid != "0")
        // Modify
        let pollReference = new Set()
        const sorted = localPolls.sort((a,b) => new Date(b.dato) - new Date(a.dato))
        const unique = sorted.map(p => {
            if (!pollReference.has(p.kommuneid)) {
                pollReference.add(p.kommuneid)
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
                    partier: {
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
                    },
                    andre: {
                        LIB: p.LIB,
                        IND: p.IND,
                        HP: p.HP,
                        DEM: p.DEM,
                        FNB: p.FNB,
                        KYST: p.KYST,
                        PP: p.PP,
                        DK: p.DK
                    }
                }
            }
            else return null
        })
        const cleaned = unique.filter(e => e != null)
        return cleaned
    })
    const now = new Date()
    const output = {
        time: now.toISOString(),
        data: data
    }
    console.log(output.length)
    let cmd = await kv.set("polls", output)
    console.log(cmd)
    res.send(cmd)
}