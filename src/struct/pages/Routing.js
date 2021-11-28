import React from 'react';

// Import pages
import Home from './Home/Home'
import Projects from './Projects/Projects'

// Import react router
import { Route } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import MainLayout from './Layout/MainLayout';
import NewProject from './NewProject/NewProject';
import PojectCreateSuccess from './PojectCreateSuccess/PojectCreateSuccess';
import Project from './Project/Project';
import ProjectMatch from './ProjectMatch/ProjectMatch';
import ProjectResult from './ProjectResult/ProjectResult';
import Public from './Public/Public';
import Terms from './Terms/Terms';

export const HomeRoute = "/";
export const ProjectsRoute = "/projects/";
export const NewProjectRoute = "/new-project/";
export const SuccessProjectRoute = "/success-project/";
export const ProjectRoute = "/project-upload/";
export const ProjectMatchRoute = "/project-match/";
export const ProjectResultRoute = "/project-result/";
export const PublicRoute = "/display/";
export const TermsRoute = "/terms/";

class Routing extends React.Component {
    render() {
        const path = this.props.location.pathname;
        const withoutLayout = path.startsWith(PublicRoute)
        return (
            <div>
                {
                    withoutLayout ?
                        <Route path={PublicRoute + ":id/:light/:perpage?/:search?"} component={Public} />
                        :
                        <MainLayout>
                            < Route path={HomeRoute} exact component={Home} />
                            <Route path={ProjectsRoute} component={Projects} />
                            <Route path={NewProjectRoute} component={NewProject} />
                            <Route path={SuccessProjectRoute + ":checkoutid"} component={PojectCreateSuccess} />
                            <Route path={ProjectRoute + ":id"} component={Project} />
                            <Route path={ProjectMatchRoute + ":id"} component={ProjectMatch} />
                            <Route path={ProjectResultRoute + ":id"} component={ProjectResult} />
                            <Route path={TermsRoute} component={Terms} />
                        </MainLayout >
                }
            </div>

        );
    }
}

export default withRouter(Routing);