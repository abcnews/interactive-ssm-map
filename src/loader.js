require('es6-promise/auto');
require('isomorphic-fetch');

const arrayFrom = require('array-from');
const Immutable = require('immutable');

function getData() {
    const root = document.querySelector(
        '[data-interactive-marriage-equality-root]'
    );

    return fetch(root.getAttribute('data-data-url'))
        .then(r => r.text())
        .then(text => {
            let data = {};
            text.split('\n').slice(1).forEach(row => {
                row = row.split(',');
                if (row.length === 2) {
                    data[row[0].toUpperCase()] = {
                        name: row[0],
                        value: parseFloat(row[1])
                    };
                }
            });
            return Immutable.fromJS(data);
        })
        .catch(error => {
            console.error(error);
        });
}

// Load any scrollyteller content from Odyssey
let scrollytellers;
function getScrollytellers() {
    if (!scrollytellers) {
        scrollytellers = window.__ODYSSEY__.utils.anchors
            .getSections('scrollyteller')
            .map(section => {
                section.mountNode = document.createElement('div');
                section.mountNode.className = 'u-full';
                section.startNode.parentNode.insertBefore(
                    section.mountNode,
                    section.startNode
                );

                section.markers = initMarkers(section, 'mark');

                return section;
            });
    }
    return scrollytellers;
}

let charts;
function getCharts() {
    if (!charts) {
        charts = arrayFrom(
            document.querySelectorAll('[name="chart"]')
        ).map(node => {
            node.mountNode = document.createElement('div');
            node.parentNode.insertBefore(node.mountNode, node);

            return node;
        });
    }
    return charts;
}

// Create markers from actual markers and anything that follows them within the section
function initMarkers(section, name) {
    let markers = [];

    let config = {};

    section.betweenNodes.forEach(node => {
        if (
            node.tagName === 'A' &&
            node.getAttribute('name') &&
            node.getAttribute('name').indexOf(name) === 0
        ) {
            config = alternatingCaseToObject(
                node.getAttribute('name').replace(new RegExp(`^${name}`), '')
            );
        }

        if (node.tagName === 'P') {
            markers.push({ config, node });
        }
    });

    return markers;
}

function alternatingCaseToObject(string) {
    const config = string.match(/[A-Z]+[0-9a-z]+/g);

    if (!config) return {};

    let o = {};

    config.forEach(match => {
        let [, key, value] = match.match(/([A-Z]+)([0-9a-z]+)/);
        key = key.toLowerCase();

        if (o[key]) {
            // Key exists so treat it as a list
            if (!(o[key] instanceof Array)) {
                o[key] = [o[key]];
            }
            o[key].push(value);
        } else {
            o[key] = value;
        }
    });

    return o;
}

module.exports = { getData, getScrollytellers, getCharts };
