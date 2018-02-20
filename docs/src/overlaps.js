import { scaleSqrt } from "d3-scale"
export default function({
  category1,
  category2,
  view = "category1",
  selected,
  mainWidth = 50
  // or you can give it a width constraint and
  // a height constraint
}) {
  let selectedCategory, otherCategory, thisCategory

  if (view === "category1") {
    selectedCategory = category1[selected]
    otherCategory = category2
    thisCategory = category1
  } else {
    selectedCategory = category2[selected]
    otherCategory = category1
    thisCategory = category2
  }

  const scale = scaleSqrt()
    .domain([0, selectedCategory.total])
    .range([0, mainWidth])

  const areaPerValue = selectedCategory.total / (mainWidth * mainWidth)

  const getLastSide = (value, side) => value / areaPerValue / side
  console.log(areaPerValue)
  let selectedCategoryRects = [],
    otherCategoryRects = []

  // category2Rects = category1[selected].children.map(d => )

  //if there are more than 4 first fill the four corners

  //if there is only two split in half

  //also dependant on the type of graphic

  const selectedSize = scale(selectedCategory.total)

  const selectedRect = {
    width: selectedSize,
    height: selectedSize
  }

  let leftOffset = 0
  let topOffset = 0
  let remainingArea = 0

  if (selectedCategory.type === "parent-mixed") {
    //if parent, first fit in pure children as squares? or fit in largest overlap?

    if (selectedCategory.children.length === 2) {
      otherCategoryRects = selectedCategory.children
        .sort((a, b) => b.count - a.count)
        .map((d, i) => {
          const c2 = otherCategory[d.dim]
          const size = scale(c2.total)
          let x, y, width, height
          if (c2.type.indexOf("child") === -1) {
            selectedRect.x =
              size - selectedSize * (d.count / selectedCategory.total)
            selectedRect.y = size / 2 - selectedSize / 2
            leftOffset = size
            topOffset = size / 2 - selectedSize / 2
          }
          //TODO handle other if

          if (i === 0) {
            width = size
            height = size
          }

          if (i === 1) {
            x = leftOffset

            if (c2.type.indexOf("child") !== -1) {
              y = topOffset
              height = selectedSize
              width = selectedSize * (d.count / selectedCategory.total)
            }
            //TODO handle other if
          }

          return {
            width,
            height,
            x,
            y
          }
        })
    }
  } else if (selectedCategory.type === "child-mixed") {
    const parent = otherCategory[selectedCategory.children[0].dim]
    const siblings = parent.children.filter(d => d.dim !== selected)

    otherCategoryRects = [
      {
        height: selectedSize,
        width: selectedSize * parent.total / selectedCategory.total
      }
    ]

    leftOffset = selectedSize
    remainingArea = parent.total - selectedCategory.total

    if (siblings.length === 1) {
      selectedCategoryRects = [
        {
          height: selectedSize,
          width: getLastSide(thisCategory[siblings[0].dim].total, selectedSize),
          x: leftOffset
        }
      ]
    }

    // selectedCategoryRects = siblings.map((d, i) => {
    //   const size = scale(thisCategory[d.dim].total)
    //   if (i === 0) {

    //     return {
    //       width: size,
    //       height: size,
    //       x: leftOffset
    //     }
    //   }
    // })
  }

  return {
    selectedCategoryRects,
    otherCategoryRects,
    selectedRect
  }
}
