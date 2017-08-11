const Scale = require('d3-scale');

const colours = [
    '#91b6c9',
    '#9bbcce',
    '#a4c2d2',
    '#aec9d7',
    '#b7cfdc',
    '#c1d5e0',
    '#cbdce5',
    '#d4e2ea',
    '#dee8ee',
    '#e7eff3',
    '#f1f5f8',
    '#fafcfd',
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
];

module.exports = data => {
    let min = data.sortBy(d => d.get('value')).first().get('value');
    let max = data.sortBy(d => d.get('value')).last().get('value');

    return Scale.scaleQuantize().domain([min, max]).range(colours);
};

module.exports.colours = colours;
