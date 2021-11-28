import React, { Component } from 'react';
import './FolderCard.scss';
import PropTypes from 'prop-types';
import { Typography, Card, CardContent, Box, CardActionArea } from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Folder'
import GeneralHelpers from '../../utils/Helpers/GeneralHelpers';
import PlanHelper from '../../utils/API/planHelper';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { ProjectRoute } from '../../pages/Routing';

class FolderCard extends Component {
    state = {
        analyseMax: 1,
        analyseUsed: 0,
        endDate: null,
    };

    componentDidMount() {
        if (GeneralHelpers.checkNested(this.props, 'folderInfo', 'planId')) this.getPlan(this.props.folderInfo.planId)
    }

    async getPlan(id) {
        let planInfo = await PlanHelper.getPlanById(id);
        if (!planInfo) return
        this.setState({
            analyseMax: planInfo.maxUpload,
            analyseUsed: planInfo.usedUpload,
            endDate: planInfo.endDate,
        })
    }

    render() {
        const { endDate } = this.state;
        const { folderInfo } = this.props;
        return (
            <Card className="FolderCard">
                <CardActionArea component={Link} to={ProjectRoute + folderInfo.id}>
                    <CardContent className="card-content">
                        <Box textAlign="right"><FolderIcon style={{ fontSize: "3em", color: "grey" }} /></Box>
                        <Box>
                            <Typography variant="h3" component="h2">
                                {folderInfo.title}
                            </Typography>
                        </Box>
                        <Typography color="textSecondary" gutterBottom>
                            {new Date(folderInfo.created).toDateString()}
                        </Typography>
                        <Box marginBottom={1}>
                            <Typography>
                                Will be store until <b>{new Date(endDate).toDateString()}</b>
                            </Typography>
                        </Box>
                    </CardContent>
                </CardActionArea>
            </Card>
        );
    }
}

FolderCard.propTypes = {
    folderInfo: PropTypes.object,
};

export default FolderCard;