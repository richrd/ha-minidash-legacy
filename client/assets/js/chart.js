"use strict";

class Chart {
    constructor() {
        this.graph = null;
    }
    
    clear(entity, data) {
        delete this.graph;
        this.graph = null;
        $('#chart').html('');
        $('#y_axis').html('');
    }
    
    render(entity, data) {
        let chartOptions = {
            element: document.querySelector("#chart"), 
            width: $('.modal .body #chart').width(),
            height: 250,
        }

        if(entity.entity_id.startsWith('binary_sensor.')) {
            chartOptions.interpolation = 'step';
        }
    
        let chartData = [];
        for(let item of data[0]) {
            let state = item.state;
            if (state == 'on') {
                state = 1;
            } else if (state == 'off') {
                state = 0;
            }
            state = parseFloat(state);
            if (isNaN(state)) {
                continue;
            }
            let dateTime = Date.parse(item.last_updated);
            let dataPoint = {
                x: dateTime,
                y: state,
            }
            chartData.push(dataPoint);
        }
    
        chartOptions.series = [{
            color: '#00A6E9',
            data: chartData,
            name: entity.attributes.friendly_name,
        }]
    
        this.graph = new Rickshaw.Graph(chartOptions);
    
        let smoother = new Rickshaw.Graph.Smoother({
            graph : this.graph,
        });
        smoother.setScale(1)
    
        let x_axis = new Rickshaw.Graph.Axis.X({
            graph: this.graph,
            tickFormat: function(x) {
                return new Date(x).toLocaleString();
            },
            ticks: 4,
        });
        let y_axis = new Rickshaw.Graph.Axis.Y( {
            graph: this.graph,
            orientation: 'left',
            tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
            element: document.getElementById('y_axis')
        } );
    
        let hoverDetail = new Rickshaw.Graph.HoverDetail({
            graph: this.graph,
            formatter: (series, x, y) => {
                let unit = '';
                if(entity.attributes.unit_of_measurement) {
                    unit = entity.attributes.unit_of_measurement;
                }
                var date = '<span class="date">' + new Date(x).toLocaleDateString() + ' ' + new Date(x).toLocaleTimeString() + '</span>';
                var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
                var content = swatch + series.name + ": " + parseInt(y) + ' ' + unit + '<br>' + date;
                return content;
            }
        });
    
        this.graph.render();
        console.log(this.graph);
    }

    create(entity) {
        let url = ha_minidash_config['api_root'] + 'history/period?filter_entity_id=' + entity.entity_id;
        let resp = $.ajax({
                url: url,
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
            }).done((data) => {
                this.render(entity, data);
            });
    }
}