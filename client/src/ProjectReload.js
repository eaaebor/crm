import React, { Component } from 'react';
import { ProjectContext } from './Contexts/ProjectProvider';


class ProjectReload extends Component {

    async componentDidMount() {
        await this.context.getProjects()
    }

    render() {

        return (
            <>

            </>
        );
    }
}

ProjectReload.contextType = ProjectContext;

export default ProjectReload;
