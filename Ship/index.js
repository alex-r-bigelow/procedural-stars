import d3 from 'd3';

class Ship {
  constructor () {
    this.direction = 0;

    this.velocityX = 0;
    this.velocityY = 0;

    this.radius = 32;

    this.turnRate = Math.PI / 32;
    this.accelerationRate = 0.5;
    this.brakeRate = 0.95;
    this.maxVelocity = 20;

    this.x = 0;
    this.y = 0;

    this.id = 'userShip';
  }
  render () {
    let d3el;
    if (!this.addedElement) {
      d3el = d3.select('#canvas').append('g')
        .attr('id', this.id);
      d3el.append('path');
      this.addedElement = true;
    }
    d3el = d3.select('#canvas')
      .select('g#' + this.id);
    let frontX = this.radius * Math.cos(this.direction);
    let frontY = this.radius * Math.sin(this.direction);
    let starboardDir = this.direction + 3 * Math.PI / 4;
    let starboardX = this.radius * Math.cos(starboardDir);
    let starboardY = this.radius * Math.sin(starboardDir);
    let portDir = this.direction - 3 * Math.PI / 4;
    let portX = this.radius * Math.cos(portDir);
    let portY = this.radius * Math.sin(portDir);
    d3el.select('path')
      .attr('d',
        'M' + frontX + ',' + frontY +
        'L' + starboardX + ',' + starboardY +
        'L' + portX + ',' + portY +
        'Z')
      .attr('transform', 'translate(' + this.x + ',' + this.y + ')');
  }
  move () {
    this.x += this.velocityX;
    this.y += this.velocityY;
  }
  turnLeft () {
    this.direction -= this.turnRate;
  }
  turnRight () {
    this.direction += this.turnRate;
  }
  accelerate () {
    this.velocityX += this.accelerationRate * Math.cos(this.direction);
    this.velocityY += this.accelerationRate * Math.sin(this.direction);

    this.capVelocity();
  }
  brake () {
    this.velocityX *= this.brakeRate;
    this.velocityY *= this.brakeRate;

    this.capVelocity();
  }
  capVelocity () {
    // Cap the velocity
    let velocity = Math.sqrt(this.velocityX * this.velocityX +
        this.velocityY * this.velocityY);
    velocity = Math.min(velocity, this.maxVelocity);
    if (velocity <= 0.25) {
      velocity = 0;
    }
    let vAngle = Math.atan2(this.velocityY, this.velocityX);

    this.velocityX = velocity * Math.cos(vAngle);
    this.velocityY = velocity * Math.sin(vAngle);
  }
}

export default Ship;
