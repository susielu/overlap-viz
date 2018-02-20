const csv = require("csvtojson")
const jsonfile = require("jsonfile")

const overlaps = {}
const category1Totals = {}
const category2Totals = {}
csv()
  .fromFile("./vgsales.csv")
  .on("json", jsonObj => {
    const category1 = jsonObj.Platform
    const category2 = jsonObj.Genre

    const key = category1 + "-" + category2
    if (!overlaps[key]) {
      overlaps[key] = {
        category1,
        category2,
        count: 1
      }
    } else {
      overlaps[key].count++
    }

    if (!category1Totals[category1]) {
      category1Totals[category1] = 1
    } else {
      category1Totals[category1]++
    }
    if (!category2Totals[category2]) {
      category2Totals[category2] = 1
    } else {
      category2Totals[category2]++
    }
  })
  .on("done", error => {
    jsonfile.writeFile("platform-genre.json", {
      overlaps,
      category1Totals,
      category2Totals
    })
  })
