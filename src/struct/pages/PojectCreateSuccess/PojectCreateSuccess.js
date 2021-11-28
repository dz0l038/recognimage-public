import React, { Component } from 'react';
import './PojectCreateSuccess.scss';
import { Container, Typography, Box, Button } from '@material-ui/core';
import { withAuthenticator } from 'aws-amplify-react';
import AuthTheme from '../../utils/Auth/AuthTheme';
import { signUpConfig } from '../../utils/Auth/ConfigAuth';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { ProjectsRoute } from '../Routing';

class PojectCreateSuccess extends Component {
    render() {
        console.log(this.props)
        return (
            <Box marginBottom={10} className="PojectCreateSuccess">
                <Container maxWidth="lg" >
                    <Typography variant="h2" component="h1">Success</Typography>
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

                <Box marginTop={2} marginBottom={2} paddingTop={2} paddingBottom={2} style={{ backgroundColor: "#fcfcfc" }}>
                    <Container maxWidth="md">
                        <Box marginBottom={3}>
                            <Typography variant="h4">Your new project have been created</Typography>
                        </Box>
                        <Typography>Your checkout number is <b>{this.props.match.params.checkoutid}</b>. Please keep it safe in case you need to contact us regarding your payment</Typography>
                        <Box textAlign="right" marginBottom={2} marginTop={3}>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<ArrowBackIcon />}
                                component={Link} to={ProjectsRoute}>
                                Back to projects
                        </Button>
                        </Box>
                    </Container>
                </Box>
            </Box >
        );
    }
}

export default withAuthenticator(PojectCreateSuccess, false, [], null, AuthTheme, signUpConfig);