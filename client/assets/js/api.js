"use strict";

class HassAPI {
    constructor(base_url) {
        this.base_url = base_url;
        this.bootstrap = null;
        this.listeners = [];
        this.socket = null;
    }

    start_websocket() {
        let url = "ws://" + this.base_url.split("://")[1] + "websocket";
        this.sock = new WebSocket(url);
        this.sock.onmessage = (event) => this.on_event(event);
        // Subscribe to all events
        this.sock.onopen = (evt) => {
            let subscr = {
                "id": 18,
                "type": "subscribe_events",
            }
            this.sock.send(JSON.stringify(subscr));
        }
    }

    on_event(event) {
        for(let listener of this.listeners) {
            listener(event)
        }
    }

    add_listener(func) {
        this.listeners.push(func);
    }

    async request(endpoint, data) {
        let method = 'GET';
        if(data) {
            data = JSON.stringify(data);
            method = 'POST';
        }
        let resp = $.ajax({
                url: this.base_url + endpoint,
                method: method,
                headers: {
                    'Content-type': 'application/json',
                },
                data: data,
            })
        return resp;
    }

    async load_bootstrap() {
        return this.request('bootstrap').then((data) => {
            this.bootstrap = data;
            return data;
        });
    }


    /***************************************************************************
     * GET DATA *
     **************************************************************************/

    get_entity(name) {
        for(let state of this.bootstrap.states) {
            if(state.entity_id === name) {
                return state;
            }
        }
        return null;
    }

    get_group(name) {
        name = "group."+name
        return this.get_entity(name);
    }

    /***************************************************************************
     * ACTIONS *
     **************************************************************************/

     async turn_on(entity_id) {
         return this.request('services/switch/turn_on', {'entity_id': entity_id})
     }

     async turn_off(entity_id) {
         return this.request('services/switch/turn_off', {'entity_id': entity_id})
     }
}
