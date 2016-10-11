import d3 from 'd3';
import noisejs from 'noisejs';

class World {
  constructor () {
    this.noiseGenerator = new noisejs.Noise(0.9329197);
    this.gridSize = 10;
    this.pointFieldScale = 200;
    this.maximaRadius = 2;
    this.starScale = d3.scale.linear()
      .domain([0, 1])
      .range([2, 10]);
  }
  render () {
    let d3el;
    d3el = d3.select('#canvas')
      .select('g#world');
    let stars = d3el.selectAll('circle')
      .data(this.getPointField());
    stars.enter().append('circle');
    stars.exit().remove();
    stars.attr({
      cx: d => d.x,
      cy: d => d.y,
      r: d => this.starScale(d.size)
    });
  }
  get viewBox () {
    return {
      x: window.userShip.x - window.innerWidth / 2,
      y: window.userShip.y - window.innerHeight / 2,
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
  get renderBox () {
    return {
      x: window.userShip.x - window.innerWidth,
      y: window.userShip.y - window.innerHeight,
      width: 2 * window.innerWidth,
      height: 2 * window.innerHeight
    };
  }
  sampleGrid (bounds, noiseScale) {
    // Make sure the grid always samples the same locations relative
    // to the world's origin
    bounds.x = Math.floor(bounds.x / this.gridSize) * this.gridSize;
    bounds.y = Math.floor(bounds.y / this.gridSize) * this.gridSize;
    let grid = [];
    for (let y = 0; y < bounds.height / this.gridSize; y += 1) {
      let ycoord = bounds.y + this.gridSize * y;
      grid.push([]);
      for (let x = 0; x < bounds.width / this.gridSize; x += 1) {
        let xcoord = bounds.x + this.gridSize * x;
        let sample = this.noiseGenerator.perlin2(xcoord / noiseScale, ycoord / noiseScale);
        grid[y].push(sample);
      }
    }
    return { grid, leftX: bounds.x, topY: bounds.y };
  }
  getPointField () {
    // Return the list of all maxima in the current renderBox
    // (TODO: there may be a more efficient / accurate way
    // to determine how far outside the viewBox we need to go),
    // deterministically generated via perlin noise. Because we're
    // looking so far outside the current viewBox, I don't *think*
    // we'll need to worry about border conditions.

    let samples = this.sampleGrid(this.renderBox, this.pointFieldScale);
    let maxima = [];
    for (let y = this.maximaRadius;
         y < samples.grid.length - this.maximaRadius;
         y += 1) {
      let row = samples.grid[y];
      for (let x = this.maximaRadius;
           x < row.length - this.maximaRadius;
           x += 1) {
        let isMax = true;
        let value = row[x];
        for (let dy = -this.maximaRadius;
             dy <= this.maximaRadius;
             dy += 1) {
          for (let dx = -this.maximaRadius;
              dx <= this.maximaRadius;
              dx += 1) {
            if (samples.grid[y + dy][x + dx] >= value &&
                !(dx === 0 && dy === 0)) {
              isMax = false;
              break;
            }
          }
          if (!isMax) {
            break;
          }
        }
        if (isMax) {
          maxima.push({
            x: samples.leftX + x * this.gridSize,
            y: samples.topY + y * this.gridSize,
            size: value
          });
        }
      }
    }

    return maxima;
  }
}

export default World;
