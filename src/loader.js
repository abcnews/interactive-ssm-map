const { getSections, getMarkers } = window.__ODYSSEY__.utils.anchors;

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

function initSections(names) {
    let sections = {};

    getSections(names).forEach(section => {
        let html = '';
        section.betweenNodes.forEach(node => {
            if (
                node.style &&
                node.outerHTML &&
                node.className.indexOf('full') < 0
            ) {
                node.style.setProperty('display', '');
                html += node.outerHTML;
                node.style.setProperty('display', 'none');
            }
        });
        section.html = html;

        sections[section.name] = section;
    });

    return sections;
}

// Create markers from actual markers and anything that follows them within the section
function initMarkers(name, section) {
    let markers = [];

    getMarkers(name).forEach((marker, index) => {
        marker.config = alternatingCaseToObject(marker.configSC);

        // While has next sibling and next sibling is valid (not a marker and not null)
        let nextNode = marker.node.nextSibling;
        while (nextNode) {
            // Found the next marker
            if (
                nextNode.getAttribute &&
                nextNode.getAttribute('name') &&
                nextNode.getAttribute('name').indexOf(name) === 0
            ) {
                nextNode = null;
            } else if (
                nextNode.getAttribute &&
                nextNode.getAttribute('name') === 'end' + section
            ) {
                // This is the end of the whole section
                nextNode = null;
            } else {
                // For each following <p> tag create a new marker
                if (nextNode.tagName === 'P') {
                    nextNode.style.setProperty('display', '');
                    markers.push({
                        config: marker.config,
                        html: nextNode.outerHTML
                    });
                    nextNode.style.setProperty('display', 'none');
                }

                nextNode = nextNode.nextSibling;
            }
        }
    });

    return markers;
}

module.exports = { initMarkers, initSections };
