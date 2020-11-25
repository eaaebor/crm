import React, { Component } from 'react';
import { UserContext } from './Contexts/UserProvider';
import moment from 'moment'


class EditUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updatedUser: {

            }
        }
    }

    handleChange(event) {
        this.setState({
            updatedUser: {
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

    async updateUser() {
        await this.context.updateFullUser(this.state.updatedUser, this.props.username)
        await this.props.update()
        this.props.disableEdit()
    }

    render() {

        return (
            <>

                <UserContext.Consumer>
                    {(context) => (
                        <>
                            <div className="customerProfile">
                                <span className="editBtn material-icons-outlined highlightExit" onClick={() => this.props.disableEdit()}>close</span>
                                <span title="Gem ændringer" className="editBtn material-icons-outlined highlightSave" onClick={() => this.updateUser()}>save</span>
                                <h2>Medarbejderoplysninger</h2>
                                <div className="customerDetails">
                                    <span className="customerLabel">Fulde navn</span><input onChange={event => this.handleChange(event)} className="editInput" name="fullname" defaultValue={context.state.user.fullname}></input>
                                    <span className="customerLabel">Titel</span><input onChange={event => this.handleChange(event)} className="editInput" name="title" defaultValue={context.state.user.title}></input>
                                    <span className="customerLabel">Email</span><input onChange={event => this.handleChange(event)} className="editInput" name="email" defaultValue={context.state.user.email}></input>
                                    <span className="customerLabel">Telefon</span><input onChange={event => this.handleChange(event)} className="editInput" name="phone" defaultValue={context.state.user.phone}></input>
                                    <span className="customerLabel">Billede URL</span><input onChange={event => this.handleChange(event)} className="editInput" name="imageurl" defaultValue={context.state.user.imageurl}></input>
                                    <span className="customerLabel">Profil oprettet</span><span name="date">{moment(context.state.user.date).format('MMM Do YY')}</span>
                                </div>
                            </div>
                        </>
                    )}
                </UserContext.Consumer>
            </>
        );
    }
}

EditUser.contextType = UserContext;

export default EditUser;
