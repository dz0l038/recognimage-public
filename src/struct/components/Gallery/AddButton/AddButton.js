import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './AddButton.scss';
import { Box, Button, Typography } from '@material-ui/core';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import uuid from 'react-uuid';
import { Storage } from "aws-amplify";

const defautMaxSize = 1000;
const defaultThumbMaxSize = 100;
const qualityCompression = 0.7;

class AddButton extends Component {
    state = {
        error: null,
    }
    constructor() {
        super()
        this.handleAdd = this.handleAdd.bind(this)
    }

    delay = ms => new Promise(res => setTimeout(res, ms));

    handleAdd = async (event) => {
        event.persist();
        // Check files selected
        if (!event || !event.target || !event.target.files) return
        const filesLength = event.target.files.length;
        if (filesLength > this.props.maxImgs) {
            this.setState({
                error: "You cannot add " + filesLength + " images based on your current plan."
            })
            return
        } else {
            this.setState({
                error: null
            })
        }
        // Inform the parent that the user start to add pictures
        if (this.props.onAdd) this.props.onAdd(0, event.target.files.length)
        // Loop through all selected files
        for (let i = 0; i < filesLength; i++) {
            await this.delay(300)
            let file = event.target.files[i];
            let filename = file.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            let fileExtension = file.name.split('.').pop();
            let userSub = this.props.userSub;

            // Define name (with path) for full image and thumbnail
            let mainImgName = this.props.folderId + '/' + userSub + '/' + filename + '-' + uuid();
            let thumbnailImgName = mainImgName + '-thumbnail';

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = event => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    // Resize
                    let maxSize = defautMaxSize;
                    let thumbMaxSize = defaultThumbMaxSize;
                    if (this.props.maxSize) { maxSize = this.props.maxSize }
                    if (this.props.thumbMaxSize) { thumbMaxSize = this.props.thumbMaxSize }

                    // For the main Image
                    const elemMain = document.createElement('canvas');
                    if (img.width > img.height) {
                        const widthMain = maxSize;
                        const scaleFactorMain = widthMain / img.width;
                        elemMain.width = widthMain;
                        elemMain.height = img.height * scaleFactorMain;
                    } else {
                        const heightMain = maxSize;
                        const scaleFactorMain = heightMain / img.height;
                        elemMain.width = img.width * scaleFactorMain;
                        elemMain.height = heightMain;
                    }
                    // Create the file and push it
                    const ctxMain = elemMain.getContext('2d');
                    ctxMain.drawImage(img, 0, 0, elemMain.width, elemMain.height);
                    ctxMain.canvas.toBlob((blob) => {
                        const fileMain = new File([blob], filename, {
                            type: 'image/jpeg',
                            lastModified: Date.now()
                        });
                        this.pushNewImgOnS3(fileMain, mainImgName + '.' + fileExtension, i, filesLength)
                    }, 'image/jpeg', qualityCompression);


                    // For the thumbnail
                    const elemThumb = document.createElement('canvas');
                    if (img.width > img.height) {
                        const widthThumb = thumbMaxSize;
                        const scaleFactor = widthThumb / img.width;
                        elemThumb.width = widthThumb;
                        elemThumb.height = img.height * scaleFactor;
                    } else {
                        const heightThumb = thumbMaxSize;
                        const scaleFactor = heightThumb / img.height;
                        elemThumb.width = img.width * scaleFactor;
                        elemThumb.height = heightThumb;
                    }

                    const ctxThumb = elemThumb.getContext('2d');
                    ctxThumb.drawImage(img, 0, 0, elemThumb.width, elemThumb.height);
                    ctxThumb.canvas.toBlob((blob) => {
                        const fileThumb = new File([blob], filename, {
                            type: 'image/jpeg',
                            lastModified: Date.now()
                        });
                        this.pushNewImgOnS3(fileThumb, thumbnailImgName + '.' + fileExtension)
                    }, 'image/jpeg', qualityCompression);
                }
                reader.onerror = error => console.log(error);
            }
        }
    }

    async pushNewImgOnS3(uri, filename, index = null, totalLenght = null) {
        if (uri === null) return
        // Push the image
        await Storage.put(filename, uri, {
            level: 'protected',
            contentType: 'image/*'
        })
            .then(result => { return result.key })
            .catch(err => console.log(err));
        if (this.props.onAdd && index && totalLenght) this.props.onAdd(index + 1, totalLenght)
    }


    render() {
        const { disabled, maxImgs } = this.props;
        const { error } = this.state;
        return (
            <Box className="add-container">
                <input
                    accept="image/jpeg"
                    style={{ display: 'none' }}
                    id="button-add-picture-user"
                    multiple
                    type="file"
                    onChange={this.handleAdd}
                    disabled={disabled || maxImgs < 1}
                />
                <label htmlFor="button-add-picture-user">
                    <Button disabled={disabled} className="add-button" variant="contained" size="large" color="secondary" component="span">
                        <AddAPhotoIcon />
                    </Button>
                </label>
                {
                    error?
                    <Typography style={{color: 'red'}}>{error}</Typography>
                    :
                    null
                }
            </Box>
        );
    }
}

AddButton.propTypes = {
    onAdd: PropTypes.func,
    disabled: PropTypes.bool,
    maxSize: PropTypes.number,
    thumbMaxSize: PropTypes.number,
    folderId: PropTypes.string,
    userSub: PropTypes.string,
    maxImgs: PropTypes.number,
};

export default AddButton;