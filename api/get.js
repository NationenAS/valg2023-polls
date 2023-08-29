import { kv } from "@vercel/kv"

export default async function handler(req, res) {

    /* SERVER */

    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

    // Enable cache
    res.setHeader('Cache-Control', 's-maxage=3600') // 1 hour

    /* GET KV */
    let cmd = await kv.get("polls")
    res.send(cmd)
}