import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './GalleryPublic.scss';
import { Box, TextField, Grid, CircularProgress, IconButton } from '@material-ui/core';
import ImageHelper from '../../utils/API/imageHelper';
import DisplayGallery from '../DisplayGallery/DisplayGallery';
import Search from '@material-ui/icons/Search';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import NavigateNext from '@material-ui/icons/NavigateNext';
import GeneralHelpers from '../../utils/Helpers/GeneralHelpers';

class GalleryPublic extends Component {
    constructor() {
        super();
        this.handleNextPage = this.handleNextPage.bind(this);
        this.handlePreviousPage = this.handlePreviousPage.bind(this);
    }

    state = {
        listImages: [],
        search: "",
        listToken: [null],
        currentIndexToken: 0,
        initSearch: '',
        loading: false,
    }

    componentDidMount() {
        if (this.props.initSearch && this.props.initSearch !== this.state.initSearch) {
            this.initSearchUpdate()
            return
        }
        if (this.props.folderId && this.props.folderId !== this.state.folderIdLast) {
            this.updateComponant();
        }
    }

    componentDidUpdate() {
        if (this.props.initSearch && this.props.initSearch !== this.state.initSearch) {
            this.initSearchUpdate()
            return
        }
        if (this.props.folderId && this.props.folderId !== this.state.folderIdLast) {
            this.updateComponant();
        }
    }

    updateComponant() {
        this.setState({
            folderIdLast: this.props.folderId,
        })
        this.getPictures();
    }

    initSearchUpdate() {
        this.setState({
            folderIdLast: this.props.folderId,
            initSearch: this.props.initSearch,
            search: this.props.initSearch,
        })
        if (this.props.initSearch.length === 0) {
            // Get all
            this.getPictures();
        } else {
            this.launchSearch(this.props.initSearch)
        }
    }

    handleNextPage() {
        if (!this.state.search) {
            // Get all
            this.getPictures(this.state.listToken[this.state.currentIndexToken + 1]);
        } else {
            this.launchSearch(this.state.search, this.state.listToken[this.state.currentIndexToken + 1]);
        }
        this.setState({ currentIndexToken: this.state.currentIndexToken + 1 })
    }

    handlePreviousPage() {
        if (!this.state.search) {
            // Get all
            this.getPictures(this.state.listToken[this.state.currentIndexToken - 1]);
        } else {
            this.launchSearch(this.state.search, this.state.listToken[this.state.currentIndexToken - 1]);
        }
        this.setState({ currentIndexToken: this.state.currentIndexToken - 1 })
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

    updateTokenList(nextToken) {
        let listKey = [null];
        this.state.listToken.forEach((token) => { if (token) listKey.push(GeneralHelpers.checkNested(token, 'key', 'S')) });
        let nextKey = GeneralHelpers.checkNested(nextToken, 'key', 'S');
        // Check null
        if (!nextToken) return
        // Check if already on the list
        if (listKey.includes(nextKey)) return
        // If not, push it
        let newTokenList = this.state.listToken;
        newTokenList.push(nextToken);
        this.setState({ listToken: newTokenList });
    }

    updateTokenListSearch(nextToken) {
        let listKey = [null];
        this.state.listToken.forEach((token) => { if (token) listKey.push(GeneralHelpers.checkNested(token, 'id', 'S')) });
        let nextKey = GeneralHelpers.checkNested(nextToken, 'id', 'S');
        // Check null
        if (!nextToken) return
        // Check if already on the list
        if (listKey.includes(nextKey)) return
        // If not, push it
        let newTokenList = this.state.listToken;
        newTokenList.push(nextToken);
        this.setState({ listToken: newTokenList });
    }

    async launchSearch(searchText, nextToken = null) {
        this.setState({ loading: true })

        let publicImages = await ImageHelper.getPublicImageByFolderId(this.props.folderId, searchText, nextToken, this.props.perpage)
        let getNext = GeneralHelpers.checkNested(publicImages, 'LastEvaluatedKey')
        let images = [];
        let rawItems = [];
        if (GeneralHelpers.checkNested(publicImages, 'Items')) rawItems = publicImages.Items;
        for (let i = 0; i < rawItems.length; i++) {
            images.push({ key: rawItems[i].key.S, name: rawItems[i].name.S })
        }
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
        this.updateTokenListSearch(getNext)

        this.setState({ loading: false })
    }

    async getPictures(nextToken = null) {
        this.setState({ loading: true })

        let publicImages = await ImageHelper.getPublicImageByFolderId(this.props.folderId, null, nextToken, this.props.perpage)
        let getNext = GeneralHelpers.checkNested(publicImages, 'LastEvaluatedKey')
        let images = [];
        let rawItems = [];
        if (GeneralHelpers.checkNested(publicImages, 'Items')) rawItems = publicImages.Items;
        for (let i = 0; i < rawItems.length; i++) {
            images.push({ key: rawItems[i].key.S, name: rawItems[i].name.S })
        }
        this.setState({
            listImages: images,
        })

        this.updateTokenList(getNext)

        this.setState({ loading: false })
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

GalleryPublic.propTypes = {
    folderId: PropTypes.string,
    perpage: PropTypes.number.isRequired,
    initSearch: PropTypes.string,
};

export default GalleryPublic;