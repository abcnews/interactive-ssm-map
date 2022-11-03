const { Component, h } = require("preact");

const Scrolly = require("./scrolly");
const Plot = require("./plot");

class App extends Component {
  render() {
    const { data, section } = this.props;

    if (section) {
      return <Scrolly section={section} data={data} />;
    } else {
      return <Plot data={data} />;
    }
  }
}

module.exports = App;
