const scale = 20;

function drawGrid(level) {
  return elt("table", {
    class: "background",
    style: `width: ${level.width * scale}px`,
  },
  ...level.rows.map(row =>
      elt("tr", {style: `height: ${scale}px`},
      ...row.map(type => elt("td", {class: type})))
  ))
}