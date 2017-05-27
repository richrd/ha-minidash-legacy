import React, { Component } from 'react';
//import logo from './logo.svg';
//import './App.css';
import Tiles from './Tiles';
import HaApi from './api/HaApi';


class App extends Component {
  constructor() {
    super();
    this.state = {
      entities: [],
    };

    this.group_name = 'dashboard'
    this.api = new HaApi('http://192.168.1.135:8123/api/');
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
      if (this.entityIdShown(data.event.data.entity_id)) {
        this.refrehsData();
      }
    }
  }

  entityIdShown(entityId) {
    for (let i = 0; i < this.state.entities.length; i++) {
      if(this.state.entities[i].entity_id === entityId) {
        return true;
      }
    }

    return false;
  }

  tileClicked(entity) {
    if (
        entity.entity_id.startsWith('switch.') ||
        entity.entity_id.startsWith('light.')
    ) {
      if (entity.state === 'off') {
        this.api.turnOn(entity.entity_id);
      } else {
        this.api.turnOff(entity.entity_id);
      }
    }
  }

  render() {
    return (
      <div className="app">
        <Tiles entities={this.state.entities} tileClicked={(entity) => this.tileClicked(entity)}/>
      </div>
    );
  }
}

export default App;
