const { h, render } = require('preact');
const { getData, getScrollytellers, getCharts } = require('./loader');

const init = () => {
    getData().then(data => {
        getScrollytellers().forEach(section => mount(section.mountNode, data, section));
        getCharts().forEach(chart => mount(chart.mountNode, data));
    });
};

let mount = (element, data, section) => {
    let App = require('./components/app');
    render(<App section={section} data={data} />, element, element.lastChild);
};

// Do some hot reload magic with errors
if (module.hot) {
    // Wrap the actual mounter in an error trap
    let mountFunction = mount;
    mount = (element, data, section) => {
        try {
            mountFunction(element, data, section);
        } catch (e) {
            // Render the error to the screen in place of the actual app
            const ErrorBox = require('./error-box');
            render(<ErrorBox error={e} />, element, element.lastChild);
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
