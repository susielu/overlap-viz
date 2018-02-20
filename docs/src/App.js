import React, { Component } from "react"

import Overlaps from "./overlaps"
import OverlapTypes from "./overlapTypes"

const data = [
  {
    dim1: "Red",
    dim2: "Dog",
    count: 120
  },
  {
    dim1: "Brown",
    dim2: "Dog",
    count: 200
  },
  {
    dim1: "Red",
    dim2: "Cat",
    count: 30
  }
]

class App extends Component {
  render() {
    const overlapTypes = OverlapTypes({
      overlaps: data,
      category1Key: "dim1",
      category2Key: "dim2"
    })

    console.log(overlapTypes)

    let { selectedRect, otherCategoryRects, selectedCategoryRects } = Overlaps({
      ...overlapTypes,
      selected: "Brown",
      mainWidth: 100
    })

    otherCategoryRects = otherCategoryRects.map(d => {
      return <rect {...d} />
    })

    selectedCategoryRects = selectedCategoryRects.map(d => {
      return <rect {...d} className="selected" />
    })

    selectedRect = <rect className="selected" {...selectedRect} />

    return (
      <div>
        <svg width={500} height={500}>
          {selectedRect}
          {selectedCategoryRects}
          {otherCategoryRects}
        </svg>
      </div>
    )
  }
}

export default App
