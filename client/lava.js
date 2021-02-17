class Lava {
  constructor(pos, speed, reset) {
    this.pos = pos;
    this.speed = speed;
    this.reset = reset;

    this.collide = this.collide.bind(this);
    this.update = this.update.bind(this);
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

  collide(state) {
    return new State (state.level, state.actors,"lost")
  }

  update(time, state) {
    let newPos = this.pos.plus(this.speed.times(time));
    if(!state.level.touches(newPos, this.size, "wall")) {
      return new Lava(newPos, this.speed, this.reset);
    } else if (this.reset) {
      return new Lava(this.reset, this.speed, this.reset)
    } else {
      return new Lava(this.pos, this.speed.times(-1));
    }
  };
}

Lava.prototype.size = new Vec(0.6, 0.6)
