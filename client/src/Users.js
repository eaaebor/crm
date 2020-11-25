import React, { Component } from 'react';
import { UserContext } from './Contexts/UserProvider';
import { Link } from "@reach/router";


class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        }
    }

    async componentDidMount() {
        await this.context.getUsers()
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    async newUser(event) {
        event.preventDefault()
        let newUser = {
            fullname: this.state.fullname,
            username: this.state.username,
            password: this.state.password,
            email: this.state.email,
            phone: this.state.phone,
            title: this.state.title,
            date: Date.now(),
            status: { text: "Ledig", class: "available" },
            imageurl: this.state.imageurl
        }
        await this.context.newUser(newUser)
        this.setState({ showModal: !this.state.showModal })
        await this.context.getUsers()
    }

    showModal(event) {
        if (["newBtn", "modalOverlay"].includes(event.target.classList[0])) {
            this.setState({ showModal: !this.state.showModal })

        }
    }

    render() {
        return (
            <>
                <UserContext.Consumer>
                    {(context) => (
                        <>

                            {this.state.showModal ? <>
                                <div className="modal">
                                    <div className="modalOverlay" onClick={event => this.showModal(event)}>
                                        <div className="modalContent">
                                            <h2 className="modalTitle">Ny medarbejder</h2>
                                            <form onSubmit={(event) => this.newUser(event)}>
                                                <div className="halfwidth">
                                                    <input required className="modalInput" type="text" placeholder="Brugernavn - Bruges til login" name="username" onChange={event => this.handleChange(event)}></input>
                                                    <input required className="modalInput" type="text" placeholder="Adgangskode - Bruges til login" name="password" onChange={event => this.handleChange(event)}></input>
                                                </div>
                                                <input required className="modalInput" type="text" placeholder="Medarbejderens fulde navn" name="fullname" onChange={event => this.handleChange(event)}></input>
                                                <input required className="modalInput" type="text" placeholder="Medarbejderens titel" name="title" onChange={event => this.handleChange(event)}></input>
                                                <div className="halfwidth">
                                                    <input required className="modalInput" type="text" placeholder="Medarbejderens email" name="email" onChange={event => this.handleChange(event)}></input>
                                                    <input className="modalInput" type="text" placeholder="Medarbejderens telefonnummer" name="phone" onChange={event => this.handleChange(event)}></input>
                                                </div>
                                                <input className="modalInput" type="text" placeholder="Link til billede af medarbejder" name="imageurl" onChange={event => this.handleChange(event)}></input>
                                                <button className="modalBtn" type="submit">OPRET MEDARBEJDER</button>
                                            </form>

                                        </div>
                                    </div>
                                </div>
                            </> : <></>}

                            <span className="inlineWrapper"><h1>Medarbejdere</h1><button className="newBtn" onClick={event => this.showModal(event)}><i className="material-icons-outlined">person_add</i>OPRET NY MEDARBEJDER</button></span>
                            {context.state.users.sort((a, b) => a.fullname.localeCompare(b.fullname)).map(user =>
                                <div className="userContainer">
                                    <div className="userImg"><Link to={`/user/${user.username}`}><img src={user.imageurl} alt="Medarbejderbillede"></img></Link></div>
                                    <div className="userFullName"><p><Link to={`/user/${user.username}`}>{user.fullname}</Link></p></div>
                                    <div className="userTitle"><p>{user.title}</p></div>
                                    <div className="userStatus"><p className={user.status.class}>{user.status.text}</p></div>
                                    <div className="userContactEmail"><a href={`mailto:${user.email}`}><p>{user.email}</p></a></div>
                                    <div className="userContactPhone"><a href={`tel:${user.phone}`}><p>{user.phone}</p></a></div>
                                </div>

                            )}
                        </>
                    )}
                </UserContext.Consumer>
            </>
        );
    }
}

Users.contextType = UserContext;

export default Users;
