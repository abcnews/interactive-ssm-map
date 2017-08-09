require('es6-promise/auto');
require('isomorphic-fetch');

const Preact = require('preact');
const Immutable = require('immutable');

const Scrolly = require('./scrolly');
const Plot = require('./plot');

class App extends Preact.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null
        };
    }

    componentDidMount() {
        let data = {};
        fetch(this.props.dataURL).then(r => r.text()).then(text => {
            text.split('\n').slice(1).forEach(row => {
                row = row.split(',');

                if (row.length === 2) {
                    data[row[0].toUpperCase()] = {
                        name: row[0],
                        value: parseFloat(row[1])
                    };
                }
            });

            this.setState({ data: Immutable.fromJS(data) });
        });
    }

    render() {
        return (
            <div>
                <Scrolly data={this.state.data} />
                <Plot data={this.state.data} />
            </div>
        );
    }
}

module.exports = App;
