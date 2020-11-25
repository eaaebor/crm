import React, { Component } from 'react';
import { UserContext } from './Contexts/UserProvider';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            feedback: "",
            feedbackStyle: {
                display: "none"
            }
        }
    }

    async handleLogin(e) {
        e.preventDefault()
        let feedback = await this.context.login(this.state.username, this.state.password);
        this.setState({ feedback: feedback.message, feedbackStyle: {display: "block"} })
        await this.context.getUsers()
        await this.context.getLoggedInUser(localStorage.getItem("username"))
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        return (
            <>
                <div className="login">
                    <h1>Login</h1>
                    <form className="loginForm">
                        <div style={this.state.feedbackStyle} className="warningFeedback">
                            <span className="material-icons">error_outline</span>
                            <span>{this.state.feedback}</span>
                        </div>
                        <span className="label">Brugernavn</span>
                        <input onChange={event => this.handleChange(event)} name="username" type="text" placeholder="Brugernavn"></input><br />
                        <span className="label">Adgangskode</span>
                        <input onChange={event => this.handleChange(event)} name="password" type="password" placeholder="Password"></input><br />
                        <button onClick={e => this.handleLogin(e)}>Log ind</button>
                    </form>
                </div>
            </>
        );
    }
}

Login.contextType = UserContext;

export default Login;
