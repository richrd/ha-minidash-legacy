"use strict";

// Run HA-MiniDash
// ha_minidash_config is loaded from config.js in index.html
$(function() {
    let api = new HassAPI(ha_minidash_config['api_root']);
    let modal = new Modal();
    let chart = new Chart();
    let panel = new Panel(api, modal, chart, ha_minidash_config['group_name'], ha_minidash_config['container_selector']);
    panel.run();
});
