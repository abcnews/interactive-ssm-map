const { Component, h } = require('preact');
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
let mapX = 0;
let mapY = 0;
let mapZoom;
let path;
let centered;
let locationLabel;
let otherLabels;
let circles;
let simulation;
let width;
let height;
let projection;
let data;
const margin = 10;

class Map extends Component {
    constructor(props) {
        super(props);

        this.electorate = null;
        this.findElectorate = this.findElectorate.bind(this);

        this.onResize = this.onResize.bind(this);

        this.initMap = this.initMap.bind(this);
        this.createLabel = this.createLabel.bind(this);
        this.updateLabel = this.updateLabel.bind(this);

        this.zoomTo = this.zoomTo.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.marker !== nextProps.marker) {
            this.zoomTo(nextProps.marker);
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
                f.properties.support = this.props.data.getIn([f.properties.elect_div.toUpperCase(), 'value']);
                f.properties.name = f.properties.elect_div;

                f.x = path.centroid(f)[0];
                f.y = path.centroid(f)[1];
            });

            svg.attr('width', width).attr('height', height);

            features.selectAll('path').attr('d', path);

            this.zoomTo(this.props.marker);
        }
    }

    findElectorate(name) {
        if (!name) return false;

        return data.find(datum => {
            return (
                datum.properties.name.toLowerCase().replace(/[^a-z]/, '') === name.toLowerCase().replace(/[^a-z]/, '')
            );
        });
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
        data = TopoJSON.feature(mapJSON, mapJSON.objects.map).features.map(f => {
            f.properties.support = this.props.data.getIn([f.properties.elect_div.toUpperCase(), 'value']);
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

        let colours = scale();

        features
            .selectAll('path')
            .data(data)
            .enter()
            .append('path')
            .attr('d', path)
            .style('fill', d => colours(d.properties.support))
            .on('click', d => {
                this.zoomTo({ config: { electorate: d.properties.name } }, true);
            });

        otherLabels = [
            this.createLabel(),
            this.createLabel(),
            this.createLabel(),
            this.createLabel(),
            this.createLabel(),
            this.createLabel(),
            this.createLabel(),
            this.createLabel(),
            this.createLabel(),
            this.createLabel()
        ];
        locationLabel = this.createLabel();

        // Zoom to Aus
        this.zoomTo();
    }

    createLabel() {
        const label = features.append('g');

        let balloonWidth = 280;
        let locationLabelBalloon = label
            .append('g')
            .attr('fill', 'black')
            .style('pointer-events', 'none')
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
            .attr('width', balloonWidth)
            .attr('height', 50);
        locationLabelBalloon
            .append('text')
            .attr('font-size', 22)
            .attr('fill', 'white')
            .attr('x', 6)
            .attr('y', 33)
            .text('');
        return label;
    }

    updateLabel(label, d, k) {
        if (!d) return;

        // shrink the labels a bit
        k = k * 1.3;

        let x = d.x;
        let y = d.y;

        let bounds;
        switch (d.properties.name.toLowerCase()) {
            case 'bowman':
                bounds = path.bounds(d);
                x = bounds[0][0] + (bounds[1][0] - bounds[0][0]) * 0.2;
                break;
            case 'bonner':
                bounds = path.bounds(d);
                x = bounds[0][0] + (bounds[1][0] - bounds[0][0]) * 0.2;
                y = bounds[0][1] + (bounds[1][1] - bounds[0][1]) * 0.8;
                break;
            case 'mayo':
                bounds = path.bounds(d);
                x = bounds[0][0] + (bounds[1][0] - bounds[0][0]) * 0.8;
                y = bounds[0][1] + (bounds[1][1] - bounds[0][1]) * 0.5;
                break;
            case 'parkes':
                bounds = path.bounds(d);
                x = bounds[0][0] + (bounds[1][0] - bounds[0][0]) * 0.7;
                break;
            case 'fenner':
                bounds = path.bounds(d);
                x = bounds[0][0] + (bounds[1][0] - bounds[0][0]) * 0.1;
                break;
            default:
            // nothing
        }

        label.attr('transform', `translate(${x}, ${y}) scale(${1 / k})`).style('opacity', 1);
        var text = label.select('text');

        const updatedText = d.properties.name + ' (' + (Math.round(d.properties.support * 100) + '%)');
        if (updatedText !== text.text()) {
            text.text(d.properties.name + ' (' + (Math.round(d.properties.support * 100) + '%)'));
            text.attr('x', (label.node().getBBox().width - text.node().getBBox().width) / 2);
        }
    }

    zoomTo(marker, wasClicked) {
        // find the electorate
        let d = this.findElectorate(marker && marker.config.electorate);

        let x;
        let y;
        let k;

        let electorate;

        if (d) {
            let renderMain = true;
            let others = [];
            let renderOthers = true;

            // Find any other electorates
            otherLabels.forEach(l => l.style('opacity', 0));
            if (marker && marker.config.and) {
                others = [].concat(marker.config.and).map(this.findElectorate);

                // Mobile tweaks
                if (width < 400) {
                    const name = marker.config.electorate.toLowerCase();
                    // Sydney and Chiffley -> hide chiffley
                    if (name === 'sydney' && others[0].properties.name.toLowerCase() === 'chifley') {
                        renderOthers = false;
                    } else if (name === 'griffith') {
                        renderMain = false;
                        renderOthers = false;
                    } else if (name == 'maranoa') {
                        renderOthers = false;
                    }
                } else if (width < 1000) {
                    if (name === 'griffith') {
                        renderMain = false;
                        renderOthers = false;
                    }
                }
            }

            // Compute the new map center and scale to zoom to
            if (others.length == 0) {
                x = d.x;
                y = d.y;
            } else {
                let minX = 999999;
                let maxX = 0;
                let minY = 999999;
                let maxY = 0;
                [d].concat(others).forEach(data => {
                    minX = Math.min(minX, data.x);
                    maxX = Math.max(maxX, data.x);
                    minY = Math.min(minY, data.y);
                    maxY = Math.max(maxY, data.y);
                });

                x = minX + (maxX - minX) / 2;
                y = minY + (maxY - minY) / 2;
            }

            if (marker && marker.config.zoom) {
                k = parseInt(marker.config.zoom, 10);
            } else if (wasClicked) {
                // Detect zoom level for whole of electorate
                var centroid = path.centroid(d);
                var b = path.bounds(d);
                k = 0.8 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
                k = Math.min(50, k);
            } else {
                k = 50; // Ok-ish zoom to a normal electorate level (based on Brisbane)
            }

            // Zoom in a bit on mobile
            if (width < 400) {
                k = k + k / 4;
            }

            // Move the map pin and center the text
            this.updateLabel(locationLabel, d, k);

            // Hide the main maker if need be
            if ((marker && marker.config.hide) || renderMain === false) {
                locationLabel.style('opacity', 0);
            } else {
                locationLabel.style('opacity', 1);
            }

            let names = [];
            if (renderOthers) {
                others = others.forEach((data, index) => {
                    if (data) names.push(data.properties.name);
                    this.updateLabel(otherLabels[index], data, k);
                });
            }

            // Bring the current electorates to the front
            features.selectAll('path').sort((a, b) => {
                // main electorate
                if (a.properties.name !== d.properties.name) return -1;
                // other electorates
                if (names.indexOf(a.properties.name) > -1) return -1;
                // everything else
                return 1;
            });

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
            otherLabels.forEach(l => l.style('opacity', 0));

            electorate = null;
        }

        // Don't zoom again
        if (k === mapZoom && this.state.electorate === electorate) return;

        // Highlight the new feature
        features
            .selectAll('path')
            .transition()
            .duration(1400);

        // if the diff of the x and y are both huge then zoom out first
        const diffX = Math.abs(x - mapX);
        const diffY = Math.abs(y - mapY);
        const diffZoom = Math.abs(k - mapZoom);
        const isFarAway = diffX > 100 || diffY > 100;
        if (diffY !== 0 && mapZoom >= 2 && k >= 2 && isFarAway) {
            const middleX = Math.min(x, mapX) + diffX / 2;
            const middleY = Math.min(y, mapY) + diffY / 2;

            // Middle zoom is the same as the current zoom if it is bigger than the new zoom
            let middleZoom;
            // Bounce out a bit if the zooms are within 10% of each other
            if (k > 5 && diffZoom < Math.max(mapZoom, k) / 2) {
                middleZoom = Math.min(mapZoom / 2, 5);
            } else {
                middleZoom = Math.min(mapZoom, k);
            }

            features
                .transition()
                .duration(800)
                .attr(
                    'transform',
                    `translate(${width / 2}, ${height / 2}) scale(${middleZoom}) translate(${-x}, ${-y})`
                )
                .transition()
                .duration(600)
                .attr('transform', `translate(${width / 2}, ${height / 2}) scale(${k}) translate(${-x}, ${-y})`);
        } else {
            features
                .transition()
                .duration(1000)
                .attr('transform', `translate(${width / 2}, ${height / 2}) scale(${k}) translate(${-x}, ${-y})`);
        }

        mapX = x;
        mapY = y;
        mapZoom = k;

        this.setState({ electorate });
    }
}

module.exports = Map;
