const { Component, h } = require('preact');
const Immutable = require('immutable');
const scale = require('../data/colour-scale');

const styles = require('./plot.scss');

class Plot extends Component {
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
                <div className={styles.toolbar}>
                    <button
                        onClick={e => this.setState({ sortBy: null })}
                        className={this.state.sortBy === null ? styles.activeButton : ''}>
                        A-Z
                    </button>
                    <button
                        onClick={e => this.setState({ sortBy: 'asc' })}
                        className={this.state.sortBy === 'asc' ? styles.activeButton : ''}>
                        Low-High
                    </button>
                    <button
                        onClick={e => this.setState({ sortBy: 'desc' })}
                        className={this.state.sortBy === 'desc' ? styles.activeButton : ''}>
                        High-Low
                    </button>
                </div>

                <div className={styles.table}>
                    <div className={styles.row}>
                        <div className={styles.name} />
                        <div className={`${styles.support} ${styles.guide}`}>50%</div>
                    </div>
                    {sortedData
                        .toList()
                        .map(datum => {
                            const value = Math.round(100 * datum.get('value')) + '%';

                            return (
                                <div className={styles.row}>
                                    <div className={styles.name}>
                                        {datum.get('name')}
                                    </div>
                                    <div className={styles.support}>
                                        <div className={styles.bar}>
                                            <div
                                                aria-label={value}
                                                className={styles.barValue}
                                                style={{ width: value }}
                                            />
                                            <div className={styles.value}>
                                                {value}
                                            </div>
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
