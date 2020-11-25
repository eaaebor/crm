import React, { Component } from 'react';
import AuthService from '../AuthService';

export const UserContext = React.createContext();


class UserProvider extends Component {
    API_URL = process.env.REACT_APP_API_URL;

    constructor(props) {
        super(props);
        this.Auth = new AuthService(`${this.API_URL}/user/authenticate`);
        this.state = {
            users: [],
            user: [],
            updates: [],
            loggedInUser: {
                status: {
                    text: "loading",
                    class: "loading"
                }
            }
        }
    }

    render() {


        return (
            <UserContext.Provider value={{
                state: this.state,
                login: async (username, password) => {
                    try {
                        await this.Auth.login(username, password);
                        this.setState({ isLoggedIn: true })
                        window.location.href = "/"
                    } catch (e) {
                        return e
                    }
                },
                logOut: () => {
                    this.Auth.logout()
                    this.setState({ isLoggedIn: false })
                    window.location.href = "/"
                },
                getUsers: async () => {
                    let response = await this.Auth.fetch(`${this.API_URL}/user/all-users`)
                    let users = await response.json()
                    this.setState({ users: users })
                },
                updateUser: async (object) => {
                    await this.Auth.fetch(`${this.API_URL}/user/edit-user`, {
                        method: 'PUT',
                        mode: 'cors',
                        body: JSON.stringify({
                            object: object,
                            byuser: localStorage.getItem("userid"),
                            date: Date.now()
                        })
                    })
                },
                updateFullUser: async (object, username) => {
                    await this.Auth.fetch(`${this.API_URL}/user/edit-full-user`, {
                        method: 'PUT',
                        mode: 'cors',
                        body: JSON.stringify({
                            object: object,
                            username: username,
                            byuser: localStorage.getItem("userid"),
                            date: Date.now()
                        })
                    })
                },
                getUpdates: async () => {
                    let response = await this.Auth.fetch(`${this.API_URL}/user/all-updates`)
                    let updates = await response.json()
                    this.setState({ updates: updates.reverse() })
                },
                getUser: async (username) => {
                    let user = await this.state.users.find(user => user.username === username)
                    this.setState({ user: user })
                },
                getLoggedInUser: async (username) => {
                    if (username !== null) {
                        let user = await this.state.users.find(user => user.username === username)
                        this.setState({ loggedInUser: user })
                        this.setState({ isLoggedIn: true })
                        localStorage.setItem("userid", this.state.loggedInUser._id)
                    }

                },
                updateUserStatus: async (text, style) => {
                    await this.Auth.fetch(`${this.API_URL}/user/update-status`, {
                        method: 'PUT',
                        mode: 'cors',
                        body: JSON.stringify({
                            text: text,
                            style: style,
                            username: this.state.loggedInUser.username,
                            fullname: this.state.loggedInUser.fullname,
                            date: Date.now(),
                            id: this.state.loggedInUser._id
                        })
                    })
                },
                newUser: async (user) => {
                    await this.Auth.fetch(`${this.API_URL}/user/new-user`, {
                        method: 'POST',
                        mode: 'cors',
                        body: JSON.stringify({
                            user: user,
                            id: this.state.loggedInUser._id
                        })
                    })
                },
                teamMember: (uid, pid) => {
                    let user = this.state.users.find(user => user._id === uid)
                    if (user !== undefined) {
                        return (
                            <div className="teamMember">
                                <span style={{ float: "right", cursor: "pointer" }} onClick={() => this.removeFromTeam(user._id, pid)}>x</span>
                                <div className="teamMemberImgContainer"><img className="teamMemberImg" src={user.imageurl} alt=""></img></div>
                                <div className="teamMemberName">{user.fullname}</div>
                                <div className="teamMemberTitle">{user.title}</div>
                            </div>
                        )
                    }
                },
            }}>
                {this.props.children}
            </UserContext.Provider>
        )
    }
}

export default UserProvider;