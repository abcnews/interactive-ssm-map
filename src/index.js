const Preact = require('preact');
const { getData, getScrollytellers, getCharts } = require('./loader');

const init = () => {
    getData().then(data => {
        getScrollytellers().forEach(section =>
            render(section.mountNode, data, section)
        );
        getCharts().forEach(chart => render(chart.mountNode, data));
    });
};

let render = (element, data, section) => {
    let App = require('./components/app');
    Preact.render(
        <App section={section} data={data} />,
        element,
        element.lastChild
    );
};

// Do some hot reload magic with errors
if (process.env.NODE_ENV !== 'production' && module.hot) {
    // Wrap the actual renderer in an error trap
    let renderFunction = render;
    render = (element, data, section) => {
        try {
            renderFunction(element, data, section);
        } catch (e) {
            // Render the error to the screen in place of the actual app
            const ErrorBox = require('./error-box');
            Preact.render(<ErrorBox error={e} />, element, element.lastChild);
        }
    };

    // If a new app build is detected try rendering it
    module.hot.accept('./components/app', () => {
        setTimeout(init);
    });
}

if (window.__ODYSSEY__) {
    init();
} else {
    window.addEventListener('odyssey:api', init);
}
