import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './DisplayGallery.scss';
import { Box } from '@material-ui/core';
import DisplayImage from '../DisplayImage/DisplayImage';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { bucketName } from '../../utils/Parameters';

class DisplayGallery extends Component {
    constructor() {
        super()
        this.onClick = this.onClick.bind(this)
        this.handleClose = this.handleClose.bind(this)
    }
    state = {
        listImagesRaw: null,
        listKey: [],
        listUrl: [],
        listUrlFullSize: [],
        dialogOpen: false,
        photoIndex: 0,
    }
    componentDidMount() {
        if (this.state.listImagesRaw !== this.props.listImages) { this.updateS3UrlList(this.props.listImages) }
    }

    componentDidUpdate() {
        if (this.state.listImagesRaw !== this.props.listImages) { this.updateS3UrlList(this.props.listImages) }
    }

    handleClose() {
        this.setState({ dialogOpen: false });
    }

    async updateS3UrlList(list) {
        let listUrl = [];
        let listUrlFullSize = [];
        for (let i = 0; i < list.length; i++) {
            let thumbKey = list[i].key.split('.').slice(0, -1).join('.') + "-thumbnail." + list[i].key.split('.').pop();
            listUrl.push(bucketName + thumbKey);
            listUrlFullSize.push(bucketName + thumbKey.replace('-thumbnail', ''));
        }
        this.setState({ listUrl: listUrl, listUrlFullSize: listUrlFullSize, listImagesRaw: this.props.listImages })
    }

    onClick(setIndex) {
        if (!this.props.disableFullSize) this.setState({ dialogOpen: true, photoIndex: setIndex });
        if (this.props.onImageClick) this.props.onImageClick(setIndex)
    }

    render() {
        const { listUrl, listUrlFullSize, dialogOpen, photoIndex } = this.state;
        return (
            <Box className="DisplayGallery" display="flex" flexDirection="row" flexWrap="wrap">
                {
                    listUrl.map(function (url, index) {
                        return <DisplayImage key={index} index={index} url={url} onClick={this.onClick} />;
                    }.bind(this))
                }

                {dialogOpen && (
                    <Lightbox
                        reactModalStyle={{overlay: {zIndex: 1500}}}
                        mainSrc={listUrlFullSize[photoIndex]}
                        nextSrc={listUrlFullSize[(photoIndex + 1) % listUrlFullSize.length]}
                        prevSrc={listUrlFullSize[(photoIndex + listUrlFullSize.length - 1) % listUrlFullSize.length]}
                        onCloseRequest={() => this.setState({ dialogOpen: false })}
                        onMovePrevRequest={() =>
                            this.setState({
                                photoIndex: (photoIndex + listUrlFullSize.length - 1) % listUrlFullSize.length,
                            })
                        }
                        onMoveNextRequest={() =>
                            this.setState({
                                photoIndex: (photoIndex + 1) % listUrlFullSize.length,
                            })
                        }
                    />
                )}
            </Box>
        );
    }
}

DisplayGallery.propTypes = {
    disabled: PropTypes.bool,
    listImages: PropTypes.array,
    disableFullSize: PropTypes.bool,
    onImageClick: PropTypes.func,
};

export default DisplayGallery;