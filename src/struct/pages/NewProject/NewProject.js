import React, { Component } from 'react';
import './NewProject.scss';
import { Container, Typography, Box, Button, Divider, TextField, Checkbox } from '@material-ui/core';
import { withAuthenticator } from 'aws-amplify-react';
import AuthTheme from '../../utils/Auth/AuthTheme';
import { signUpConfig } from '../../utils/Auth/ConfigAuth';
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { ProjectsRoute, SuccessProjectRoute, NewProjectRoute, TermsRoute } from '../Routing';
import PayButton from '../../components/PayButton/PayButton';
import GeneralHelpers from '../../utils/Helpers/GeneralHelpers';
import { STRIPE_PUBLIC_KEY } from '../../utils/Parameters';

class NewProject extends Component {
    state = {
        title: "",
        planPrice: "100",
        userId: "Unknown",
        acceptTerms: false,
    }

    constructor() {
        super();
        this.pickPlan = this.pickPlan.bind(this)
    }

    componentDidMount() {
        if (this.state) { this.getUserId() }
    }

    async getUserId() {
        let userId = await GeneralHelpers.getCurrentUserSub();
        this.setState({
            userId: userId,
        })
    }

    handleChange = stateName => event => {
        this.setState({
            [stateName]: event.target.value,
        });
    };

    handleToogleTerms = currentState => event => {
        this.setState({
            acceptTerms: !currentState,
        });
    };

    pickPlan = value => event => {
        this.setState({
            planPrice: value,
        })
    }

    render() {
        const {
            title,
            planPrice,
            userId,
            acceptTerms,
        } = this.state;
        const base_url = window.location.origin;
        const labels = [
            "10€ - Analyse up to 100 images, just to try!",
            "100€ - Analyse up to 1000 images, to fit small to medium size events",
            "200€ - Analyse up to 5000 images, for large events"
        ]
        let label = labels[0];
        if (planPrice === "100") label = labels[1];
        if (planPrice === "200") label = labels[2];
        let disabled = true;
        if (acceptTerms) disabled = false;

        return (
            <Box className="NewProject">
                <Container maxWidth="lg">
                    <Box marginBottom={10}>
                        <Typography variant="h2" component="h1">New project</Typography>
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
                <Box marginTop={2} marginBottom={2} paddingTop={5} paddingBottom={4} style={{ backgroundColor: "#fcfcfc" }}>
                    <Container maxWidth="md">
                        <Box marginBottom={7}>
                            <Typography variant="h4">Set your project title</Typography>
                            <TextField
                                disabled={false}
                                id="title-post"
                                label="Title (50 characters max)"
                                value={title}
                                onChange={this.handleChange("title")}
                                margin="normal"
                                fullWidth
                                inputProps={{ maxLength: 50 }}
                            />
                        </Box>
                        <Divider />
                        <Box paddingTop={7} paddingBottom={2}>
                            <Typography variant="h4">Select a plan</Typography>
                            <section id="pricePlans">
                                <ul id="plans">
                                    <li className="plan">
                                        <ul className="planContainer">
                                            <li className="title"><h2 className={planPrice === "10" ? "bestPlanTitle" : null}>Test<br />the tool</h2></li>
                                            <li className="price"><p className={planPrice === "10" ? "bestPlanPrice" : null}>10€</p></li>
                                            <li>
                                                <ul className="options">
                                                    <li>Powerful <span>AI based text extraction tool</span></li>
                                                    <li>6 months <span>hosting (extensible)</span></li>
                                                    <li>Pattern selection <span>tool</span></li>
                                                    <li><span>Easy to </span>distribute <span>result</span></li>
                                                    <li>Up to 100 <span>pictures analysed</span></li>
                                                </ul>
                                            </li>
                                            <li className="button"><Link onClick={this.pickPlan("10")} className={planPrice === "10" ? "bestPlanButton" : null}>
                                                {planPrice === "10" ? "Selected" : "Choose"}
                                            </Link></li>
                                        </ul>
                                    </li>

                                    <li className="plan">
                                        <ul className="planContainer">
                                            <li className="title"><h2 className={planPrice === "100" ? "bestPlanTitle" : null}>Medium size <br />event</h2></li>
                                            <li className="price"><p className={planPrice === "100" ? "bestPlanPrice" : null}>100€</p></li>
                                            <li>
                                                <ul className="options">
                                                    <li>Powerful <span>AI based text extraction tool</span></li>
                                                    <li>6 months <span>hosting (extensible)</span></li>
                                                    <li>Pattern selection <span>tool</span></li>
                                                    <li><span>Easy to </span>distribute <span>result</span></li>
                                                    <li>Up to 1000 <span>pictures analysed</span></li>
                                                </ul>
                                            </li>
                                            <li className="button"><Link onClick={this.pickPlan("100")} className={planPrice === "100" ? "bestPlanButton" : null}>
                                                {planPrice === "100" ? "Selected" : "Choose"}
                                            </Link></li>
                                        </ul>
                                    </li>

                                    <li className="plan">
                                        <ul className="planContainer">
                                            <li className="title"><h2 className={planPrice === "200" ? "bestPlanTitle" : null}>Large size <br />event</h2></li>
                                            <li className="price"><p className={planPrice === "200" ? "bestPlanPrice" : null}>200€</p></li>
                                            <li>
                                                <ul className="options">
                                                    <li>Powerful <span>AI based text extraction tool</span></li>
                                                    <li>6 months <span>hosting (extensible)</span></li>
                                                    <li>Pattern selection <span>tool</span></li>
                                                    <li><span>Easy to </span>distribute <span>result</span></li>
                                                    <li>Up to 5000 <span>pictures analysed</span></li>
                                                </ul>
                                            </li>
                                            <li className="button"><Link onClick={this.pickPlan("200")} className={planPrice === "200" ? "bestPlanButton" : null}>
                                                {planPrice === "200" ? "Selected" : "Choose"}
                                            </Link></li>
                                        </ul>
                                    </li>
                                </ul>
                            </section>
                        </Box>

                        <Box display="flex" alignItems="center">
                            <Checkbox
                                checked={acceptTerms}
                                onChange={this.handleToogleTerms(acceptTerms)}
                                value={acceptTerms}
                            />
                            <Typography>Accept <Link to={TermsRoute}>terms and conditions</Link> </Typography>
                        </Box>
                        <Box>
                            <PayButton
                                stripePublicKey={STRIPE_PUBLIC_KEY}
                                apiName="stripeapi"
                                apiEndpoint="/checkout"
                                name={title}
                                description={label}
                                images={['https://recognimage2789848cdf84453c8cc2398cd34ed06c-dev.s3.eu-central-1.amazonaws.com/logoTextDark.png']}
                                amount={planPrice * 100}
                                currency='eur'
                                quantity={1}
                                success_url={base_url + SuccessProjectRoute + '{CHECKOUT_SESSION_ID}'}
                                cancel_url={base_url + NewProjectRoute}
                                client_reference_id={userId}
                                disabled={disabled}
                            />
                        </Box>
                    </Container>
                </Box>
            </Box>
        );
    }
}

export default withAuthenticator(NewProject, false, [], null, AuthTheme, signUpConfig);