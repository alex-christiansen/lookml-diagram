import { 
  TABLE_WIDTH, 
  TABLE_ROW_HEIGHT, 
  DIAGRAM_FIELD_STROKE_WIDTH,
  DIAGRAM_ICON_SCALE
 } from '../utils/constants'
import * as d3 from 'd3';
// import { drag } from './drag'
import { getLabel } from './styles';
import { SelectionInfoPacket } from "../components/interfaces"

export function isTableRowDimension(row: any) {
  if (row.category === "dimension") {
    //return (row.fieldTypeIndex % 2) === 0 ? false : true
    return true
  }
  return false
}

export function isTableRowMeasure(row: any) {
  if (row.category === "measure") {
    //return (row.fieldTypeIndex % 2) === 0 ? true : false
    return true
  }
  return false
}

export function isTableRowBaseView(row: any) {
  if (row.category === "view") {
    return row.base ? true : false
  }
  return false
}

export function isTableRowView(row: any) {
  if (row.category === "view") {
    return true
  }
  return false
}


export let getPkPath = (d: any) => {
  if (!d.primary_key) {
    return ""
  }
  return "M7 14a2 2 0 01-2-2 2 2 0 012-2 2 2 0 012 2 2 2 0 01-2 2m5.65-4A5.99 5.99 0 007 6a6 6 0 00-6 6 6 6 0 006 6 5.99 5.99 0 005.65-4H17v4h4v-4h2v-4H12.65z"
}

export let getPath = (d: any) => {
  if (!d.type) {
    return ""
  }
  if (d.type === "number") {
    return "M20 10V8h-4V4h-2v4h-4V4H8v4H4v2h4v4H4v2h4v4h2v-4h4v4h2v-4h4v-2h-4v-4h4zm-6 4h-4v-4h4v4z"
  } else if (d.type === "location") {
    return "M5 9c0-3.87 3.13-7 7-7s7 3.13 7 7c0 5.25-7 13-7 13S5 14.25 5 9zm7-5C9.24 4 7 6.24 7 9c0 2.85 2.92 7.21 5 9.88 2.12-2.69 5-7 5-9.88 0-2.76-2.24-5-5-5zm2.5 5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
  } else if (d.type === "string") {
    return "M10.612 4.248h2.75L19.324 20h-2.662l-1.452-4.048H8.786L7.334 20H4.672l5.94-15.752zm3.806 9.46l-1.76-4.818-.594-1.804h-.132l-.594 1.804-1.76 4.818h4.84z"
  } else if (d.type && d.type.indexOf("date") > -1) {
    return "M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"
  } else if (d.type === "duration") {
    return "M6.01 8L10 12l-4 4v6h12l-.01-5.99L18 16l-4-4 4-4V2H6l.01 6zm9.98 8.82L16 20H8v-3.17l3.41-3.41.59-.59.59.59 3.4 3.4zM16 4v3.17l-3.41 3.41-.59.59-.58-.58-3.41-3.42L8 4h8z"
  } else if (d.type === "tier") {
    return "M21 5H3v2h18V5zm0 4H7v2h14V9zm-10 4h10v2H11v-2zm10 4h-6v2h6v-2z"
  } else if (d.type === "yesno") {
    return "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
  }
  return "M20 10V8h-4V4h-2v4h-4V4H8v4H4v2h4v4H4v2h4v4h2v-4h4v4h2v-4h4v-2h-4v-4h4zm-6 4h-4v-4h4v4z"
}

export function isFirst(index: number, tableLength: number) {
  if (index === 0) {
    return true
  }
  return false
}


export function createLookmlViewElement(
  svg: d3.Selection<SVGElement, {}, HTMLElement, any>, 
  tableData: any[],
  selectionInfo: SelectionInfoPacket,
  setSelectionInfo: (packet: SelectionInfoPacket) => void,
  ) {
  
  let header = tableData[0]

  let table = svg
  .select(".diagram-area")
  .append("g")
  .attr("class", "table-"+header.view)

  table.append("rect")
  .attr("class", "table-background table-background-"+header.view)
  .attr("x", header.diagramX)
  .attr("y", header.diagramY)
  .attr("width", TABLE_WIDTH)
  .attr("height", (tableData.length*(TABLE_ROW_HEIGHT+(DIAGRAM_FIELD_STROKE_WIDTH-1)) - (tableData.length === 1 ? 5 : 7)))
  
  let tableRow = table.selectAll(".table-row-"+header.view)
  .data(tableData)
  .enter()
  .append("g")
  .attr("class", "table-row-"+header.view)
  .classed("table-row", true)
  .classed("table-row-dimension", (d: any) => isTableRowDimension(d))
  .classed("table-row-measure", (d: any) => isTableRowMeasure(d))
  .classed("table-row-view", (d: any) => isTableRowView(d))
  .classed("table-row-base-view", (d: any) => isTableRowBaseView(d))
  .attr("id", (d: any, i: number) => {
    return `${d.name && d.name.replace(".","-")}`
  })
  .attr("transform", (d: any, i: number) => {
    return `translate(${header.diagramX}, ${header.diagramY + (i*(TABLE_ROW_HEIGHT+(DIAGRAM_FIELD_STROKE_WIDTH-1)))})`
  });

  // Create table elements
  tableRow.append("rect")
  .attr("rx", (d: any, i: number) => {
    return isFirst(i, tableData.length) ? 3 : 0
  })
  .attr("ry", (d: any, i: number) => {
    return isFirst(i, tableData.length) ? 3 : 0
  })
  .attr("width", TABLE_WIDTH)
  .attr("height", (d: any, i: number) => {
    return isFirst(i, tableData.length) ? TABLE_ROW_HEIGHT+5 : TABLE_ROW_HEIGHT
  });

  // Add drag handler to each table
  // tableRow.call(drag);

  // Add datatype icon
  tableRow.append("path")
  .attr("d", getPath)
  .attr("transform", (d: any, i: number) => {
    return `translate(4,${(DIAGRAM_FIELD_STROKE_WIDTH / 2)})scale(${DIAGRAM_ICON_SCALE})`
  })
  .attr('class', 'row-icon')

  // Add PK icon if needed
  tableRow.append("path")
  .attr("d", getPkPath)
  .attr("class", "pk-icon")
  .attr("transform", (d: any, i: number) => {
    return `translate(${TABLE_WIDTH - (DIAGRAM_FIELD_STROKE_WIDTH * 3)}, ${DIAGRAM_FIELD_STROKE_WIDTH / 2})scale(${DIAGRAM_ICON_SCALE})`
  })

  // Label table elements
  tableRow.append("text")
  .attr("transform", (d: any, i: number) => {
    return `translate(${isFirst(i, tableData.length) ? 5 : 28}, ${(DIAGRAM_FIELD_STROKE_WIDTH / 2)})`
  })
  .attr("dy", "0.8em")
  .text((d: any) => getLabel(d));

  tableRow.append('line')
  .attr('x1', 0)
  .attr('y1', TABLE_ROW_HEIGHT + 3)
  .attr('x2', TABLE_WIDTH)
  .attr('y2', TABLE_ROW_HEIGHT + 3)
  .attr('class', 'row-divider')



  // Add click event
  tableRow.on("click", (d: any, i: number) => {
    let arr: any = d3.select(d.toElement).datum()
    console.log(arr)
    setSelectionInfo({
      lookmlElement: arr.category,
      name: arr.name
    })
  });
}
