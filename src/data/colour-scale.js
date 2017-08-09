const Scale = require('d3-scale');

module.exports = data => {
    let min = data.sortBy(d => d.get('value')).first().get('value');
    let max = data.sortBy(d => d.get('value')).last().get('value');

    return Scale.scaleQuantize()
        .domain([min, max])
        .range([
            '#8c3b04',
            '#984c1e',
            '#a35c33',
            '#ad6d48',
            '#b67d5e',
            '#bf8e74',
            '#c79f8a',
            '#cfb1a1',
            '#d5c2b9',
            '#dbd4d1',
            '#d4d5d9',
            '#c1c6d1',
            '#aeb6c9',
            '#9ba7c1',
            '#8999b9',
            '#758ab0',
            '#617ca8',
            '#4c6ea0',
            '#346198',
            '#0d5490'
        ]);
};
