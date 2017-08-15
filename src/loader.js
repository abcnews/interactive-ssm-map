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

// Create markers from actual markers and anything that follows them within the section
function initMarkers(section, name) {
    let markers = [];

    let config = {};

    section.betweenNodes.forEach(node => {
        if (node.style) {
            node.style.setProperty('display', '');
        }

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
            markers.push({
                config,
                html: node.outerHTML
            });
        }

        if (node.style) {
            node.style.setProperty('display', 'none');
        }
    });

    return markers;
}

module.exports = { initMarkers };
