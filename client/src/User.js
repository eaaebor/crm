import React, { Component } from 'react';
import { UserContext } from './Contexts/UserProvider';
import { ProjectContext } from './Contexts/ProjectProvider';
import { CustomerContext } from './Contexts/CustomerProvider';
import { Link } from "@reach/router";
import moment from 'moment'
import EditUser from './EditUser';


class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            style: {
                display: "none"
            }
        }
    }

    async componentDidMount() {
        await this.context.getUsers()
        await this.context.getUser(this.props.username)
    }

    async fetchNewData(){
        await this.context.getUsers()
        await this.context.getUser(this.props.username)
    }

    editUser(event) {
        let position = event.currentTarget.getBoundingClientRect()
        event.preventDefault()
        this.setState({
            oldValue: event.currentTarget.textContent,
            style: {
                position: "absolute",
                left: position.x,
                top: position.y - 5
            },
            overlay: {
                width: "100vw",
                height: "100vw",
                top: 0,
                left: 0,
                position: "fixed"
            },
            updateValue: {
                name: event.target.getAttribute("name"),
                id: this.context.state.user._id,
                newValue: ""
            }
        })
    }

    getDeadline(date) {
        if (date !== undefined) {
            let deadline = moment(date).diff(moment(), 'days')

            if (deadline < 0) { return (<span className="deadlineLate">Overskredet med {deadline * -1 } dage</span>) }
            else if (deadline > 0 && deadline < 10) { return (<span className="deadlineSoon">{deadline} dage til deadline</span>) }
            else if (deadline > 10) { return (<span className="deadlineLong">{deadline} dage til deadline</span>) }
        }
    }

    updateField(event) {
        this.setState({
            updateValue: {
                ...this.state.updateValue,
                newValue: event.target.value
            }
        })
    }

    async updateFieldRequest(event) {
        event.preventDefault()
        // Load the updated customers through context
        await this.context.updateUser(this.state.updateValue)
        await this.fetchNewData()
        // Hide the input field
        this.setState({
            style: { display: "none" }
        })
        // Set the input field value to empty
        document.getElementById("updateCustomer").value = ""
    }

    closeEdit(event) {
        // Close the overlay on click outside of the update field
        if (event.target === document.getElementsByClassName("editContainerOverlay")[0]) {
            this.setState({
                overlay: {
                    display: "none"
                }
            })
        }
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
                <UserContext.Consumer>
                    {(context) => (
                        <>
                        
                            <h1>Profil for: {context.state.user.fullname}</h1>
                            <div className="profileContainer">

                            {this.state.allowEdit ?
                                    <EditUser
                                        username={this.props.username}
                                        disableEdit={() => this.disableEdit()}
                                        update={() => this.fetchNewData()}>
                                    </EditUser> : <></>}

                                <div className="customerProfile" style={this.state.editEnabled}>
                                    <span className="material-icons-outlined editBtn" onClick={(event) => this.allowEdit(event)}>post_add</span>
                                    <h2>Medarbejderoplysninger</h2>
                                    <div className="customerDetails">
                                        <span className="customerLabel">Fulde navn</span><span className="edit" name="fullname" onContextMenu={event => this.editUser(event)}>{context.state.user.fullname}</span>
                                        <span className="customerLabel">Titel</span><span className="edit" name="title" onContextMenu={event => this.editUser(event)}>{context.state.user.title}</span>
                                        <span className="customerLabel">Email</span><span className="edit" name="email" onContextMenu={event => this.editUser(event)}>{context.state.user.email}</span>
                                        <span className="customerLabel">Telefon</span><span className="edit" name="phone" onContextMenu={event => this.editUser(event)}>{context.state.user.phone}</span>
                                        <span className="customerLabel">Billede URL</span><span className="edit" name="imageurl" onContextMenu={event => this.editUser(event)}>Højreklik for at opdatere</span>
                                        <span className="customerLabel">Profil oprettet</span><span name="date">{moment(context.state.user.date).format('MMM Do YY')}</span>
                                    </div>
                                </div>

                                <div className="profileImgContainer">
                                    <img className="profileImg" alt="Medarbejderbillede" src={context.state.user.imageurl}></img>
                                </div>

                                <div className="userProfile">
                                    <h2>Projekter</h2>
                                    <ProjectContext.Consumer>
                                        {(context) => (
                                            <>
                                                {context.state.projects.map(p => p.team.map(t => t.username === this.props.username ?
                                                    <div className="profileComment">
                                                        <Link to={"/project/" + p._id}><span>{p.projectname}</span></Link>
                                                        <div>{p.description}</div>
                                                        <div className="projectInfo">
                                                            <span>{this.getDeadline(p.deadline)}</span>
                                                            {p.team.map(img => <img alt="" className="projectEmployeeImg" title={img.fullname} src={img.imageurl}></img>)}
                                                            </div>
                                                    </div> : <></>))}
                                            </>
                                        )}
                                    </ProjectContext.Consumer>
                                </div>

                                <div className="userProfile">
                                    <h2>Kommentarer</h2>
                                    <CustomerContext.Consumer>
                                        {(context) => (
                                            <>
                                                {context.state.customers.map(c => c.comments.map(co => co.username === this.props.username ?
                                                    <div className="profileComment">
                                                        <div className="profileCommentOn">
                                                            <span>{this.props.username} </span>skrev en kommentar på: 
                                                            <Link to={"/customer/" + c._id}>
                                                                <span> {c.company}</span>
                                                            </Link>
                                                        </div>
                                                        <div className="profileCommentDate">{moment(co.date).fromNow()}</div>
                                                        <div className="profileCommentText">{co.comment}</div>
                                                    </div> : <></>))}
                                            </>
                                        )}
                                    </CustomerContext.Consumer>
                                </div>

                            </div>

                            <div className="editContainerOverlay" style={this.state.overlay} onClick={(event) => this.closeEdit(event)}>
                                <div className="editContainer" style={this.state.style}>
                                    <div className="editContent">
                                        <form>
                                            <input id="updateCustomer" placeholder={this.state.oldValue} type="text" defaultValue={this.state.edit} onChange={(event) => this.updateField(event)}></input>
                                            <button type="submit" onClick={(event) => this.updateFieldRequest(event)}>Gem</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </UserContext.Consumer>
            </>
        );
    }
}

User.contextType = UserContext;

export default User;
