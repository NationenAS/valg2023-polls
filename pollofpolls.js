const fs = require("fs")

fetch('http://www.pollofpolls.no/api/gallup.php', { method: "post" })
  .then(response => response.text())
  .then(data => {
    data = data.replace(/(?:\r\n|\r|\n)/g, ',').slice(0,-1)
    output = `[${data}]`
    fs.writeFileSync('./polls.json', output)
  })