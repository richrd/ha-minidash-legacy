import React, { Component } from 'react';
import { getEntityIcon } from './utils';

class Tile extends Component {
  constructor(props) {
    super(props);

    this.valueEntities = ['sensor'];
  }

  renderContent() {
    const entityType = this.props.entity.entity_id.split('.')[0];
    if (!this.valueEntities.includes(entityType)) {
      return null;
    }
    return (
      <div className="tile-content">
        <div className="tile-state">
          <div className="tile-value">{this.props.entity.state}</div>
          <div className="tile-unit">{this.props.entity.attributes.unit_of_measurement}</div>
        </div>
      </div>
    );
  }

  renderIcon() {
    const entityType = this.props.entity.entity_id.split('.')[0];
    const icon = getEntityIcon(this.props.entity);
    if (this.valueEntities.includes(entityType)) {
      return null;
    }
    return (
      <div className="tile-icon"><i className={"mdi mdi-" + icon}></i></div>
    );
  }

  render() {
    if (!this.props.entity) {
      return null;
    }

    const entityType = this.props.entity.entity_id.split('.')[0];

    return (
      <div
          className={"tile " + entityType}
          onClick={() => this.props.onClick(this.props.entity)}
          data-state={this.props.entity.state}
      >
        <div className="tile-label">{this.props.entity.attributes.friendly_name}</div>
        {this.renderContent()}
        {this.renderIcon()}
      </div>
    );
  }
}

export default Tile;
