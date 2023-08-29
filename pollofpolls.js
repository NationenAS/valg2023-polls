const fs = require("fs")

fetch('http://www.pollofpolls.no/api/gallup.php', { method: "post" })
  .then(response => response.text())
  .then(data => {
    data = data.replace(/(?:\r\n|\r|\n)/g, ',').slice(0,-1)
    const json = JSON.parse(`[${data}]`)
    const newPolls = json.filter(p => p.dato.startsWith("2023-07") || p.dato.startsWith("2023-08"))
    const localPolls = newPolls.filter(p => p.type == "kommune" && p.kommuneid != "0")
    fs.writeFileSync('./polls.json', localPolls)
  })