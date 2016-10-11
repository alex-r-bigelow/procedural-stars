import d3 from 'd3';

class Input {
  constructor () {
    this.pressedKeys = new Set();
    d3.select('body').on('keydown', () => {
      this.pressedKeys.add(d3.event.keyCode);
    }).on('keyup', () => {
      this.pressedKeys.delete(d3.event.keyCode);
    });
  }
}

export default Input;
