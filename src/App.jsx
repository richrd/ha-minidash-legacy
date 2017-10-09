import React, { Component } from 'react';
import Tiles from './Tiles';
import HaApi from './api/HaApi';


class App extends Component {
  constructor() {
    super();
    this.state = {
      entities: [],
    };

    this.group_name = 'dashboard'
    this.api = new HaApi('http://192.168.1.195:8123/api/');
    this.refrehsData();
    this.api.subscribeSocket((message) => this.onMessage(message));
    this.api.startWebsocket();
  }

  refrehsData() {
    this.api.loadData().then((res) => {
      if (!res) {return false;}
      let entities = this.api.getEntitiesInGroup(this.group_name);
      this.setState({
        entities: entities,
        });
      this.render();
    });
  }

  onMessage(message) {
    let data = JSON.parse(message.data);
    if (data && data.event && data.event.event_type === 'state_changed') {
      console.log(data)
      if (this.entityIdShown(data.event.data.entity_id)) {
        this.refrehsData();
      }
    }
  }

  entityIdShown(entityId) {
    for (let i = 0; i < this.state.entities.length; i++) {
      let entity = this.state.entities[i]
      console.log(this.state.entities[i]);
      if(entity && entity.entity_id === entityId) {
        return true;
      }
    }

    return false;
  }

  tileClicked(entity) {
    if (
        entity.entity_id.startsWith('switch.') ||
        entity.entity_id.startsWith('input_boolean.') ||
        entity.entity_id.startsWith('light.')
    ) {
      this.api.toggle(entity.entity_id)
      //if (entity.state === 'off') {
      //  this.api.turnOn(entity.entity_id);
      //} else {
      //  this.api.turnOff(entity.entity_id);
      //}
    }
  }

  render() {
    return (
      <div className="app">
        <Tiles entities={this.state.entities} tileClicked={(entity) => this.tileClicked(entity)} />
      </div>
    );
  }
}

export default App;
