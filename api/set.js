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
                    id: Number(p.gallupid),
                    kommuneid: Number(p.kommuneid),
                    dato: p.dato,
                    url: p.url,
                    kilde: p.kilde_lang,
                    institutt: p.institutt_lang,
                    spurte: Number(p.spurte),
                    periodeStart: p.periode_start,
                    periodeSlutt: p.periode_slutt,
                    partier: {
                        Ap: Number(p.Ap),
                        SV: Number(p.SV),
                        Sp: Number(p.Sp),
                        R: Number(p.R),
                        MDG: Number(p.MDG),
                        V: Number(p.V),
                        KrF: Number(p.KrF),
                        H: Number(p.H),
                        Frp: Number(p.Frp),
                        A: Number(p.A),
                    },
                    andre: {
                        LIB: Number(p.LIB),
                        IND: Number(p.IND),
                        HP: Number(p.HP),
                        DEM: Number(p.DEM),
                        FNB: Number(p.FNB),
                        KYST: Number(p.KYST),
                        PP: Number(p.PP),
                        DK: Number(p.DK)
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