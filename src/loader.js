const { getSections, getMarkers } = window.__ODYSSEY__.utils.anchors;

function alternatingCaseToObject(string) {
    let o = {};
    const config = string.match(/[A-Z]+[0-9a-z]+/g);

    if (!config) return {};

    config.forEach(match => {
        const [, key, value] = match.match(/([A-Z]+)([0-9a-z]+)/);
        o[key.toLowerCase()] = value;
    });

    return o;
}

function initSections(names) {
    let sections = {};

    getSections(names).forEach(section => {
        let html = '';
        section.betweenNodes.forEach(node => {
            if (node.style && node.outerHTML) {
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

function initMarkers(name, section) {
    // ABC colours
    const colours = [
        '#3C6998',
        '#B05154',
        '#1B7A7D',
        '#8D4579',
        '#97593F',
        '#605487',
        '#306C3F'
    ];

    return getMarkers(name).map((marker, index) => {
        marker.config = alternatingCaseToObject(marker.configSC);

        // While has next sibling and next sibling is valid (not a marker and not null)
        let nextNode = marker.node.nextSibling;
        let html = '';
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
                if (nextNode.outerHTML) {
                    nextNode.style.setProperty('display', '');
                    html += nextNode.outerHTML;
                    nextNode.style.setProperty('display', 'none');
                }
                nextNode = nextNode.nextSibling;
            }
        }
        marker.html = html;
        marker.colour = colours[index % colours.length];
        return marker;
    });
}

module.exports = { initMarkers, initSections };
