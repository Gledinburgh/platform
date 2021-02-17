class State {
  constructor(level, actors, status) {
    this.level = level;
    this.actors = actors;
    this.status = status;

    this.update = this.update.bind(this);
  }
  static start(level) {
    return new State(level, level.startActors, "playing")
  }
  get player() {
    return this.actors.find(a => a.type === "player")
  }

  update(time, keys) {
    let actors = this.actors.map(actor => actor.update(time, this, keys));
    let newState = new State(this.level, actors, this.status);

    if(newState.status !== "playing") return newState;

    let player = newStatus.player;
    if (this.level.touches(player.pos, player.size, "Lava")) {
      return new State(this.level, actors, "lost")
    }

    for (var i = 0; i < actors.length; i++) {
      let actor = actors[i];
      if (actor != player && overlap(actor, player)) {
        newState = actor.collide(newState)
      }
    }
  return newstate;
  };
}


