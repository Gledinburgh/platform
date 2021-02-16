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
        console.log('not all strings')
        return "empty"
      });
    });
  }
};