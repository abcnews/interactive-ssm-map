const Scale = require('d3-scale');

module.exports = data => {
    let min = data.sortBy(d => d.get('value')).first().get('value');
    let max = data.sortBy(d => d.get('value')).last().get('value');

    return Scale.scaleQuantize()
        .domain([min, max])
        .range([
            '#ff0000',
            '#ff3500',
            '#ff4d00',
            '#ff6100',
            '#ff7200',
            '#ff8100',
            '#ff9000',
            '#ff9e00',
            '#ffac00',
            '#ffb900',
            '#ffc600',
            '#ffd300',
            '#ffe000',
            '#ffec00',
            '#fff900',
            '#f9fd00',
            '#edfa00',
            '#e0f700',
            '#d4f400',
            '#c7f000',
            '#baed00',
            '#adea00',
            '#9fe600',
            '#91e200',
            '#83df00',
            '#73db00',
            '#62d700',
            '#4fd400',
            '#36d000',
            '#00cc00'
        ]);
};
