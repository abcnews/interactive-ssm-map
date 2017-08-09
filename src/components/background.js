const Preact = require('preact');

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
            </div>
        );
    }
}

module.exports = Background;
