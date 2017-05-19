"use strict";

class Panel {
    constructor(api, modal, chart, group, selector) {
        this.api = api;
        this.modal = modal;
        this.chart = chart;
        this.group_name = group;
        this.default_icon = "checkbox-blank";
        this.group = {};
        this.entity_ids = [];
        this.parent_container = $(selector);
    }


    /***************************************************************************
     * CORE *
     **************************************************************************/

    is_true(state) {
        if(state === "on") {
            return true;
        }
        return false;
    }

    async refresh_state() {
        await this.api.load_bootstrap();
        this.entity_ids = [];
        this.group = this.api.get_group(this.group_name);
        if(!this.group) {
          console.error("Couldn't find group '" + this.group_name + "'!");
          return
        }
        this.entity_ids = this.group.attributes.entity_id;
        this.render();
    }

    async run() {
        this.api.start_websocket();
        this.api.add_listener(event => this.on_event(event));
        this.refresh_state();
    }


    /***************************************************************************
     * EVENTS *
     **************************************************************************/

    async on_entity_clicked(entity) {
        if(
            entity.entity_id.startsWith('switch.') ||
            entity.entity_id.startsWith('light.')
        ) {
            await this.on_switch_clicked(entity);
        } else {
            this.chart.clear();
            let title = entity.attributes.friendly_name + ': ' + entity.state;
            if(entity.attributes.unit_of_measurement) {
                title += ' ' + entity.attributes.unit_of_measurement;
            }
            let lastMeasurement = new Date(entity.last_changed).toLocaleDateString() + ' ' + new Date(entity.last_changed).toLocaleTimeString();
            $('.modal .info').text('Latest measurement: ' + lastMeasurement);
            this.modal.set_title(title);
            this.modal.show();
            this.chart.create(entity);
        }
    }

    async on_switch_clicked(entity) {
        if(this.is_true(entity.state)) {
            return this.api.turn_off(entity.entity_id);
            
        } else {
            return this.api.turn_on(entity.entity_id);
        }
    }

    on_event(event) {
        let data = JSON.parse(event.data);
        if(data.event && data.event.data) {
            let entity_id = data.event.data.entity_id;
            if(this.entity_ids.includes(entity_id)) {
                // TODO: no need to reload the entire state, instead
                //       the new data should be updated into api.bootstrap
                //       to avoid the extra request
                this.refresh_state();
            }
        }
    }


    /***************************************************************************
     * RENDER *
     **************************************************************************/

    render() {
        console.log("Rendering...");
        this.clear_tiles();
        let elem;
        for(let name of this.entity_ids) {
            let entity = this.api.get_entity(name)
            if(entity) {
                elem = this.render_entity(entity)
                this.parent_container.append(elem);
            } else {
                console.log("Entity not found!", name)
            }
        }
    }

    clear_tiles() {
        this.parent_container.empty()
    }

    get_entity_icon(entity) {
        let icon = this.default_icon;

        if (entity.attributes.icon) {
            icon = entity.attributes.icon.split(':')[1]
        } else if (entity.entity_id.startsWith('switch.')) {
            icon = 'toggle-switch-off';
            if ( this.is_true(entity.state) ) {
                icon = 'toggle-switch';
            }
        } else if (entity.entity_id.startsWith('light.')) {
            icon = 'lightbulb';
            if ( this.is_true(entity.state) ) {
                icon = 'lightbulb-on';
            }
        }

        return icon;
    }

    render_entity(entity) {
        let type = entity.entity_id.split(".")[0];

        let icon = this.get_entity_icon(entity);
        let tile = $('<div class="tile"></div>');
        tile.addClass(type);
        tile.attr("data-entity-id", entity.entity_id);
        tile.attr("title", entity.attributes.friendly_name + ": " + entity.state);
        tile.click(event => {this.on_entity_clicked(entity)})
        tile.append($('<div class="tile-label"></div>').text(entity.attributes.friendly_name));

        if(this.is_true(entity.state)) {
            tile.addClass("active");
        }
        if(entity.entity_id.startsWith("sensor")) {
            let tile_content = $('<div class="tile-content"></div>')
            tile_content.append($('<div class="tile-value"></div>').text(entity.state));
            tile_content.append($('<div class="tile-unit"></div>').text(entity.attributes.unit_of_measurement));
            tile.append(tile_content);
        } else {
            if(icon) {
                tile.append($('<div class="tile-icon"><i class="mdi mdi-' + icon + '"></i></div>'))
            }
        }
        
        return tile;
    }

}
