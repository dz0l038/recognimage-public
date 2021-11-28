import React, { Component } from 'react';
import './Public.scss';
import { Container, Box } from '@material-ui/core';
import FolderHelper from '../../utils/API/folderHelper';
import GalleryPublic from '../../components/GalleryPublic/GalleryPublic';

class Public extends Component {
    state = {
        folderId: null,
        folderInfo: null,
        isLight: true,
        initSearch: '',
        perpage: 50,
    }

    componentDidMount() {
        this.init();
    }

    async init() {
        let folderInfo = await FolderHelper.getFolderById(this.props.match.params.id)
        let perpage = 50;
        if (this.props.match.params.perpage) perpage = this.props.match.params.perpage;
        this.setState({
            folderId: this.props.match.params.id,
            folderInfo: folderInfo,
            initSearch: this.props.match.params.search,
            isLight: this.props.match.params.light,
            perpage: parseInt(perpage),
        })
    }

    render() {
        const { folderId, perpage, initSearch } = this.state;
        return (
            <Box className="Public" marginTop={0} marginBottom={2} paddingTop={2} paddingBottom={2} style={{ backgroundColor: "#fcfcfc" }}>
                <Container maxWidth="lg">
                    <GalleryPublic folderId={folderId} perpage={perpage} initSearch={initSearch} />
                </Container>
            </Box>
        );
    }
}

export default Public;