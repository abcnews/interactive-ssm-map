const Scale = require('d3-scale');

const colours = [
    '#00a3cf',
    '#56b2d7',
    '#7fc1df',
    '#a2d0e7',
    '#c2e0ef',
    '#e1eff7',
    '#ffffff',
    '#ffe7dc',
    '#ffcfb7',
    '#feb593',
    '#f99d70',
    '#f2844f',
    '#e86b2b'
];

module.exports = () => {
    let min = 0.2;
    let max = 0.8;

    return Scale.scaleQuantize().domain([min, max]).range(colours);
};

module.exports.colours = colours;
