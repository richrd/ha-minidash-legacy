"use strict";

// Run HA-MiniDash
// ha_minidash_config is loaded from config.js in index.html
$(function() {
    let api = new HassAPI(ha_minidash_config['api_root']);
    let panel = new Panel(api, ha_minidash_config['group_name'], ha_minidash_config['container_selector']);
    window.panel = panel;  // console debugging
    panel.run();
});
