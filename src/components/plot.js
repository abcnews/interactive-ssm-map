const Preact = require('preact');
const Immutable = require('immutable');
const scale = require('../data/colour-scale');

const styles = require('./plot.scss');

class Plot extends Preact.Component {
    constructor(props) {
        super(props);

        this.state = {
            sortBy: null
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!Immutable.is(nextProps.data, this.props.nextData)) {
            this.colour = scale(nextProps.data);
        }
    }

    render() {
        const { data } = this.props;

        if (!data) return null;

        let sortedData;
        switch (this.state.sortBy) {
            case 'asc':
                sortedData = data.sortBy(d => d.get('value'));
                break;
            case 'desc':
                sortedData = data.sortBy(d => 0 - d.get('value'));
                break;
            default:
                sortedData = data.sortBy(d => d.get('name'));
        }

        return (
            <div className={styles.wrapper}>
                <button onClick={e => this.setState({ sortBy: null })}>
                    A-Z
                </button>
                <button onClick={e => this.setState({ sortBy: 'asc' })}>
                    Low-High
                </button>
                <button onClick={e => this.setState({ sortBy: 'desc' })}>
                    High-Low
                </button>

                <div className={styles.table}>
                    {sortedData
                        .toList()
                        .map(datum => {
                            return (
                                <div className={styles.row}>
                                    <div className={styles.name}>
                                        {datum.get('name')}
                                    </div>
                                    <div className={styles.support}>
                                        <div className={styles.bar}>
                                            <div
                                                className={styles.barValue}
                                                style={{
                                                    width: `${100 *
                                                        datum.get('value')}%`,
                                                    backgroundColor: this.colour(
                                                        datum.get('value')
                                                    )
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                        .toJS()}
                </div>
            </div>
        );
    }
}

module.exports = Plot;
