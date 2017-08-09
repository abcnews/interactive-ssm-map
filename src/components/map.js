const Preact = require('preact');
const d3 = require('d3-selection');
const force = require('d3-force');
const transition = require('d3-transition');
const TopoJSON = require('topojson');
const ranger = require('power-ranger');
const Geo = require('d3-geo');
const Scale = require('d3-scale');

const mapJSON = require('../data/map.quantized.json');

// TODO: This could be loaded from the page?
const voteJSON = require('../data/ssm-disagree.csv');

const styles = require('./map.scss');

let features;
let path;
let centered;
let tooltip;
let circles;
let simulation;
let width;
let height;
let projection;
let data;
const margin = 10;

class Map extends Preact.Component {
    constructor(props) {
        super(props);

        this.hasLoaded = false;
        this.electorate = null;

        this.initMap = this.initMap.bind(this);
        this.draw = this.draw.bind(this);

        this.zoomTo = this.zoomTo.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.marker !== nextProps.marker) {
            this.draw(nextProps.marker);
        }
    }

    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {
        this.initMap();
    }

    render() {
        return <div ref={el => (this.wrapper = el)} />;
    }

    initMap() {
        if (!this.wrapper) return;

        const component = this;

        width = window.innerWidth;
        height = window.innerHeight;

        projection = Geo.geoMercator()
            .scale(width * 0.9)
            .center([131, -27])
            .translate([width / 2, height / 2]);

        path = Geo.geoPath().projection(projection);

        // Index the support CSV
        let support = {};
        let value;
        let min = 1;
        let max = 0;
        voteJSON.forEach(row => {
            value = parseFloat(row['Total disagree']);
            support[row['Row Labels']] = value;
            if (value < min) {
                min = value;
            }
            if (value > max) {
                max = value;
            }
        });

        // Graft the support onto the map data
        data = TopoJSON.feature(
            mapJSON,
            mapJSON.objects.map
        ).features.map(f => {
            f.properties.support =
                support[f.properties.elect_div.toUpperCase()];
            f.properties.name = f.properties.elect_div;

            f.x = path.centroid(f)[0];
            f.y = path.centroid(f)[1];

            return f;
        });

        const svg = d3
            .select(this.wrapper)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        features = svg.append('g').attr('class', styles.features);

        var colours = Scale.scaleQuantize()
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

        features
            .selectAll('path')
            .data(data)
            .enter()
            .append('path')
            .attr('d', path)
            .style('fill', d => colours(d.properties.support));

        tooltip = features.append('text').attr('class', styles.tooltip);
    }

    // Draw the map
    draw(marker) {
        console.log('marker', marker);

        // find the electorate
        let d = data.find(datum => {
            if (!marker.config.electorate) return false;

            return (
                datum.properties.name.toLowerCase() ===
                marker.config.electorate.toLowerCase()
            );
        });

        if (d) {
            this.zoomTo(d);
        } else {
            this.zoomTo();
        }
    }

    zoomTo(d) {
        // Don't zoom again
        if (this.state.electorate === d) return;

        let x;
        let y;
        let k;

        const width = window.innerWidth;
        const height = window.innerHeight;

        let electorate;

        if (d && this.state.electorate !== d) {
            // Compute the new map center and scale to zoom to
            let centroid = path.centroid(d);
            let bounds = path.bounds(d.geometry);

            x = centroid[0];
            y = centroid[1];
            // k =
            //     0.15 /
            //     Math.max(
            //         (bounds[1][0] - bounds[0][0]) / width,
            //         (bounds[1][1] - bounds[0][1]) / height
            //     );
            k = 50;

            console.log('font size?', k.toFixed(2) + 'px');

            tooltip
                .text(d.properties.name)
                .attr('dy', -0.3 + 'px')
                .attr('x', d.x + 'px')
                .attr('y', d.y + 'px');

            console.log('tooltip', tooltip);

            electorate = d;
        } else {
            x = width / 2;
            y = height / 2;
            k = 1;
            // tooltip.style('display', 'none');
            tooltip.text('');

            electorate = null;
        }

        // Highlight the new feature
        features
            .selectAll('path')
            // .classed(styles.highlighted, function(d) {
            //     return d === centered;
            // })
            .transition()
            .duration(1400)
            .style('stroke-width', 1 / k + 'px'); // Keep the border width constant

        features
            .transition()
            .duration(1500)
            .attr(
                'transform',
                `translate(${width / 2}, ${height /
                    2}) scale(${k}) translate(${-x}, ${-y})`
            );

        this.setState({ electorate });
    }
}

module.exports = Map;
