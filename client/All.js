
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

class Level {
  constructor (plan) {
    let rows = plan.trim().split('\n').map(l => [...l]); //takes in a string seperated by newline characters. it is split line by line and added to an array.
    this.height = rows.length; // each line in rows adds to the height
    this.width = rows[0].length; //length of each line should be uniform, and represent the width of each level
    this.startActors = [];

    this.rows = rows.map((row, y) => {
      return row.map((ch, x) => {
        let type = levelChars[ch];
        if ( type === "Lava" ) {

          this.startActors.push(Lava.create(new Vec(x, y), ch));
        }
        if ( type === "Coin" ) {

          this.startActors.push(Coin.create(new Vec(x, y), ch));
        }
        if ( type === "Player" ) {

          this.startActors.push(Player.create(new Vec(x, y), ch));
        }
        if (typeof type == 'string') return type;

        return "empty"
      });
    });
  }
};

class Player {
  constructor (pos, speed) {
    this.pos = pos;
    this.speed = speed;
  }
  get type() { return "player"};
  static create(pos) {
    return new Player(pos.plus(new Vec(0, -0.5)), new Vec(0, 0))
  }
}
  Player.prototype.size = new Vec(0.8, 1.5)

  class State {
    constructor(level, actors, status) {
      this.level = level;
      this.actors = actors;
      this.status = status;
    }
    static start(level) {
      return new State(level, level.startActors, "playing")
    }
    get player() {
      return this.actors.find(a => a.type === "player")
    }
  }

class Lava {
  constructor(pos, speed, reset) {
    this.pos = pos;
    this.speed = speed;
    this.reset = reset;
  }
  get type () {return "lava"};
  static create(pos, ch) {
    if (ch === "=") {
      return new Lava(pos, new Vec(2, 0));
    } else if (ch === "|") {
      return new Lava(pos, new Vec(0, 2));
    }
    else if (ch === "v") {
      return new Lava(pos, new Vec(0, 3));
    }
  }
}
Lava.prototype.size = new Vec(1,1);

class Coin {
  constructor(pos, basePos, wobble) {
    this.pos = pos;
    this.basePos = basePos;
    this.wobble = wobble;
  }
  get type() {return "coin";}
  static create(pos) {
    let basePos = pos.plus(new  Vec(0.2, 0.1));
    return new Coin(basePos,basePos, Math.random() * Math.PI * 2);
  }
}
Coin.prototype.size = new Vec(0.6, 0.6)

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

class DOMdisplay {
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

//25 width

const simpleLevelPlan = `
.........................
..##................#....
..#.........o..o....#....
..#.......######....#....
..#.@...............#....
..#######===========#....
........############.....
.........................
.........................`