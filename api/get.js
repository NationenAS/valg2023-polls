export default async function handler(req, res) {

    /* SERVER */

    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')
    
    // Enable cache
    // res.setHeader('Cache-Control', 's-maxage=43200') // 12 hours

    fetch('http://www.pollofpolls.no/api/gallup.php', { method: "post" })
    .then(response => {
        console.log(response.message)
        console.log(response.errors)
        console.log(response.status)
        return response.text()
    })
    .then(data => {
        res.send(data.substring(0,100))
        /* data = data.replace(/(?:\r\n|\r|\n)/g, ',').slice(0,-1)
        let output = `[${data}]`
        res.send(output) */
    })


}