import React, { Component } from 'react';
import { ProjectContext } from './Contexts/ProjectProvider';


class EditProject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updatedProject: {
                projectname: this.props.projectname,
                description: this.props.description,
                deadline: this.props.deadline,
                status: this.props.status,
            }
        }
    }

    handleChange(event) {
        this.setState({
            updatedProject: {
                ...this.state.updatedProject,
                [event.target.name]: event.target.value
            }

        });
    }

    showModal(event) {
        if ("modalOverlay".includes(event.target.classList[0])) {
            this.props.hideModal()
        }
    }

    async updateProject() {
        await this.context.updateProject(this.state.updatedProject, this.props.id)
        await this.props.update()
        this.props.disableEdit()
    }

    render() {

        return (
            <>

                <ProjectContext.Consumer>
                    {(context) => (
                        <>
                            <div className="customerProfile" style={this.state.editEnabled}>
                                <h1 className="customerTitle linebreak">Projektoplysninger</h1>
                                <span className="editBtn material-icons-outlined highlightExit" onClick={() => this.props.disableEdit()}>close</span>
                                <span title="Gem ændringer" className="editBtn material-icons-outlined highlightSave" onClick={() => this.updateProject()}>save</span>
                                <div className="customerDetails">
                                    <span className="customerLabel">Projektnavn</span><input onChange={event => this.handleChange(event)} className="modalInput" name="projectname" defaultValue={context.state.project.projectname}></input>
                                    <span className="customerLabel">Beskrivelse</span><textarea onChange={event => this.handleChange(event)} className="edit modalInput modalTextArea" name="description" defaultValue={context.state.project.description}></textarea>
                                    <span className="customerLabel">Deadline</span><input onChange={event => this.handleChange(event)} type="date" className="modalInput" name="deadline" defaultValue={context.state.project.deadline}></input>
                                    <span className="customerLabel">Status</span><select onChange={event => this.handleChange(event)} name="status" className="modalSelect"><option>Fuldført</option><option>Afventer</option><option>Igangværende</option></select>
                                </div>
                            </div>
                        </>
                    )}
                </ProjectContext.Consumer>
            </>
        );
    }
}

EditProject.contextType = ProjectContext;

export default EditProject;
