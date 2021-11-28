import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './GallerySearch.scss';
import { Box, TextField, Grid, IconButton, CircularProgress } from '@material-ui/core';
import ImageHelper from '../../utils/API/imageHelper';
import DisplayGallery from '../DisplayGallery/DisplayGallery';
import Search from '@material-ui/icons/Search';
import MatchHelper from '../../utils/API/matchHelper';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import NavigateNext from '@material-ui/icons/NavigateNext';

class GallerySearch extends Component {
    state = {
        listImages: [],
        search: "",
        loading: false,
        listToken: [null],
        currentIndexToken: 0,
    }

    constructor() {
        super()
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
        this.getPictures();
    }

    async launchSearch(searchText, nextToken=null, updateToken = true) {
        this.setState({ loading: true })
        let [images, nextTokenReceived] = await MatchHelper.getImagesByMatch(this.props.folderId, searchText, nextToken, 100)
        // Remove duplicate
        let imageListClean = [];
        let listUniqueKey = [];
        for (let i = 0; i < images.length; i++) {
            if (!listUniqueKey.includes(images[i].key)) {
                imageListClean.push(images[i]);
                listUniqueKey.push(images[i].key);
            }
        }
        this.setState({
            listImages: imageListClean,
        })
        if (updateToken && nextTokenReceived) this.updateTokenList(nextTokenReceived)
        this.setState({ loading: false })
    }

    handleSearchChange = event => {
        if (event.target.value.length === 0) {
            // Get all
            this.getPictures();
        }
        if (event.target.value.length >= 2 ||
            (event.target.value.length < this.state.search && event.target.value.length >= 1)) {
            this.launchSearch(event.target.value);
        }
        this.setState({
            search: event.target.value,
            listToken: [null],
            currentIndexToken: 0,
        });
    };

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
        if (!this.state.search) {
            // Get all
            this.getPictures(this.state.listToken[this.state.currentIndexToken + 1], updateToken);
        } else {
            this.launchSearch(this.state.search, this.state.listToken[this.state.currentIndexToken + 1], updateToken);
        }
        this.setState({ currentIndexToken: this.state.currentIndexToken + 1 })
    }

    handlePreviousPage() {
        if (!this.state.search) {
            // Get all
            this.getPictures(this.state.listToken[this.state.currentIndexToken - 1], false);
        } else {
            this.launchSearch(this.state.search, this.state.listToken[this.state.currentIndexToken - 1], false);
        }
        this.setState({ currentIndexToken: this.state.currentIndexToken - 1 })
    }

    updateTokenList(nextToken) {
        let newTokenList = this.state.listToken;
        newTokenList.push(nextToken);
        this.setState({ listToken: newTokenList });
    }

    render() {
        const { listImages, search, listToken, currentIndexToken, loading } = this.state;

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
                <Box marginBottom={2}>
                    <Grid container spacing={1} alignItems="flex-end">
                        <Grid item>
                            <Search />
                        </Grid>
                        <Grid item>
                            <TextField id="input-with-icon-grid"
                                label="Search"
                                value={search}
                                onChange={this.handleSearchChange} />
                        </Grid>
                    </Grid>
                </Box>
                <Box>
                    {NavView}
                    {
                        loading ?
                            <Box display="flex"><Box flexGrow={1} /><CircularProgress /><Box flexGrow={1} /></Box>
                            :
                            <DisplayGallery listImages={listImages} />
                    }
                    {NavView}
                </Box>
            </Box>
        );
    }
}

GallerySearch.propTypes = {
    folderId: PropTypes.string,
};

export default GallerySearch;