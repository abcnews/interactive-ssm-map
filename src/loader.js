const Odyssey = window.__ODYSSEY__;
const { getMarkers } = Odyssey.utils.anchors;

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

function initMarkers(name) {
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
            } else {
                if (nextNode.outerHTML) {
                    nextNode.style.setProperty('display', '');
                    html += nextNode.outerHTML;
                    nextNode.style.setProperty('display', 'none');
                }
                nextNode = nextNode.nextSibling;

                // TODO: Work out how to keep a cache of the old DOM so hot reload works nicely
                // Remove current article from the DOM
                // if (nextNode) {
                //     nextNode.previousSibling.remove();
                // }
            }
        }
        marker.html = html;
        marker.colour = colours[index % colours.length];
        return marker;
    });
}

module.exports = { initMarkers };
