import React, { Component } from 'react';
import { ProjectContext } from './Contexts/ProjectProvider';
import { UserContext } from './Contexts/UserProvider';
import moment from 'moment';
import { CustomerContext } from './Contexts/CustomerProvider';
import EditProject from './EditProject'
import { Link } from "@reach/router";


class Projects extends Component {
    constructor(props) {
        super(props);
        this.state = {
            team: [],
            teamList: {
                display: "none"
            },
            classes: "selectMemberContainer",
            style: {
                display: "none"
            }
        }
    }

    async componentDidMount() {
        await this.context.getProjects()
        await this.context.getProject(this.props.id)
    }

    async fetchNewData() {
        await this.context.getProjects()
        await this.context.getProject(this.props.id)
    }

    getDeadline(date) {
        if (date !== undefined) {
            let deadline = moment(date).diff(moment(), 'days')

            if (deadline < 0) { return (<span className="deadlineLate">Overskredet med {deadline * -1} dage</span>) }
            else if (deadline > 0 && deadline < 10) { return (<span className="deadlineSoon">{deadline} dage til deadline</span>) }
            else if (deadline > 10) { return (<span className="deadlineLong">{deadline} dage til deadline</span>) }
        }
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    async newComment(context) {
        if (this.state.comment !== null) {
            let comment = {
                comment: this.state.comment,
                username: context.username,
                fullname: context.fullname,
                date: Date.now(),
                imageurl: context.imageurl,
            }
            await this.context.newComment(this.context.state.project._id, comment)
            document.querySelector(".commentInput").value = ""
            await this.fetchNewData()
        }
    }

    async deleteComment(commentid, customerid) {
        await this.context.deleteComment(commentid, customerid)
        await this.fetchNewData()
    }

    displayUsers() {
        this.setState({
            addToTeam: {
                display: "none"
            },
            classes: "teamOverflow animate__animated animate__slideInDown"
        })
    }

    async addToTeam(user) {
        await this.context.addUserToProject(user, this.props.id)
        await this.fetchNewData()
    }

    async removeFromTeam(uid, pid) {
        await this.context.removeFromTeam(uid, pid)
        await this.fetchNewData()
    }

    allowEdit() {
        this.setState({
            allowEdit: true,
            editEnabled: {
                display: "none"
            }
        })
    }

    disableEdit() {
        this.setState({
            allowEdit: false,
            editEnabled: {
                display: "block"
            }
        })
    }


    render() {

        return (
            <>

                <ProjectContext.Consumer>
                    {(context) => (
                        <>
                            <div className="gridContainer">

                                {this.state.allowEdit ?
                                    <EditProject
                                        id={this.props.id}
                                        projectname={context.state.project.projectname}
                                        description={context.state.project.description}
                                        status={context.state.project.status}
                                        deadline={context.state.project.deadline}
                                        disableEdit={() => this.disableEdit()}
                                        update={() => this.fetchNewData()}>
                                    </EditProject> : <></>}

                                <div className="customerProfile" style={this.state.editEnabled}>
                                    <h1 className="customerTitle linebreak">Projektoplysninger</h1>
                                    <span className="editBtn material-icons-outlined" onClick={(event) => this.allowEdit(event)}>post_add</span>
                                    <div className="customerDetails">
                                        <span className="customerLabel">Projektnavn</span><span className="edit" name="projectname">{context.state.project.projectname}</span>
                                        <span className="customerLabel">Beskrivelse</span><span className="edit linebreak" name="projectname">{context.state.project.description}</span>
                                        <span className="customerLabel">Deadline</span><span className="edit" name="projectname">{context.state.project.deadline}</span>
                                        <span className="customerLabel">Dage til deadline</span><span name="projectname">{this.getDeadline(context.state.project.deadline)}</span>
                                        <span className="customerLabel">Status</span><span className="edit" name="projectname">{context.state.project.status}</span>
                                    </div>
                                </div>

                                <CustomerContext.Consumer>
                                    {(customer) => (
                                        <>
                                            {customer.displayCustomer(context.state.project.company)}
                                        </>
                                    )}
                                </CustomerContext.Consumer>
                            </div>

                            <UserContext.Consumer>
                                {(user) => (
                                    <>
                                        <h2>Team</h2>
                                        <div className="teamContainer">
                                            <div className="teamMember">

                                                <div onClick={() => this.displayUsers()} style={this.state.addToTeam}>
                                                    <div className="addMember">
                                                        <span className="material-icons">person_add_alt_1</span>
                                                    </div>
                                                    <div className="teamMemberName">Tilføj medarbejder</div>
                                                </div>

                                                <div className={this.state.classes}>
                                                    {user.state.users.sort((a, b) => a.fullname.localeCompare(b.fullname)).map(u =>
                                                        <div className="selectTeamMember" onClick={() => this.addToTeam(u)}>
                                                            <img className="selectTeamMemberImg" alt="Medarbejderbillede" src={u.imageurl}></img>
                                                            <span className="selectTeamMemberName">{u.fullname}</span>
                                                        </div>)}
                                                </div>

                                            </div>

                                            {context.state.project.team.map(t =>
                                                <div className="teamMember">
                                                    <span style={{ float: "right", cursor: "pointer" }} onClick={() => this.removeFromTeam(t._id, context.state.project._id)}>x</span>
                                                    <div className="teamMemberImgContainer"><img className="teamMemberImg" src={t.imageurl} alt="Medarbejderbillede"></img></div>
                                                    <div className="teamMemberName"><Link to={"/user/" + t.username}>{t.fullname}</Link></div>
                                                    <div className="teamMemberTitle">{t.title}</div>
                                                </div>
                                            )}
                                        </div>
                                    </>)}
                            </UserContext.Consumer>

                            <UserContext.Consumer>
                                {(user) => (
                                    <>  <h2>Tilføj kommentar</h2>
                                        <div className="newComment clearfix">
                                            <img alt="Medarbejderbillede" src={user.state.loggedInUser.imageurl} className="newCommentImg"></img>
                                            <textarea className="commentInput" type="text" placeholder="Skriv en kommentar" name="comment" onChange={event => this.handleChange(event)}></textarea>
                                            <button className="commentBtn" onClick={() => this.newComment(user.state.loggedInUser)}>Tilføj kommentar</button>
                                        </div>
                                    </>)}
                            </UserContext.Consumer>

                            <div className="allComments">
                                <h2>Kommentarer</h2>
                                {context.state.project.comments.map(comment =>
                                    <div className="commentContainer">
                                        <div className="commentAuthor">
                                            <span style={{ float: "right", cursor: "pointer" }} onClick={() => this.deleteComment(comment._id, context.state.project._id)}>x</span>
                                            <div className="commentImg"><img alt="Medarbejderbillede" src={comment.imageurl}></img></div>
                                            <span className="commentName">{comment.fullname}</span>
                                            <span className="commentDate">{moment(comment.date).fromNow()}</span>
                                            <div className="commentContent">{comment.comment}</div>
                                        </div>
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
