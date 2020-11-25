import React, { Component } from 'react';
import AuthService from '../AuthService';

export const ProjectContext = React.createContext();


class ProjectProvider extends Component {
    API_URL = process.env.REACT_APP_API_URL;

    constructor(props) {
        super(props);
        this.Auth = new AuthService(`${this.API_URL}/user/authenticate`);
        this.state = {
            projects: [],
            project: {
                team: [],
                comments: [],
            }
        }
    }

    render() {


        return (
            <ProjectContext.Provider value={{
                state: this.state,
                getProjects: async () => {
                    let response = await this.Auth.fetch(`${this.API_URL}/project/all-projects`)
                    let projects = await response.json()
                    this.setState({ projects: projects })
                    return <></>
                },
                getProject: async (id) => {
                    let project = await this.state.projects.find(project => project._id === id)
                    project.comments.reverse()
                    this.setState({ project: project })
                },
                addProject: async (project) => {
                    await this.Auth.fetch(`${this.API_URL}/project/new-project`, {
                        method: 'POST',
                        mode: 'cors',
                        body: JSON.stringify({
                            project: project,
                            byuser: localStorage.getItem("userid"),
                            date: Date.now()
                        })
                    })
                },
                newComment: async (id, comment) => {
                    await this.Auth.fetch(`${this.API_URL}/project/new-comment`, {
                        method: 'POST',
                        mode: 'cors',
                        body: JSON.stringify({
                            id: id,
                            comment: comment,
                            byuser: localStorage.getItem("userid")
                        })
                    })
                },
                deleteProject: async (id) => {
                    await this.Auth.fetch(`${this.API_URL}/project/delete-project`, {
                        method: 'DELETE',
                        mode: 'cors',
                        body: JSON.stringify({
                            id: id,
                            byuser: localStorage.getItem("userid"),
                            date: Date.now()
                        })
                    })
                },
                updateProject: async (object, id) => {
                    await this.Auth.fetch(`${this.API_URL}/project/edit-project`, {
                        method: 'POST',
                        mode: 'cors',
                        body: JSON.stringify({
                            object: object,
                            id: id,
                            byuser: localStorage.getItem("userid"),
                            date: Date.now()
                        })
                    })
                },
                addUserToProject: async (user, id) => {
                    await this.Auth.fetch(`${this.API_URL}/project/add-to-project`, {
                        method: 'PUT',
                        mode: 'cors',
                        body: JSON.stringify({
                            user: user,
                            byuser: localStorage.getItem("userid"),
                            date: Date.now(),
                            id: id
                        })
                    })
                },
                removeFromTeam: async (uid, pid) => {
                    await this.Auth.fetch(`${this.API_URL}/project/delete-from-team`, {
                        method: 'DELETE',
                        mode: 'cors',
                        body: JSON.stringify({
                            uid: uid,
                            pid: pid,
                            byuser: localStorage.getItem("userid"),
                            date: Date.now()
                        })
                    })
                },
                deleteComment: async (commentid, customerid) => {
                    await this.Auth.fetch(`${this.API_URL}/project/delete-comment`, {
                        method: 'DELETE',
                        mode: 'cors',
                        body: JSON.stringify({
                            commentid: commentid,
                            customerid: customerid,
                            byuser: localStorage.getItem("userid"),
                            date: Date.now()
                        })
                    })
                },
            }
            }>
                {this.props.children}
            </ProjectContext.Provider>
        )
    }
}

export default ProjectProvider;