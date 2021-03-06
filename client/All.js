
const levelChars = {
  "." : "empty",
  "#" : "wall",
  "+" : "Lava",
  "=" : "Lava",
  "|" : "Lava",
  "v" : "Lava",
  "@" : "Player",
  "o" : "Coin"
}
//for the wobble animation
const wobbleSpeed = 8;
const wobbleDist = 0.07;
//for player movement
const playerXSpeed = 7;
const gravity = 30;
const jumpSpeed = 17;

const trackKeys = (keys) => {
  let down = Object.create(null);
  //update the "down" tracker if the current key is pressed
  const track = (event) => {
    if (keys.includes(event.key)) {
      //creates a '"keydown" property for each key, set as true or false to track if currently pressed
      down[event.key] = event.type === "keydown";
      event.preventDefault();
    }
  }
  window.addEventListener("keydown", track);
  window.addEventListener("keyup", track);
  return down;
}

const arrowKeys = trackKeys(["ArrowLeft", "ArrowRight", "ArrowUp"])

class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  plus(other) {
    return new Vec(this.x + other.x, this.y + other.y);
  }
  times(factor) {
    return new Vec(this.x * factor, this.y * factor);
  }
};

const overlap = (actor1, actor2) => {
  return actor1.pos.x + actor1.size.x > actor2.pos.x &&
         actor1.pos.x < actor2.pos.x + actor2.size.cc &&
         actor1.pos.y + actor1.size.y > actor2.pos.y &&
         actor1.pos.y < actor2.pos.y + actor2.size.y;zx
}

const elt = (name, attrs, ...children) => {
  let dom = document.createElement(name);
  for (let attr of Object.keys(attrs)) {
    dom.setAttribute(attr, attrs[attr]);
  }
  for (let child of children) {
    dom.appendChild(child);
  }
  return dom
}

class DOMDisplay {
  constructor (parent, level) {
    this.dom = elt("div", {class: "game"},  drawGrid(level));
    this.actorLayer = null;
    parent.appendChild(this.dom);
    this.syncState = this.syncState.bind(this);
    this.scrollPlayerIntoView = this.scrollPlayerIntoView.bind(this);
  }
  clear() {this.dom.remove()};

  scrollPlayerIntoView(state) {

    let width = this.dom.clientWidth;
  let height = this.dom.clientHeight;
  let margin = width / 3;
  //view port
  let left = this.dom.scrollLeft;
  let right = left + width;
  let top = this.dom.scrollTop;
  let bottom = top + height;

  let player = state.player;
  let center = player.pos.plus(player.size.times(0.5))

  if (center.x < left + margin) {
    this.dom.scrollLeft = center.x - margin;
  } else if (center.x > right - margin) {
    this.dom.scrollLeft = center.x + margin - width;
  }
  if (center.y < top + margin) {
    this.dom.scrollTop = center.y - margin;
  } else if ( center.x > right - margin) {
    this.dom.scrollLeft = center.x + margin - width
  }
  if (center.y < top + margin) {
    this.dom.scrollTop= center.y - margin;
  } else if (center.y > bottom - margin) {
    this.dom.scrollTop= center.y + margin - height;
  }
  }

  syncState(state) {
    if (this.actorLayer) this.actorLayer.remove();
    this.actorLayer = drawActors(state.actors);
    this.dom.appendChild(this.actorLayer);
    this.dom.className = `game ${state.status}`;
    this.scrollPlayerIntoView(state);
  }
}

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

const drawActors = (actors) => {
  return elt("div", {}, ...actors.map(actor => {
    let rect = elt("div", {class: `actor ${actor.type}`});
    rect.style.width = `${actor.size.x * scale}px`;
    rect.style.height = `${actor.size.y * scale}px`;
    rect.style.left = `${actor.pos.x * scale}px`;
    rect.style.top = `${actor.pos.y * scale}px`;
    return rect;
  }));
};

