import React, { Component } from 'react';

class Tile extends Component {

  getIcon(entity) {
    let icon = "checkbox-blank";

    if (entity.attributes.icon) {
      icon = entity.attributes.icon.split(':')[1]
    } else if (entity.entity_id.startsWith('switch.')) {
      icon = 'toggle-switch-off';
      if ( entity.state === 'on' ) {
        icon = 'toggle-switch';
      }
    } else if (entity.entity_id.startsWith('light.')) {
      icon = 'lightbulb';
      if ( entity.state === 'on' ) {
        icon = 'lightbulb-on';
      }
    }

    return icon;
  }

  renderContent() {
    return (
      <div className="tile-content">
        <div className="tile-value">{this.props.entity.state}</div>
        <div className="tile-unit">{this.props.entity.attributes.unit_of_measurement}</div>
      </div>
    );
  }

  renderIcon() {
    let icon = this.getIcon(this.props.entity);
    return (
      <div className="tile-icon"><i className={"mdi mdi-" + icon}></i></div>
    );
  }

  render() {
    if (!this.props.entity) {
      return null;
    }

    let entity_type = this.props.entity.entity_id.split('.')[0];

    return (
      <div
          className={"tile " + entity_type}
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
