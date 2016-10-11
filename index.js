import d3 from 'd3';
import Ship from './Ship';
import World from './World';
import Input from './Input';

import './style.css';

window.userShip = new Ship();
window.world = new World();
window.inputManager = new Input();

window.setInterval(() => {
  // We can update the world a slower 10 fps
  window.world.render();
}, 100);

window.setInterval(() => {
  // Draw the ship and update the viewBox at 60 fps
  window.userShip.render();

  d3.select('#canvas')
    .attr('viewBox',
      window.world.viewBox.x + ' ' + window.world.viewBox.y + ' ' +
      window.world.viewBox.width + ' ' + window.world.viewBox.height);

  // Inspect inputs at 60 fps
  if (window.inputManager.pressedKeys.has(37)) {
    window.userShip.turnLeft();
  }
  if (window.inputManager.pressedKeys.has(39)) {
    window.userShip.turnRight();
  }
  if (window.inputManager.pressedKeys.has(38)) {
    window.userShip.accelerate();
  }
  if (window.inputManager.pressedKeys.has(40)) {
    window.userShip.brake();
  }

  window.userShip.move();
}, 16);
