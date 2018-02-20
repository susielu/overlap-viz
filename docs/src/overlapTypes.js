export default function overlapTypes({ overlaps, category1Key, category2Key }) {
  const category1 = {},
    category2 = {}

  overlaps.forEach(d => {
    const count = d.count

    if (!category1[d[category1Key]]) {
      category1[d[category1Key]] = {
        total: count,
        children: [{ dim: d[category2Key], count }]
      }
    } else {
      category1[d[category1Key]].children.push({ dim: d[category2Key], count })
      category1[d[category1Key]].total += count
    }

    if (!category2[d[category2Key]]) {
      category2[d[category2Key]] = {
        total: count,
        children: [{ dim: d[category1Key], count }]
      }
    } else {
      category2[d[category2Key]].children.push({ dim: d[category1Key], count })
      category2[d[category2Key]].total += count
    }
  })

  Object.keys(category1).forEach(d => {
    if (category1[d].children.length === 1) {
      const child = category1[d].children[0].dim
      if (category2[child].children.length === 1) {
        category1[d].type = "parity"
        category2[child].type = "parity"
      } else {
        const hierarchy = !category2[child].children.find(c => {
          return category1[c.dim].children.length > 1
        })

        if (hierarchy) {
          category1[d].type = "child"
          category2[child].type = "parent"
        } else {
          category1[d].type = "child-mixed"
          category2[child].type = "parent-mixed"
        }
      }
    } else {
      const hierarchy = !category1[d].children.find(c => {
        return category2[c.dim].children.length > 1
      })

      if (hierarchy) {
        category1[d].type = "parent"
        category1[d].children.forEach(c => {
          category2[c.dim].type = "child"
        })
      } else {
        category1[d].children.forEach(c => {
          if (category2[c.dim].children.length === 1) {
            category2[c.dim].type = "child-mixed"

            category1[d].type = "parent-mixed"
          } else {
            if (category1[d].type !== "parent-mixed") {
              category1[d].type = "mixed"
            }
            if (!category2[c.dim] === "parent-mixed") {
              category2[c.dim].type = "mixed"
            }
          }
        })
      }
    }
  })

  const category1Totals = Object.keys(category1).map(d => {
    return { dim: d, total: category1[d].total }
  })
  const category2Totals = Object.keys(category2).map(d => {
    return { dim: d, total: category2[d].total }
  })

  return {
    category1,
    category2,
    category1Totals,
    category2Totals
  }
}

// export default overlapTypes
