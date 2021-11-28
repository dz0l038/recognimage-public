import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './MatchTest.scss';
import { Box, Typography, TextField, Button } from '@material-ui/core';
import DisplayImage from '../DisplayImage/DisplayImage';
import GeneralHelpers from '../../utils/Helpers/GeneralHelpers';
import { maxDetectionPerImage, minConfidence } from '../../utils/Parameters';


class MatchTest extends Component {
    constructor() {
        super();
        this.runTestMatch = this.runTestMatch.bind(this);
    }

    state = {
        currentImgObj: null,
        minChar: 3,
        maxChar: 8,
        listDetection: null,
        regexMode: false,
        regexString: "^.{3,8}$",
    };

    componentDidMount() {
        if (this.props.testImg && this.props.testImg !== this.state.currentImgObj) {
            this.updateTestImg();
        }
    }

    componentDidUpdate() {
        if (this.props.testImg && this.props.testImg !== this.state.currentImgObj) {
            this.updateTestImg();
        }
    }

    async updateTestImg() {
        this.setState({
            currentImgObj: this.props.testImg,
        })
    }

    handleMinCharChange = event => {
        if (event.target.value < 0 || event.target.value > this.state.maxChar) return
        this.setState({
            minChar: event.target.value,
        });
    };

    handleMaxCharChange = event => {
        if (event.target.value < 0 || event.target.value < this.state.minChar) return
        this.setState({
            maxChar: event.target.value,
        });
    };

    handleRegexStringChange = event => {
        this.setState({
            regexString: event.target.value,
        });
    };

    runTestMatch() {
        const rawAnalysis = JSON.parse(this.state.currentImgObj.analysisResult)
        if (!rawAnalysis) return
        const analysis = rawAnalysis.TextDetections;
        let listDetection = [];
        let detectionNbr = 0;
        if (!analysis) return

        let regex = new RegExp("^.{" + this.state.minChar + "," + this.state.maxChar + "}$");
        if (this.state.regexMode) {
            regex = new RegExp(this.state.regexString);
        }
        
        for (let i = 0; i < analysis.length; i++) {
            if (regex.test(analysis[i].DetectedText) &&
                analysis[i].Type === "WORD" &&
                analysis[i].Confidence > minConfidence &&
                detectionNbr <= maxDetectionPerImage) {
                listDetection.push(analysis[i])
                detectionNbr = detectionNbr + 1;
            }
        }
        this.setState({
            listDetection: listDetection,
        })

        if (this.props.onMatchTest) this.props.onMatchTest(regex)
    }

    render() {
        const { currentImgObj, minChar, maxChar, listDetection, regexMode, regexString } = this.state;
        let url = null;
        if (currentImgObj && currentImgObj.key) url = GeneralHelpers.urlFromKey(currentImgObj.key)
        return (
            <Box className="MatchTest">
                <Typography variant="h5">Pattern condition:</Typography>
                <Box className="match-input" display="flex" flexDirection="row" flexWrap="wrap" alignItems="baseline" marginBottom={3}>
                    {
                        regexMode ?
                            <TextField
                                id="regex"
                                value={regexString}
                                onChange={this.handleRegexStringChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                margin="normal"
                            />
                            :
                            <Box display="flex" flexDirection="row" flexWrap="wrap" alignItems="baseline">
                                <Typography component="div" style={{ marginRight: '1em' }}>Find string between</Typography>
                                <TextField
                                    id="standard-number"
                                    value={minChar}
                                    onChange={this.handleMinCharChange}
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    margin="normal"
                                />
                                <Typography component="div" style={{ marginRight: '1em' }}>characters and </Typography>
                                <TextField
                                    id="standard-number"
                                    value={maxChar}
                                    onChange={this.handleMaxCharChange}
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    margin="normal"
                                />
                                <Typography component="div" style={{ marginRight: '1em' }}>characters</Typography>
                            </Box>
                    }

                    <Button
                        variant="contained"
                        color="secondary"
                        //startIcon={<ArrowBackIcon />}
                        onClick={() => { this.setState({ regexMode: !regexMode }) }}
                    >
                        Switch mode
                    </Button>
                </Box >
                <Box marginBottom={4}>
                    <Button
                        variant="contained"
                        color="secondary"
                        //startIcon={<ArrowBackIcon />}
                        onClick={this.runTestMatch}
                    >
                        Test pattern on the selected picture
                    </Button>
                </Box>
                <Box className="match-display" display="flex" flexDirection="row" flexWrap="wrap">
                    <DisplayImage url={url} flexGrow={1} />
                    <Box flexGrow={1} maxWidth="350px">
                        <Typography variant="h5">Test matches:</Typography>
                        {
                            listDetection ?
                                <div>
                                    {
                                        listDetection.length > 0 ?

                                            <ul>
                                                {listDetection.map(function (match, index) {
                                                    return <li key={index}><b>{match.DetectedText}</b>: Confidence {Math.round(match.Confidence)}%</li>;
                                                })}
                                            </ul>
                                            :
                                            <Typography>No result on this picture</Typography>
                                    }
                                </div>
                                :
                                <Typography>Define the pattern you are looking for above</Typography>
                        }
                    </Box>
                </Box>
            </Box >
        );
    }
}

MatchTest.propTypes = {
    testImg: PropTypes.object,
    onMatchTest: PropTypes.func,
};

export default MatchTest;