const Preact = require('preact');
const values = require('object-values');
const d3 = require('d3-selection');
const force = require('d3-force');
const transition = require('d3-transition');
const TopoJSON = require('topojson');
const ranger = require('power-ranger');
const Geo = require('d3-geo');
const scale = require('../data/colour-scale');

const mapJSON = require('../data/map.quantized.json');

const styles = require('./map.scss');

let svg;
let features;
let path;
let centered;
let locationLabel;
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

        this.electorate = null;

        this.onResize = this.onResize.bind(this);

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

        window.__ODYSSEY__.scheduler.subscribe(this.onResize);
    }

    componentWillUnmount() {
        window.__ODYSSEY__.scheduler.unsubscribe(this.onResize);
    }

    render() {
        return <div ref={el => (this.wrapper = el)} />;
    }

    onResize(viewport) {
        if (viewport.width !== width || viewport.height !== height) {
            width = viewport.width;
            height = viewport.height;

            projection = Geo.geoMercator()
                .scale(width * 0.9)
                .center([131, -27])
                .translate([width / 2, height / 2]);

            path = Geo.geoPath().projection(projection);

            data.forEach(f => {
                f.properties.support = this.props.data.getIn([
                    f.properties.elect_div.toUpperCase(),
                    'value'
                ]);
                f.properties.name = f.properties.elect_div;

                f.x = path.centroid(f)[0];
                f.y = path.centroid(f)[1];
            });

            svg.attr('width', width).attr('height', height);

            features.selectAll('path').attr('d', path);
        }
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

        // Graft the support onto the map data
        data = TopoJSON.feature(
            mapJSON,
            mapJSON.objects.map
        ).features.map(f => {
            f.properties.support = this.props.data.getIn([
                f.properties.elect_div.toUpperCase(),
                'value'
            ]);
            f.properties.name = f.properties.elect_div;

            f.x = path.centroid(f)[0];
            f.y = path.centroid(f)[1];

            return f;
        });

        svg = d3
            .select(this.wrapper)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        features = svg.append('g').attr('class', styles.features);

        let colours = scale(this.props.data);

        features
            .selectAll('path')
            .data(data)
            .enter()
            .append('path')
            .attr('d', path)
            .style('fill', d => colours(d.properties.support));

        locationLabel = features.append('g');

        let balloonWidth = 300;
        let locationLabelBalloon = locationLabel
            .append('g')
            .attr('fill', 'white')
            .attr('transform', `translate(-${balloonWidth / 2}, -69)`);
        locationLabelBalloon
            .append('polygon')
            .attr('points', '0,0 10,20, 20,0')
            .attr('transform', `translate(${balloonWidth / 2 - 10}, 49)`);
        locationLabelBalloon
            .append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('rx', 3)
            .attr('ry', 3)
            .attr('width', 300)
            .attr('height', 50);
        locationLabelBalloon
            .append('text')
            .attr('font-size', 25)
            .attr('fill', 'black')
            .attr('x', 6)
            .attr('y', 33)
            .text('Sydney');

        this.zoomTo();
    }

    // Draw the map
    draw(marker) {
        // find the electorate
        let d = data.find(datum => {
            if (!marker.config.electorate) return false;

            return (
                datum.properties.name.toLowerCase() ===
                marker.config.electorate.toLowerCase()
            );
        });

        if (d) {
            this.zoomTo(marker, d);
        } else {
            this.zoomTo(marker);
        }
    }

    zoomTo(marker, d) {
        // Don't zoom again
        if (d && this.state.electorate === d) return;

        let x;
        let y;
        let k;

        let electorate;

        if (d && this.state.electorate !== d) {
            // Compute the new map center and scale to zoom to
            x = d.x;
            y = d.y;

            if (marker && marker.config.zoom) {
                k = parseInt(marker.config.zoom, 10);
            } else {
                k = 50; // Ok-ish zoom to a normal electorate level (based on Brisbane)
            }

            if (width < 400) {
                k = (k + k / 2) * 1.8;
            }

            // Move the map pin and center the text
            locationLabel
                .attr('transform', `translate(${x}, ${y}) scale(${1 / k})`)
                .style('opacity', 1);
            var label = locationLabel.select('text');
            label.text(
                d.properties.name +
                    ' (' +
                    (Math.round(d.properties.support * 100) + '%)')
            );
            label.attr(
                'x',
                (locationLabel.node().getBBox().width -
                    label.node().getBBox().width) /
                    2
            );

            electorate = d;
        } else {
            x = width / 2 + 10; // just off actual center
            y = height / 2;
            k = 0.8;

            // mobile width gets a different zoom
            if (width < 400) {
                k = 0.8 * 1.55;
            }

            locationLabel.style('opacity', 0);

            electorate = null;
        }

        // Highlight the new feature
        features.selectAll('path').transition().duration(1400);

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
