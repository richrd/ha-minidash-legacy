import HTTPWrapper from './HTTPWrapper';

class HaApi {
    constructor(api_root) {
      this.api_root = api_root;
      this.socket = null;
      this.socket_subscribers = [];
    }

    startWebsocket() {
        console.log("Connecting to websocket...");
        let url = "ws://" + this.api_root.split("://")[1] + "websocket";
        this.sock = new WebSocket(url);
        this.sock.onmessage = (event) => this.onSocketEvent(event);

        // Automatically reconnect
        this.sock.onclose = (evt) => {
            console.log("Socket closed.", evt);
            console.log("CloseEvent.code:", CloseEvent.code);
            console.log("CloseEvent.reason:", CloseEvent.reason);
            setTimeout(() => this.startWebsocket(), 1000);
        }

        // Subscribe to all Home Assistant events
        this.sock.onopen = (evt) => {
            console.log("websocket connected");
            let handshake = {
                "id": 18,
                "type": "subscribe_events",
            }
            this.sock.send(JSON.stringify(handshake));
        }

    }

    onSocketEvent(event) {
      this.socket_subscribers.map((sub) => {sub(event)});
    }

    subscribeSocket(callback) {
      this.socket_subscribers.push(callback);
    }

    loadData() {
      return HTTPWrapper.request(this.api_root + 'bootstrap')
        .then((res) => {
          this.bootstrap = JSON.parse(res.responseText);
          return this.bootstrap;
        })
        .catch((err) => {
          console.error(err);
        });
    }

    getEntitiesInGroup(groupName) {
      let ids = this.getEntityIdsByGroup(groupName);
      return ids.reduce(
        (entities, curV, curI) => {
          entities.push(this.getEntityByName(curV));
          return entities;
        },
        []
      );
    }

    getEntityIdsByGroup(groupName) {
        let group = this.getEntityByName('group.' + groupName);
        this.entityIds = [];
        if(!group) {
          console.error("Couldn't find group '" + groupName + "'!");
          return;
        }
        let entityIds = group.attributes.entity_id;
        return entityIds;
    }

    getEntityByName(entityName) {
      for(let state of this.bootstrap.states) {
        if(state.entity_id === entityName) {
          return state;
        }
      }

      return null;
    }

    /** Actions */
    async turnOn(entity_id) {
        const service = entity_id.split('.')[0];
        return HTTPWrapper.request(this.api_root + 'services/' + service + '/turn_on', {'entity_id': entity_id})
    }

    async turnOff(entity_id) {
        const service = entity_id.split('.')[0];
        return HTTPWrapper.request(this.api_root + 'services/' + service + '/turn_off', {'entity_id': entity_id})
    }

    async toggle(entity_id) {
        const service = entity_id.split('.')[0];
        return HTTPWrapper.request(this.api_root + 'services/' + service + '/toggle', {'entity_id': entity_id})
    }

}

export default HaApi;
