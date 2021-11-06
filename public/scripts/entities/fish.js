class Fish extends Denizen {
  constructor(options) {
    super(options);
    this.maxSwimSpeed = 100;
    this.makeNewVelocity();
    this.isTasty = true;

    // let size = [30, 60, 90, 120, 150, 180, 210];
    // let larrySize = Math.floor(Math.random() * 7);
    // this.height = size[larrySize];
    // this.width = size[larrySize];
    this.height = 30;
    this.width = 30;

    let img = Math.floor(Math.random() * 2) === 0 ? '/images/larry.png' : '/images/larry1.png';
    this.imageUri = img;
  }

  generateSwimVelocity(max, min) {
    if (min && min > max) {
      min = 0;
    }
    var newSpeed = new Vector(randRangeInt(-max, max), randRangeInt(-max / 2, max / 2));
    while (min && newSpeed.magnitude() < min) {
      newSpeed = new Vector(randRangeInt(-max, max), randRangeInt(-max / 2, max / 2));
    }
    return newSpeed;
  }

  updateOneTick() {
    var delta = this.swimVelocity.scale(PHYSICS_TICK_SIZE_S);
    this.position.addMut(delta);
    this.timeUntilSpeedChange -= PHYSICS_TICK_SIZE_S;
    if (this.timeUntilSpeedChange < 0) {
      this.makeNewVelocity();
    }
    this.detectCollision();
  }

  makeNewVelocity(minMag) {
    this.swimVelocity = this.generateSwimVelocity(this.maxSwimSpeed, minMag || 0);
    this.timeUntilSpeedChange = randRangeInt(5);
  }

  detectCollision() {
    const denizens = this.tank.denizens;
    for (const key in denizens) {
      const x = denizens[key].position.x;
      const y = denizens[key].position.y;
      const w = denizens[key].width;
      const h = denizens[key].height;
      if (!(denizens[key] instanceof Starter) &&
        !(denizens[key] instanceof Seed) &&
        this.id !== key &&
        this.position.x < x + w &&
        this.position.x + this.width > x &&
        this.position.y < y + h &&
        this.height + this.position.y > y) {
        if (this.height > h) {
          denizens[key].kill(1);
          this.height += 10;
          this.width += 10;
        }
        if (this.height === h) {
          let rng = Math.floor(Math.random() * 2);
          if (rng === 1) {
            this.kill(1);
            denizens[key].height += 10;
            denizens[key].width += 10;
          }
          if (rng === 0) {
            denizens[key].kill(1);
            this.height += 10;
            this.width += 10;
          }
        }
      }
    }
  }
}
