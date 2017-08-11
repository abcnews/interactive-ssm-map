const Preact = require('preact');
const { colours } = require('../data/colour-scale');

const Map = require('./map');
const styles = require('./background.scss');

class Background extends Preact.Component {
    render() {
        const { isFixed, marker } = this.props;

        return (
            <div
                ref={el => (this.wrapper = el)}
                className={`${styles.wrapper} ${styles[
                    this.props.attachment
                ]}`}>
                <Map data={this.props.data} marker={marker} />
                <div className={styles.legend}>
                    <div className={styles.legendTitle}>Same sex marriage</div>
                    <div
                        className={styles.legendBar}
                        style={{
                            background: `linear-gradient(90deg, ${colours[0]}, ${colours[
                                Math.floor(colours.length / 2)
                            ]} 50%, ${colours[colours.length - 1]}`
                        }}
                    />
                    <div className={styles.legendLabels}>
                        <div className={styles.legendLabel}>
                            &larr; Less support
                        </div>
                        <div className={styles.legendLabel}>
                            More support &rarr;
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = Background;
