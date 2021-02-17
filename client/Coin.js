class Coin {
  constructor(pos, basePos, wobble) {
    this.pos = pos;
    this.basePos = basePos;
    this.wobble = wobble;

    this.collide = this.collide.bind(this);
    this.update = this.update.bind(this);
  }
  get type() {return "Coin";}

  static create(pos) {
    let basePos = pos.plus(new  Vec(0.2, 0.1));
    return new Coin(basePos,basePos, Math.random() * Math.PI * 2);
  }

  collide(state) {
    let filtered = state.actors.filter(a => a != this);
    let status = state.status;
    if (!filtered.some(a => a.type === "Coin")) status = "won";
    return new State(state.level, filtered, status)
  }

  update(time) {
    let wobble = this.bobble + time * wobbleSpeed;
    let wobblePos = Math.Sin(wobble) * wobbleDist;
    return new Coin(this.basePos.plus(new Vec(0, wobblePos)), this.basePos, wobble);
  }
}
Coin.prototype.size = new Vec(0.6, 0.6)