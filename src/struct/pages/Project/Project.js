import React, { Component } from 'react';
import './Project.scss';
import { Container, Typography, Box, Button } from '@material-ui/core';
import { withAuthenticator } from 'aws-amplify-react';
import AuthTheme from '../../utils/Auth/AuthTheme';
import { signUpConfig } from '../../utils/Auth/ConfigAuth';
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { ProjectsRoute, ProjectMatchRoute } from '../Routing';
import Gallery from '../../components/Gallery/Gallery';
import GeneralHelpers from '../../utils/Helpers/GeneralHelpers';
import FolderHelper from '../../utils/API/folderHelper';

class Project extends Component {
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
        const { folderId, userSub, folderInfo } = this.state;
        return (
            <Box>
                <Container maxWidth="lg" className="Project">
                    <Box marginBottom={10}>
                        <Typography variant="h2" component="h1">{folderInfo ? folderInfo.title : "..."}</Typography>
                        <Typography variant="h4" component="h3">Upload and analyse</Typography>
                    </Box>
                </Container>
                <Container maxWidth="md">
                    <Box textAlign="right" marginBottom={2}>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<ArrowBackIcon />}
                            component={Link} to={ProjectsRoute}>
                            Back to projects
                        </Button>
                    </Box>
                </Container>
                <Box marginTop={2} marginBottom={2} paddingTop={2} paddingBottom={2} style={{ backgroundColor: "#fefefe" }}>
                    <Container maxWidth="md">
                        <Box textAlign="right" marginBottom={2}>
                            <Button
                                variant="contained"
                                color="secondary"
                                endIcon={<ArrowForwardIcon />}
                                component={Link} to={ProjectMatchRoute + this.props.match.params.id}>
                                Found text patterns
                        </Button>
                        </Box>
                        <Gallery maxDimension={1000} maxDimensionThumb={300} folderId={folderId} userSub={userSub} />
                    </Container>
                </Box>
            </Box>
        );
    }
}

export default withAuthenticator(Project, false, [], null, AuthTheme, signUpConfig);