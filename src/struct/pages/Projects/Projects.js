import React, { Component } from 'react';
import './Projects.scss';
import { Container, Typography, Box, Button } from '@material-ui/core';
import { withAuthenticator } from 'aws-amplify-react';
import AuthTheme from '../../utils/Auth/AuthTheme';
import { signUpConfig } from '../../utils/Auth/ConfigAuth';
import AddIcon from '@material-ui/icons/Add'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { NewProjectRoute } from '../Routing';
import uuid from 'react-uuid';

// DB
import FolderHelper from '../../utils/API/folderHelper';
import FolderCard from '../../components/FolderCard/FolderCard';

class Projects extends Component {
    state = {
        folderList: [],
    }
    componentDidMount() {
        if (this.state) { this.loadFolder() }
    }

    async loadFolder() {
        let folderList = await FolderHelper.getMyFolder();
        this.setState({
            folderList: folderList,
        })
    }

    render() {
        const { folderList } = this.state;
        return (
            <Container maxWidth="lg" className="Project">
                <Box marginBottom={10}>
                    <Typography variant="h2" component="h1">My projects</Typography>
                </Box>
                <Container maxWidth="md">
                    <Box textAlign="right" marginBottom={2}>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<AddIcon />}
                            component={Link} to={NewProjectRoute}>
                            New project
                        </Button>
                    </Box>
                    <Box display="flex" flexDirection="row" flexWrap="wrap" alignItems="center">
                        {
                            folderList.length > 0 ?
                                folderList.map((folder, index) => {
                                    return <FolderCard key={uuid()} folderInfo={folder}/>
                                })
                                :
                                <Box>No project yet</Box>
                        }
                    </Box>

                </Container>
            </Container>
        );
    }
}

export default withAuthenticator(Projects, false, [], null, AuthTheme, signUpConfig);