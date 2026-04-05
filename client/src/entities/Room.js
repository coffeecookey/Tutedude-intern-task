import * as PIXI from 'pixi.js';
import theme from '../theme';

class Room {
  constructor({ id, name, x, y, width, height }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.container = new PIXI.Container();
    // We create a PIXI Graphics object to represent the room's rectangle 
    // and a PIXI Text object for the room's label, then add them to the container.
    const rect = new PIXI.Graphics();
    rect.beginFill(theme.roomFill, 0.6);
    rect.lineStyle(theme.roomStrokeWidth, theme.roomStroke, 1);
    rect.drawRect(0, 0, width, height);
    rect.endFill();

    const label = new PIXI.Text(name, {
      fontSize: theme.roomLabelFontSize,
      fill: theme.roomLabelColor,
      fontFamily: theme.labelFont,
    });
    label.x = 10;
    label.y = 10;

    this.container.addChild(rect, label);
    this.container.x = x;
    this.container.y = y;
  }

  // The contains method checks if a given point (px, py) is within the bounds of the room's rectangle
  contains(px, py) {
    return px >= this.x && px <= this.x + this.width && py >= this.y && py <= this.y + this.height;
  }
  // removes the room's container from the PIXI stage and destroys it to free up resources.
  destroy(stage) {
    stage.removeChild(this.container);
    this.container.destroy({ children: true });
  }
}

export default Room;
