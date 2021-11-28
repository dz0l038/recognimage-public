import React, { Component } from 'react';
import './ProjectMatch.scss';
import { Container, Typography, Box, Button, LinearProgress } from '@material-ui/core';
import { withAuthenticator } from 'aws-amplify-react';
import AuthTheme from '../../utils/Auth/AuthTheme';
import { signUpConfig } from '../../utils/Auth/ConfigAuth';
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { ProjectRoute, ProjectResultRoute } from '../Routing';
import GeneralHelpers from '../../utils/Helpers/GeneralHelpers';
import FolderHelper from '../../utils/API/folderHelper';
import ImageHelper from '../../utils/API/imageHelper';
import DisplayGallery from '../../components/DisplayGallery/DisplayGallery';
import MatchTest from '../../components/MatchTest/MatchTest';
import MatchHelper from '../../utils/API/matchHelper';
import { minConfidence, maxDetectionPerImage } from '../../utils/Parameters';

class ProjectMatch extends Component {
    constructor() {
        super();
        this.setTestImage = this.setTestImage.bind(this);
        this.getMatchPattern = this.getMatchPattern.bind(this)
        this.applyRegexToAll = this.applyRegexToAll.bind(this)
    }

    state = {
        folderId: null,
        userSub: null,
        folderInfo: null,
        listImages: [],
        testImgIndex: 0,
        regex: null,
        matchingProgress: 0,
        currentMatchingNbr: 0,
        matching: false,
        removing: false,
        listDetection: [],
        lastRegexRun: null,
        nextToken: null,
    }

    componentDidMount() {
        this.init();
    }

    async init() {
        let userSub = await GeneralHelpers.getCurrentUserSub();
        let folderInfo = await FolderHelper.getFolderById(this.props.match.params.id);
        let [images, nextToken] = await ImageHelper.getImageWithAnaliticByFolderId(folderInfo.id, null, 100);
        this.setState({
            folderId: this.props.match.params.id,
            userSub: userSub,
            folderInfo: folderInfo,
            listImages: images,
            lastRegexRun: folderInfo.lastRegex,
            nextToken: nextToken,
        })
    }

    setTestImage(index) {
        this.setState({
            testImgIndex: index,
        })
    }

    getMatchPattern(regex) {
        if (regex) {
            this.setState({
                regex: regex,
            })
        }
    }

    async applyRegexToAll() {
        let listDetection = [];
        if (this.state.regex) {
            this.setState({
                removing: true,
            })
            // Delete all previous matches
            await MatchHelper.deleteAllMatchesByFolderId(this.state.folderId)

            // Match all images and put new matches
            let listPut = [];
            this.setState({
                removing: false,
                matching: true,
            })
            let first = true;
            let listImagesWithAnalytic = this.state.listImages;
            let nextToken = this.state.nextToken;
            while (nextToken || first) {
                first = false;
                for (let i = 0; i < listImagesWithAnalytic.length; i++) {
                    let rawAnalysis = JSON.parse(listImagesWithAnalytic[i].analysisResult)
                    if (rawAnalysis) {
                        let analysis = rawAnalysis.TextDetections;
                        if (analysis) {
                            let detectionNbr = 0;
                            for (let j = 0; j < analysis.length; j++) {
                                if (this.state.regex.test(analysis[j].DetectedText) &&
                                    analysis[j].Type === "WORD" &&
                                    analysis[j].Confidence > minConfidence &&
                                    detectionNbr <= maxDetectionPerImage) {
                                    listDetection.push(analysis[j])
                                    let putMatch = MatchHelper.createMatch(listImagesWithAnalytic[i].folderId,
                                        listImagesWithAnalytic[i].key,
                                        listImagesWithAnalytic[i].name,
                                        analysis[j].DetectedText.toLowerCase(),
                                        'public',
                                        listImagesWithAnalytic[i].date,
                                        listImagesWithAnalytic[i].owner)
                                    listPut.push(putMatch);
                                    detectionNbr = detectionNbr + 1;
                                }
                            }
                        }
                    }
                }
                // Load next page
                [listImagesWithAnalytic, nextToken] = await ImageHelper.getImageWithAnaliticByFolderId(this.state.folderId, nextToken, 100);
            }

            await Promise.all(listPut)

            // update the last regex apply to the folder
            let regexString = this.state.regex.toString()
            await FolderHelper.updateLastRegexFolder(this.state.folderId, regexString)
            this.setState({
                removing: false,
                matching: false,
                matchingDone: true,
                listDetection: listDetection,
                lastRegexRun: regexString,
            })
        }
    }

    render() {
        const { folderInfo, listImages, regex, lastRegexRun, matchingDone, matching, removing, listDetection } = this.state;
        const loading = matching || removing;
        const loadingText = matching ? "Matching pictures..." : "Removing previous matches.";
        let currentRegexString = null;
        if (regex) currentRegexString = regex.toString();
        return (
            <Box>
                <Container maxWidth="lg" className="ProjectMatch">
                    <Box marginBottom={10}>
                        <Typography variant="h2" component="h1">{folderInfo ? folderInfo.title : "..."}</Typography>
                        <Typography variant="h4" component="h3">Define pattern</Typography>
                    </Box>
                </Container>
                <Container maxWidth="md">
                    <Box textAlign="right" marginBottom={2}>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<ArrowBackIcon />}
                            component={Link} to={ProjectRoute + this.props.match.params.id}>
                            Back to upload
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
                                component={Link} to={ProjectResultRoute + this.props.match.params.id}>
                                See result
                        </Button>
                        </Box>
                        <MatchTest testImg={listImages[this.state.testImgIndex]} onMatchTest={this.getMatchPattern} />
                        {
                            regex ?
                                <Box marginTop={5} marginBottom={3} textAlign="right">
                                    <Typography>Regex pattern: <b>{regex.toString()}</b></Typography>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        style={{ backgroundColor: "#d9534f" }}
                                        //startIcon={<ArrowBackIcon />}
                                        onClick={this.applyRegexToAll}
                                        disabled={lastRegexRun === currentRegexString}
                                    >
                                        Find the tested pattern in all pictures!
                                    </Button>
                                </Box>
                                :
                                null
                        }
                        {
                            loading ?
                                <Box marginTop='1em' marginBottom='3em'>
                                    <Typography>{loadingText} <b>Don't leave the page.</b></Typography>
                                    <div style={{ width: '80%' }}>
                                        <LinearProgress color="secondary" />
                                    </div>
                                </Box>
                                :
                                null
                        }
                        {
                            matchingDone ?
                                <Typography>
                                    <b>Matching done!</b> We found your pattern <b>{listDetection.length}</b> times in your images.
                                    Have a look on the result on the next section.
                                </Typography>
                                :
                                null
                        }
                        <Box marginTop={2} marginBottom={1}><Typography>First 100 images of your project (for testing patterns)</Typography></Box>
                        <DisplayGallery listImages={listImages} disableFullSize={true} onImageClick={this.setTestImage} />
                    </Container>
                </Box>
            </Box>
        );
    }
}

export default withAuthenticator(ProjectMatch, false, [], null, AuthTheme, signUpConfig);