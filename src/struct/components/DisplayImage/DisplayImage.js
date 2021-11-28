import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './DisplayImage.scss';
import { Box } from '@material-ui/core';

class DisplayImage extends Component {
    constructor() {
        super();
        this.onClick = this.onClick.bind(this)
    }
    
    state = {
        urlDisplay: null,
    }

    componentDidMount() {
        if (this.state.urlDisplay !== this.props.url) { this.updateUrl(this.props.url) }
    }

    componentDidUpdate() {
        if (this.state.urlDisplay !== this.props.url) { this.updateUrl(this.props.url) }
    }

    updateUrl(url) {
        this.setState({ urlDisplay: url })
    }

    onClick() {
        if (this.props.onClick) this.props.onClick(this.props.index)
    }

    render() {
        const { urlDisplay } = this.state;
        return (
            <Box className="DisplayImage" onClick={this.onClick}
                style={{
                    backgroundImage: "url(" + urlDisplay + ")",
                }} >
            </ Box>
        );
    }
}

DisplayImage.propTypes = {
    index: PropTypes.number,
    url: PropTypes.string,
    onClick: PropTypes.func,
};

export default DisplayImage;