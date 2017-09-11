const { Component, h } = require('preact');

const { initMarkers } = require('../loader');
const Marker = require('./marker');
const Background = require('./background');

const styles = require('./scrolly.scss');

class Scrolly extends Component {
    constructor(props) {
        super(props);

        this.onScroll = this.onScroll.bind(this);

        this.state = {
            markers: props.section.markers,
            currentMarker: null,
            isBackgroundFixed: false
        };
    }

    componentDidMount() {
        window.__ODYSSEY__.scheduler.subscribe(this.onScroll);
    }

    componentWillUnmount() {
        window.__ODYSSEY__.scheduler.unsubscribe(this.onScroll);
    }

    onScroll(view) {
        // Work out which marker is the current one
        const fold = view.height * 0.4;
        const pastMarkers = this.state.markers.filter(marker => {
            return marker.element && marker.element.getBoundingClientRect().top < fold;
        });

        let lastSeenMarker = pastMarkers[pastMarkers.length - 1];
        if (!lastSeenMarker) lastSeenMarker = this.state.markers[0];
        if (this.state.currentMarker !== lastSeenMarker) {
            this.setState({
                currentMarker: lastSeenMarker
            });
        }

        // Work out if the background should be fixed or not
        if (this.wrapper) {
            const bounds = this.wrapper.getBoundingClientRect();

            let backgroundAttachment;
            if (bounds.top > 0) {
                backgroundAttachment = 'before';
            } else if (bounds.bottom < view.height) {
                backgroundAttachment = 'after';
            } else {
                backgroundAttachment = 'during';
            }

            this.setState({ backgroundAttachment });
        }
    }

    render() {
        if (!this.props.data) return null;

        return (
            <div ref={el => (this.wrapper = el)} className={styles.wrapper}>
                <Background
                    data={this.props.data}
                    marker={this.state.currentMarker}
                    attachment={this.state.backgroundAttachment}
                />
                {this.state.markers.map((marker, index) => {
                    let markerClass = '';

                    if (index === 0) markerClass = styles.firstMarker;
                    if (index === this.state.markers.length - 1) markerClass = styles.lastMarker;

                    return (
                        <Marker
                            marker={marker}
                            reference={el => (marker.element = el)}
                            isCurrentMarker={this.state.currentMarker === marker}
                            className={markerClass}
                        />
                    );
                })}
            </div>
        );
    }
}

module.exports = Scrolly;
