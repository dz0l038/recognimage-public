import React, { Component } from 'react';
import './Home.scss';
import { Container, Typography, Box } from '@material-ui/core';
import NavigateNext from '@material-ui/icons/NavigateNext';
import AddAPhoto from '@material-ui/icons/AddAPhoto';
import Search from '@material-ui/icons/Search';
import LogoImgSrc from './../../assets/img/logo.png'
import { NewProjectRoute, TermsRoute } from '../Routing';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

class Home extends Component {
    render() {
        return (
            <Box className="Home">
                <Box>
                    <Container maxWidth="lg">
                        <Typography variant="h1" style={{textAlign: "left"}}>What do we do?</Typography>
                    </Container>
                </Box>
                <Box className="container-transparent">
                    <Container maxWidth="md">
                        <Typography variant="h5" component="h2"><b>RecognImage</b> is using cutting edge artificial intelligence and serveless technology
                        to make your pictures searchable in the most user-friendly, precise and cost-effective way you can find on the market.</Typography>
                    </Container>
                </Box>
                <Box className="container-white">
                    <Container maxWidth="md">
                        <Typography variant="h3" component="h2">How it works?</Typography><br />
                        <Typography>
                            We have tried to make the easiest tool possible so anyone can take advantage this technology without knowing anything about artificial intelligence or coding.
                            The process is straightforward and you can have your pictures analysed and distributed in about 10 minutes!
                        </Typography>
                        <Box marginTop={3} display="flex" flexDirection="row" flexWrap="wrap" alignContent="center" alignItems="center" textAlign="center">
                            <Box className="howToBubble">
                                <Box fontSize="7em" display="flex" flexDirection="row" flexWrap="wrap" marginTop={2} marginBottom={1}>
                                    <Box flexGrow={1} />
                                    <AddAPhoto fontSize="inherit" />
                                    <Box flexGrow={1} />
                                </Box>
                                <Typography>Create a new project and add your pictures</Typography>
                            </Box>
                            <NavigateNext />
                            <Box className="howToBubble">
                                <img src={LogoImgSrc} alt="recognimage logo" width="170px" />
                                <Typography>RecognImage automatically analyses them and extracts texts or metadatas from them</Typography>
                            </Box>
                            <NavigateNext />
                            <Box className="howToBubble">
                                <Box fontSize="7em" display="flex" flexDirection="row" flexWrap="wrap" marginTop={2} marginBottom={1}>
                                    <Box flexGrow={1} />
                                    <Search fontSize="inherit" />
                                    <Box flexGrow={1} />
                                </Box>
                                <Typography>You can now search your pictures based on their content, and let your users do the same using your public link or even embedded the result in your own website</Typography>
                            </Box>
                        </Box>
                    </Container>
                </Box>
                <Box className="container-transparent">
                    <Container maxWidth="md">
                        <Typography variant="h3" component="h2">Pricing</Typography><br />
                        <Typography>To select a plan, log in to your account and create a new project</Typography>
                        <section id="pricePlans">
                            <ul id="plans">
                                <li className="plan">
                                    <ul className="planContainer">
                                        <li className="title"><h2>Test<br />the tool</h2></li>
                                        <li className="price"><p>10€</p></li>
                                        <li>
                                            <ul className="options">
                                                <li>Powerful <span>AI based text extraction tool</span></li>
                                                <li>6 months <span>hosting (extensible)</span></li>
                                                <li>Pattern selection <span>tool</span></li>
                                                <li><span>Easy to </span>distribute <span>result</span></li>
                                                <li>Up to 100 <span>pictures analysed</span></li>
                                            </ul>
                                        </li>
                                        <li className="button"><Link to={NewProjectRoute}>ORDER NOW</Link></li>
                                    </ul>
                                </li>

                                <li className="plan">
                                    <ul className="planContainer">
                                        <li className="title"><h2>Medium size <br />event</h2></li>
                                        <li className="price"><p>100€</p></li>
                                        <li>
                                            <ul className="options">
                                                <li>Powerful <span>AI based text extraction tool</span></li>
                                                <li>6 months <span>hosting (extensible)</span></li>
                                                <li>Pattern selection <span>tool</span></li>
                                                <li><span>Easy to </span>distribute <span>result</span></li>
                                                <li>Up to 1000 <span>pictures analysed</span></li>
                                            </ul>
                                        </li>
                                        <li className="button"><Link to={NewProjectRoute}>ORDER NOW</Link></li>
                                    </ul>
                                </li>

                                <li className="plan">
                                    <ul className="planContainer">
                                        <li className="title"><h2>Large size <br />event</h2></li>
                                        <li className="price"><p>200€</p></li>
                                        <li>
                                            <ul className="options">
                                                <li>Powerful <span>AI based text extraction tool</span></li>
                                                <li>6 months <span>hosting (extensible)</span></li>
                                                <li>Pattern selection <span>tool</span></li>
                                                <li><span>Easy to </span>distribute <span>result</span></li>
                                                <li>Up to 5000 <span>pictures analysed</span></li>
                                            </ul>
                                        </li>
                                        <li className="button"><Link to={NewProjectRoute}>ORDER NOW</Link></li>
                                    </ul>
                                </li>
                            </ul>
                        </section>
                    </Container>
                </Box>
                <Box className="container-white">
                    <Container maxWidth="md">
                        <Box marginTop={2}>
                            <Typography variant="h3" component="h2" style={{textAlign: "left"}}>Use case: a running event</Typography>
                        </Box>
                        <Box marginTop={4} marginBottom={5}>
                            <Typography>
                                Let's say you are organizing a runing event. You want to offer your participants a very easy and straightforward
                                way to see all the pictures of the event and search for the ones they can be seen? Classify all pictures by hand
                                would be way to long and hiring someone to automate the process would be super expensive.
                            </Typography><br />
                            <Typography variant="h5">
                                Good news, that is exactly what Recognimage can done for you whithin minutes at low price!
                            </Typography><br />
                            <Typography>
                                Follow this step by step tutorial and you will be able to distribute your pictures in no time.
                            </Typography>
                        </Box>
                        <Box marginTop={4}>
                            <Typography variant="h5">
                                <b>Step 1:</b> Create an account (around 1 minute)
                            </Typography>
                            <Typography>
                                First things first, you will need to have an account. Click <b>Log in</b> on the left menu and follow the
                                simple steps to create an account. A confirmation code will be sent to the provided email to validate your account.
                            </Typography>
                        </Box>
                        <Box marginTop={4}>
                            <Typography variant="h5">
                                <b>Step 2:</b> Create an new project (around 2 minutes)
                            </Typography>
                            <Typography>
                                Go to <b>My Projects</b>. This page will display the list of your current projects. To create a new one click
                            on the <b>New Project</b> button located at the top of the page. Here you can set the title of you project, select
                            the plan that best suites your need, and accept the tems and conditions.<br />
                                When you payment is done, go back to <b>My Project</b>, you will be able to see your new projet in the list!.
                            </Typography>
                        </Box>
                        <Box marginTop={4}>
                            <Typography variant="h5">
                                <b>Step 3:</b> Upload and analyse your images (around 2 minutes)
                            </Typography>
                            <Typography>
                                Now that your first project is ready, it is time to populate it. Click on the folder juste created in <b>My Project</b>
                                to access the "upload and analyse" step.
                            </Typography>
                            <Typography>
                                During this step, you can easily add your pictures and check what have already been
                                added. At the top of the page, you can see how many pictures you already
                                uploaded and analysed. The analysis is done automatically during the upload,
                                you don't need to do anything more. Once all your pictures have been
                                uploaded, click on <b>Found Text Patterns</b> to go to the next step.
                            </Typography>
                        </Box>
                        <Box marginTop={4}>
                            <Typography variant="h5">
                                <b>Step 4:</b> Define the pattern you are looking for (around 3 minutes)
                            </Typography>
                            <Typography>
                                This is the most important step to obtain good results. At the moment,
                                all texts have been extracted from your pictures, but you cannot use the search tool yet. To be enable the search
                                tool for the final user looking for a numero on a bib, you need
                                to tell us what kind of text pattern you are looking for. The simpliest
                                way to do it is by defining the size of the text you want to extract by entering the minimum and maximum number of characters.
                                But maybe this is not enough for you, for example if you want to
                                extract texts with only numbers. For that you can click <b>Switch mode</b>, this will
                                let you directly enter a <b>regex</b>. If you want to get all words between 3 and 8
                                digits, you can enter a regex like <b>^[0-9]{"{3,8}$"}</b>.
                            </Typography>
                            <Typography>
                                Next you can select one picture in the first hundred of your project and
                                click <b>Test Pattern on the Selected Picture</b> to see if texts extracted are
                                the ones you were expected. If everything is fine there, then you can click the red
                                button <b>Find the tested pattern in all pictures</b> so the pattern you defined
                                is extracted for all pictures of your project (maximum 10 matches per picture).
                            </Typography>
                        </Box>
                        <Box marginTop={4} marginBottom={5}>
                            <Typography variant="h5">
                                <b>Step 5:</b> See the result!
                            </Typography>
                            <Typography>
                                Once the previous step is done, you can click on <b>See result</b>.
                            </Typography>
                            <Typography>
                                Here you can explore the result and copy the public link
                                to provide to your users.
                            </Typography>
                            <Typography>
                                You also can update this link to define the number of pictures per
                                page and the default search. The link end by <b>/true/</b>, so
                                an updated link would be <b>/true/50/123</b> to have 50 pictures per
                                page and default search "123".
                            </Typography>
                        </Box>
                    </Container>
                </Box>
                <Box className="container-transparent" style={{textAlign: "center"}}>
                    <Link to={TermsRoute}>Terms and Conditions</Link>
                </Box> 
            </Box>
        );
    }
}

export default Home;