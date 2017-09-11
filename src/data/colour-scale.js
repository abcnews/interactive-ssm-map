const Scale = require('d3-scale');

const colours = [
    '#e86b2b',
    '#f2844f',
    '#f99d70',
    '#feb593',
    '#ffcfb7',
    '#ffe7dc',
    '#ffffff',
    '#e1eff7',
    '#c2e0ef',
    '#a2d0e7',
    '#7fc1df',
    '#56b2d7',
    '#00a3cf'
];

module.exports = () => {
    let min = 0.2;
    let max = 0.8;

    return Scale.scaleQuantize().domain([min, max]).range(colours);
};

module.exports.colours = colours;
