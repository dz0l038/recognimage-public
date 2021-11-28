import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Gallery.scss';
import { Box, LinearProgress, Typography, IconButton, CircularProgress } from '@material-ui/core';
import AddButton from './AddButton/AddButton';
import ImageHelper from '../../utils/API/imageHelper';
import DisplayGallery from '../DisplayGallery/DisplayGallery';
import PlanHelper from '../../utils/API/planHelper';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import NavigateNext from '@material-ui/icons/NavigateNext';

class Gallery extends Component {
    state = {
        loading: false,
        disabled: false,
        listImages: [],
        imagesCount: null,
        listToken: [null],
        currentIndexToken: 0,
        folderIdLast: null,
        uploaded: 0,
        uploadTotal: 0,
        analyseMax: 0,
        analyseUsed: 0,
        endDate: null,
        lastAdd: null,
    }
    constructor() {
        super()
        this.onAdd = this.onAdd.bind(this);
        this.handleNextPage = this.handleNextPage.bind(this);
        this.handlePreviousPage = this.handlePreviousPage.bind(this);
    }

    componentDidMount() {
        // Query the pictures list
        if (this.props.folderId && this.props.folderId !== this.state.folderIdLast) {
            this.updateComponant();
        }
    }

    componentDidUpdate() {
        if (this.props.folderId && this.props.folderId !== this.state.folderIdLast) {
            this.updateComponant();
            this.setState({
                folderIdLast: this.props.folderId,
            })
        }
    }

    updateComponant() {
        this.setState({
            listToken: [null],
            currentIndexToken: 0,
        })
        this.getImagesCount();
        this.getPictures();
        this.getPlan();
    }

    async getImagesCount() {
        const imagesCount = await ImageHelper.getImageCountByFolderId(this.props.folderId)
        this.setState({
            imagesCount: imagesCount,
        })
    }

    async getPictures(nextToken = null, updateToken = true) {
        this.setState({ loading: true })
        let [images, nextTokenReceived] = await ImageHelper.getImageByFolderId(this.props.folderId, nextToken, 50)
        this.setState({
            listImages: images,
        })
        if (updateToken && nextTokenReceived) this.updateTokenList(nextTokenReceived)
        this.setState({ loading: false })
    }

    handleNextPage() {
        let updateToken = false;
        if (this.state.listToken.length <= this.state.currentIndexToken + 2) updateToken = true
        this.getPictures(this.state.listToken[this.state.currentIndexToken + 1], updateToken);
        this.setState({ currentIndexToken: this.state.currentIndexToken + 1 })
    }

    handlePreviousPage() {
        this.getPictures(this.state.listToken[this.state.currentIndexToken - 1], false);
        this.setState({ currentIndexToken: this.state.currentIndexToken - 1 })
    }

    updateTokenList(nextToken) {
        let newTokenList = this.state.listToken;
        newTokenList.push(nextToken);
        this.setState({ listToken: newTokenList });
    }


    async getPlan() {
        let planInfo = await PlanHelper.getPlanByFolderId(this.props.folderId);
        console.log("Used:" + planInfo.usedUpload)
        if (!planInfo) return
        this.setState({
            analyseMax: planInfo.maxUpload,
            analyseUsed: planInfo.usedUpload,
            endDate: planInfo.endDate,
        })
    }

    async checkNoNewUpdate(uploadDate) {
        // Wait 5 second and check if the state lastAdd have changed, if not stop the loading
        setTimeout(function () {
            if (uploadDate === this.state.lastAdd) {
                this.setState({ disabled: false })
                this.updateComponant()
            }
        }.bind(this), 5000);
    }

    onAdd(uploaded, uploadTotal) {
        // Start to load
        let uploadDate = new Date();
        this.setState({ disabled: true, uploaded: uploaded, uploadTotal: uploadTotal, lastAdd: uploadDate, imagesCount: null })
        // Stop loading if nothing happen for few seconds
        this.checkNoNewUpdate(uploadDate);

        // If we are done, wait few second to let some time to lambdas to process last images
        if (uploadTotal === uploaded) {
            setTimeout(function () {
                this.setState({ disabled: false })
                this.updateComponant()
            }.bind(this), 3000);
        }
    }

    render() {
        const { disabled, listImages, uploaded, uploadTotal, analyseMax, imagesCount, listToken, currentIndexToken, loading } = this.state;
        const { folderId, userSub, maxDimension, maxDimensionThumb } = this.props;
        let completed = uploaded * 100 / uploadTotal;
        let planAnalyseUsed = imagesCount ? imagesCount * 100 / analyseMax : 0 ;
        let canStillAdd = 0;
        if (analyseMax !== null && imagesCount !== null) {
            canStillAdd = analyseMax - imagesCount;
        }

        let isNext = listToken.length - 1 > currentIndexToken ? true : false;
        let isPrevious = currentIndexToken >= 1 ? true : false;
        let NavView = <Box display="flex" flexDirection="row" flexWrap="wrap" alignItems='center' padding={1}>
            <IconButton onClick={this.handlePreviousPage} disabled={isPrevious ? false : true} aria-label="previous">
                <NavigateBefore fontSize="large" />
            </IconButton>
            <Box flexGrow={1} />
            <IconButton onClick={this.handleNextPage} disabled={isNext ? false : true} aria-label="next">
                <NavigateNext fontSize="large" />
            </IconButton>
        </Box>

        return (
            <Box>
                <Box marginTop='1em' marginBottom='1em'>
                    <Typography>You analysed <b>{imagesCount !== null ? imagesCount : "..."}/{analyseMax}</b> images</Typography>
                    <div style={{ width: '70%' }}>
                        <LinearProgress variant="determinate" value={planAnalyseUsed} color="secondary" />
                    </div>
                </Box>
                <Box marginBottom={2}>
                    <AddButton
                        onAdd={this.onAdd}
                        disabled={disabled || canStillAdd < 1}
                        maxSize={maxDimension}
                        thumbMaxSize={maxDimensionThumb}
                        folderId={folderId}
                        userSub={userSub}
                        maxImgs={canStillAdd} />
                    {
                        disabled ?
                            <Box marginTop='1em' marginBottom='1em'>
                                <Typography>{uploaded}/{uploadTotal}</Typography>
                                <div style={{ width: '70%' }}>
                                    <LinearProgress variant="determinate" value={completed} color="secondary" />
                                </div>
                            </Box>
                            :
                            null
                    }
                </Box>
                {NavView}
                {
                    loading ?
                        <Box display="flex"><Box flexGrow={1} /><CircularProgress /><Box flexGrow={1} /></Box>
                        :
                        <DisplayGallery listImages={listImages} />
                }
                {NavView}
            </Box>
        );
    }
}

Gallery.propTypes = {
    query: PropTypes.string,
    update: PropTypes.string,
    delete: PropTypes.string,
    create: PropTypes.string,
    maxImgs: PropTypes.number,
    maxDimension: PropTypes.number,
    maxDimensionThumb: PropTypes.number,
    folderId: PropTypes.string,
    userSub: PropTypes.string,
};

export default Gallery;