const Scale = require('d3-scale');

module.exports = data => {
    let min = data.sortBy(d => d.get('value')).first().get('value');
    let max = data.sortBy(d => d.get('value')).last().get('value');

    return Scale.scaleQuantize()
        .domain([min, max])
        .range([
            '#f55446',
            '#f66655',
            '#f67664',
            '#f68573',
            '#f59383',
            '#f3a193',
            '#f0afa3',
            '#ecbcb3',
            '#e7c9c4',
            '#e1d6d5',
            '#d5d7dc',
            '#c6ccdb',
            '#b7c1d9',
            '#a7b6d8',
            '#96acd6',
            '#85a1d5',
            '#7397d3',
            '#5e8dd1',
            '#4583cf',
            '#1f79cd'
        ]);
};
