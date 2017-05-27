import React, { Component } from 'react';
import Tile from './Tile';

class Tiles extends Component {
  tileClicked(entity) {
    this.props.tileClicked(entity);
  }

  renderTile(entity, i) {
    return (
      <Tile
        key={i}
        entity={entity}
        onClick={(entity) => this.tileClicked(entity)}
        />
      )
  }

  render() {
    let tiles = this.props.entities.map((entity, i) => this.renderTile(entity, i));
    return (
      <div className="tiles">
        {tiles}
      </div>
    );
  }

}

export default Tiles;
