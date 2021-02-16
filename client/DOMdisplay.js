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
    console.log('state', state)
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
    console.log('state', state)
    if (this.actorLayer) this.actorLayer.remove();
    this.actorLayer = drawActors(state.actors);
    this.dom.appendChild(this.actorLayer);
    this.dom.className = `game ${state.status}`;
    this.scrollPlayerIntoView(state);
  }
}