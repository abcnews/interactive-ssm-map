const Preact = require('preact');

const root = document.querySelector(
    '[data-interactive-marriage-equality-root]'
);

// Do some DOM magic to find a place to mount the map
const mapLocation = document.querySelector('[name="scrollyteller"]');
const mapElement = document.createElement('div');
mapElement.className = mapElement.className += ' u-full';
mapLocation.parentNode.insertBefore(mapElement, mapLocation.nextSibling);

// Do some DOM magic to find a place to mount the chart
const chartLocation = document.querySelector('[name="chart"]');
const chartElement = document.createElement('div');
chartLocation.parentNode.insertBefore(chartElement, chartLocation.nextSibling);

let render = () => {
    let App = require('./components/app');
    Preact.render(
        <App view="map" dataURL={root.getAttribute('data-data-url')} />,
        mapElement,
        mapElement.lastChild
    );

    Preact.render(
        <App view="chart" dataURL={root.getAttribute('data-data-url')} />,
        chartElement,
        chartElement.lastChild
    );
};

// Do some hot reload magic with errors
if (process.env.NODE_ENV !== 'production' && module.hot) {
    // Wrap the actual renderer in an error trap
    let renderFunction = render;
    render = () => {
        try {
            renderFunction();
        } catch (e) {
            // Render the error to the screen in place of the actual app
            const ErrorBox = require('./error-box');
            mapRoot = Preact.render(<ErrorBox error={e} />, element, mapRoot);
        }
    };

    // If a new app build is detected try rendering it
    module.hot.accept('./components/app', () => {
        setTimeout(render);
    });
}

if (window.__ODYSSEY__) {
    render();
} else {
    window.addEventListener('odyssey:api', e => {
        render();
    });
}
