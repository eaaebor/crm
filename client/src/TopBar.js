import React, { Component } from 'react';
import { UserContext } from './Contexts/UserProvider';
import { Link } from "@reach/router";


class TopBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showStatusMenu: false
        }
    }

    async componentDidMount() {
        await this.context.getUsers()
        await this.context.getLoggedInUser(localStorage.getItem("username"))
    }

    showStatusMenu(){
        this.setState({showStatusMenu: !this.state.showStatusMenu})
    }

    async updateUserStatus(text, style){
        await this.context.updateUserStatus(text, style)
        await this.context.getUsers()
        await this.context.getLoggedInUser(localStorage.getItem("username"))
        this.showStatusMenu()
    }

    render() {

        return (
            <>
                <UserContext.Consumer>
                    {(context) => (
                        <>
                            {context.state.isLoggedIn ?
                                <>
                                    <div className="topBar">
                                        <div className="topBarUserContainer">
                                            <div className="topBarUser">
                                                <span className="topBarUsername">{context.state.loggedInUser.fullname}</span>
                                                <span className="topBarWrapper">
                                                    <img className="topBarImg" src={context.state.loggedInUser.imageurl} alt="Medarbejderbillede" onClick={() => this.showStatusMenu()}></img>
                                                    <div className="topBarStatus" id={context.state.loggedInUser.status.class} onClick={() => this.showStatusMenu()}></div>
                                                    {this.state.showStatusMenu ? <>
                                                        <div className="topBarStatusMenu">
                                                            <li onClick={() => this.updateUserStatus("Ledig", "available")}>Ledig <span id="available"></span></li>
                                                            <li onClick={() => this.updateUserStatus("I et møde", "meeting")}>I et møde <span id="meeting"></span></li>
                                                            <li onClick={() => this.updateUserStatus("Arbejder hjemmefra", "wfh")}>Arbejder hjemmefra <span id="wfh"></span></li>
                                                            <li onClick={() => this.updateUserStatus("Syg", "sick")}>Syg<span id="sick"></span></li>
                                                            <li onClick={() => this.updateUserStatus("Ude af kontoret", "oof")}>Ude af kontoret<span id="oof"></span></li>
                                                            <li onClick={() => context.logOut()}>Log ud</li>
                                                        </div>
                                                    </> : <></>}
                                                </span>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </>
                                :
                                <>
                                    <div className="topBar">
                                        <div className="topBarUserContainer">
                                            <div className="topBarUser">
                                                <Link to="/">Log ind</Link>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }

                        </>
                    )}
                </UserContext.Consumer>
            </>
        );
    }
}

TopBar.contextType = UserContext;

export default TopBar;
