const fs = require("fs")
const polls = require("./polls.json")
const municipalities = require("./municipalities.json")
const newPolls = polls.filter(p => p.dato.startsWith("2023-07") || p.dato.startsWith("2023-08") || p.dato.startsWith("2023-06"))
const localPolls = newPolls.filter(p => p.type == "kommune" && p.kommuneid != "0")
fs.writeFileSync('./polls.json', JSON.stringify(localPolls))
console.log("Antall galluper:", localPolls.length)
for (const poll of localPolls) {
    let mandats = {
        "Ap": poll.ApM, 
        "SV": poll.SVM, 
        "Sp": poll.SpM, 
        "R": poll.RM, 
        "MDG": poll.MDGM, 
        "V": poll.VM, 
        "Frp": poll.FrpM, 
        "H": poll.HM, 
        "KrF": poll.KrFM,  
        "A": poll.AM
    }
    let values = Object.values(mandats)
    let total = values.reduce((a,b) => a + Number(b), 0)
    console.log(`${poll.dato} ${municipalities.find(e => e[0] == Number(poll.kommuneid))[1]} (${poll.kommuneid}) Sp: ${poll.Sp}% (${poll.SpM} av ${total} mandater). (Gallupid: ${poll.gallupid}, url: ${poll.url})`)
}