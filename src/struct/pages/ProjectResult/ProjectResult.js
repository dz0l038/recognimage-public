import React, { Component } from 'react';
import './ProjectResult.scss';
import { Container, Typography, Box, Button } from '@material-ui/core';
import { withAuthenticator } from 'aws-amplify-react';
import AuthTheme from '../../utils/Auth/AuthTheme';
import { signUpConfig } from '../../utils/Auth/ConfigAuth';
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { ProjectMatchRoute, PublicRoute } from '../Routing';
import GeneralHelpers from '../../utils/Helpers/GeneralHelpers';
import FolderHelper from '../../utils/API/folderHelper';
import GallerySearch from '../../components/GallerySearch/GallerySearch';

class ProjectResult extends Component {
    state = {
        folderId: null,
        userSub: null,
        folderInfo: null,
    }

    componentDidMount() {
        this.init();
    }

    async init() {
        let userSub = await GeneralHelpers.getCurrentUserSub()
        let folderInfo = await FolderHelper.getFolderById(this.props.match.params.id)
        this.setState({
            folderId: this.props.match.params.id,
            userSub: userSub,
            folderInfo: folderInfo,
        })
    }

    render() {
        const { folderId, folderInfo } = this.state;
        return (
            <Box>
                <Container maxWidth="lg" className="ProjectResult">
                    <Box marginBottom={10}>
                        <Typography variant="h2" component="h1">{folderInfo ? folderInfo.title : null}</Typography>
                        <Typography variant="h4" component="h3">Result</Typography>
                    </Box>
                </Container>
                <Container maxWidth="md">
                    <Box textAlign="right" marginBottom={2}>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<ArrowBackIcon />}
                            component={Link} to={ProjectMatchRoute + this.props.match.params.id}>
                            Back to pattern definition
                        </Button>
                    </Box>
                </Container>
                <Box marginTop={2} marginBottom={2} paddingTop={2} paddingBottom={2} style={{ backgroundColor: "#fefefe" }}>
                    <Container maxWidth="md">
                        <Typography>
                        You can disitribute this result through the following link:<br /> <Link to={PublicRoute + folderId + "/true/"}>{"https://do93zxpqjd34l.cloudfront.net" + PublicRoute + folderId + "/true/"}</Link>
                        </Typography>
                        <Box marginTop={2}>
                        <Typography>
                            As this version is minimalistic, you also can embbeded directly in your own website using iframe.
                        </Typography>
                        </Box>
                        <GallerySearch folderId={folderId} />
                    </Container>
                </Box>
            </Box>
        );
    }
}

export default withAuthenticator(ProjectResult, false, [], null, AuthTheme, signUpConfig);