const Scale = require('d3-scale');

module.exports = data => {
    let min = data.sortBy(d => d.get('value')).first().get('value');
    let max = data.sortBy(d => d.get('value')).last().get('value');

    return Scale.scaleQuantize()
        .domain([min, max])
        .range([
            '#74ad93',
            '#80b49c',
            '#8cbba5',
            '#98c2ae',
            '#a4c9b7',
            '#b0d0c1',
            '#bcd7ca',
            '#c8dfd3',
            '#d4e6dd',
            '#e0ede7',
            '#edf4f0',
            '#f9fbfa',
            '#fbf5fb',
            '#f2e1f2',
            '#e9cee9',
            '#e0bae0',
            '#d6a7d7',
            '#cd94ce',
            '#c380c5',
            '#b96dbc',
            '#ae59b3',
            '#a343aa',
            '#982ba1',
            '#8d0098'
        ]);
};
