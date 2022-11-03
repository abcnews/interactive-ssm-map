const { Component, h } = require("preact");

const styles = require("./marker.scss");

class Marker extends Component {
  constructor(props) {
    super(props);

    this.ref = this.ref.bind(this);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    this.element.removeChild(this.props.marker.node);
  }

  render() {
    const { reference, className } = this.props;

    return (
      <div ref={reference} className={`${styles.wrapper} ${className || ""}`}>
        <div className={`u-richtext-invert ${styles.detail}`} ref={this.ref} />
      </div>
    );
  }

  ref(element) {
    if (!element) return;
    if (!this.props.marker.node) return;

    this.element = element;
    this.element.appendChild(this.props.marker.node);
  }
}

module.exports = Marker;
