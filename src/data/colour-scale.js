const Scale = require('d3-scale');

module.exports = data => {
    let min = data.sortBy(d => d.get('value')).first().get('value');
    let max = data.sortBy(d => d.get('value')).last().get('value');

    return Scale.scaleQuantize()
        .domain([min, max])
        .range([
            '#ffffff',
            '#fcf6ff',
            '#f9edff',
            '#f5e4ff',
            '#f2daff',
            '#eed1ff',
            '#eac8ff',
            '#e6bfff',
            '#e2b6ff',
            '#deadff',
            '#d9a2ff',
            '#d495ff',
            '#ce88ff',
            '#c77aff',
            '#c16dff',
            '#ba5eff',
            '#b24fff',
            '#aa3eff',
            '#a229ff',
            '#9900ff'
        ]);
};
