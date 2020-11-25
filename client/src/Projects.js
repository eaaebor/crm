import React, { Component } from 'react';
import { ProjectContext } from './Contexts/ProjectProvider';
import Autocomplete from './Autocomplete'
import AutocompleteCustomer from './AutocompleteCustomer'
import { Link } from "@reach/router";
import moment from 'moment';


class Projects extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            team: [],
            warning: {
                display: "none"
            },
            feedback: {
                display: "none"
            }
        }
    }

    async componentDidMount() {
        await this.context.getProjects()
    }

    getDeadline(date) {
        if (date !== undefined) {
            let deadline = moment(date).diff(moment(), 'days')

            if (deadline < 0) { return (<span className="deadlineLate">Overskredet med {deadline * -1 } dage</span>) }
            else if (deadline > 0 && deadline < 10) { return (<span className="deadlineSoon">{deadline} dage til deadline</span>) }
            else if (deadline > 10) { return (<span className="deadlineLong">{deadline} dage til deadline</span>) }
        }
    }

    updateTeam(user) {
        this.setState({
            team: [...this.state.team, user]
        })
    }

    addCustomer(id) {
        this.setState({
            customer: id
        })
    }

    removeFromTeam(id) {
        let users = this.state.team.filter(user => user._id !== id)
        this.setState({
            team: users
        })
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    async createProject() {
        if(this.state.customer !== undefined){
            let newProject = {
                company: this.state.customer,
                description: this.state.description,
                deadline: this.state.deadline,
                team: this.state.team,
                date: Date.now(),
                projectname: this.state.projectname,
    
            }
            await this.context.addProject(newProject)
            this.setState({ showModal: !this.state.showModal })
            await this.context.getProjects()
        } else {
            this.setState({
                feedback: {
                    display: "block"
                }
            })
        }
    }

    showModal(event) {
        if (["newBtn", "modalOverlay"].includes(event.target.classList[0])) {
            this.setState({ showModal: !this.state.showModal })

        }
    }

    showWarning(event, id) {
        let position = event.target.getBoundingClientRect()
        this.setState({
            warning: {
                left: position.x + 40,
                top: position.y - 40
            },
            deleteProject: id
        })
    }

    closeWarning() {
        this.setState({
            warning: {
                display: "none"
            }
        })
    }

    async deleteProject(id) {
        this.setState({
            warning: {
                display: "none"
            }
        })
        await this.context.deleteProject(id)
        await this.context.getProjects()
    }


    render() {

        return (
            <>
                <span className="inlineWrapper"><h1>Projektoversigt</h1><button className="newBtn" onClick={event => this.showModal(event)}><i className="material-icons-outlined">content_copy</i>OPRET NYT PROJEKT</button></span>
                <ProjectContext.Consumer>
                    {(context) => (
                        <>
                            <div className="warningBox" style={this.state.warning}>
                                <span className="warningPointer"></span>
                                <p>Du er ved at slette et projekt. Er du sikker?</p>
                                <span className="closeWarning" onClick={() => this.closeWarning()}>x</span>
                                <button onClick={() => this.deleteProject(this.state.deleteProject)}>Slet projekt</button>
                            </div>

                            {this.state.showModal ? <>
                                <div className="modal">
                                    <div className="modalOverlay" onClick={event => this.showModal(event)}>
                                        <div className="modalContent">
                                            <h2 className="modalTitle">Nyt projekt</h2>
                                            <div style={this.state.feedback} className="warningFeedback">
                                            <span className="material-icons">error_outline</span>
                                            <span>Vælg en kunde fra listen.</span>
                                            </div>
                                            <div>
                                                <AutocompleteCustomer addCustomer={(id) => this.addCustomer(id)}></AutocompleteCustomer>
                                                <input className="modalInput" type="text" placeholder="Navngiv projektet" name="projectname" onChange={event => this.handleChange(event)}></input>
                                                <input className="modalInput" type="date" placeholder="Deadline" name="deadline" onChange={event => this.handleChange(event)}></input>
                                                <Autocomplete
                                                    updateTeam={(id) => this.updateTeam(id)}
                                                    removeFromTeam={(id) => this.removeFromTeam(id)}
                                                    team={this.state.team}>
                                                </Autocomplete>
                                                <textarea className="modalInput modalTextArea" type="text" placeholder="Beskriv projektet" name="description" onChange={event => this.handleChange(event)}></textarea>
                                            </div>
                                            <button className="modalBtn" onClick={() => this.createProject()}>OPRET <i className="material-icons">library_add_check</i></button>
                                        </div>
                                    </div>
                                </div>
                            </> : <></>}

                            <div className="customerGrid">
                                {context.state.projects.map(project =>
                                    <div className="customerContainer">
                                        <div className="customerName"><Link to={`/project/${project._id}`}><h3 className="customerTitle">{project.projectname}</h3></Link><span onClick={(event) => this.showWarning(event, project._id)} className="deleteCustomer">x</span></div>
                                        <div className="customerDesc">{project.description}</div>
                                        <div className="projectInfo"><span>{this.getDeadline(project.deadline)}</span> {project.team.map(t => <img alt="" className="projectEmployeeImg" title={t.fullname} src={t.imageurl}></img>)}</div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </ProjectContext.Consumer>
            </>
        );
    }
}

Projects.contextType = ProjectContext;

export default Projects;
