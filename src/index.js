const Preact = require('preact');
const arrayFrom = require('array-from');

const root = document.querySelector(
    '[data-interactive-marriage-equality-root]'
);

// Add a mount point to each of the sections
let scrollytellers;
let charts;
const init = () => {
    scrollytellers = window.__ODYSSEY__.utils.anchors
        .getSections('scrollyteller')
        .map(section => {
            section.mountNode = document.createElement('div');
            section.mountNode.className = 'u-full';
            section.startNode.parentNode.insertBefore(
                section.mountNode,
                section.startNode
            );

            return section;
        });

    // Add a mount point to each of the charts
    charts = arrayFrom(
        document.querySelectorAll('[name="chart"]')
    ).map(node => {
        node.mountNode = document.createElement('div');
        node.parentNode.insertBefore(node.mountNode, node);

        return node;
    });

    renderAll();
};

const renderAll = () => {
    scrollytellers.forEach(section => render(section.mountNode, section));
    charts.forEach(chart => render(chart.mountNode));
};

let render = (element, section) => {
    let App = require('./components/app');
    Preact.render(
        <App section={section} dataURL={root.getAttribute('data-data-url')} />,
        element,
        element.lastChild
    );
};

// Do some hot reload magic with errors
if (process.env.NODE_ENV !== 'production' && module.hot) {
    // Wrap the actual renderer in an error trap
    let renderFunction = render;
    render = (element, section) => {
        try {
            renderFunction(element, section);
        } catch (e) {
            // Render the error to the screen in place of the actual app
            const ErrorBox = require('./error-box');
            Preact.render(<ErrorBox error={e} />, element, element.lastChild);
        }
    };

    // If a new app build is detected try rendering it
    module.hot.accept('./components/app', () => {
        setTimeout(renderAll);
    });
}

if (window.__ODYSSEY__) {
    init();
} else {
    window.addEventListener('odyssey:api', init);
}
