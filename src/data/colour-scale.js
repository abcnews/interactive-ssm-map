const Scale = require('d3-scale');

const colours = [
    '#025e89',
    '#2d6b93',
    '#46789d',
    '#5c85a7',
    '#6f92b1',
    '#83a0bb',
    '#96afc6',
    '#a9bdd0',
    '#bbcbda',
    '#cfdae4',
    '#e2e8ef',
    '#f5f8fa',
    '#fdf6f7',
    '#f9e2e6',
    '#f4d0d5',
    '#eebdc5',
    '#e8aab5',
    '#e297a5',
    '#db8495',
    '#d37187',
    '#cb5e78',
    '#c34869',
    '#b92f5b',
    '#b0064d'
];

module.exports = () => {
    let min = 0.2;
    let max = 0.8;

    return Scale.scaleQuantize().domain([min, max]).range(colours);
};

module.exports.colours = colours;
