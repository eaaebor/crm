import React, { Component } from 'react';
import { UserContext } from './Contexts/UserProvider';

class Autocomplete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        }
    }

    async componentDidMount() {
        await this.context.getUsers()
    }

    handleChange(event) {
        this.setState({
            style: { display: "block"},
            [event.target.name]: event.target.value
        }, () => {
            let users = this.context.state.users.filter(user => 
                user.fullname.includes(this.state.user) &&
                this.props.team.map(t => t._id).indexOf(user._id) < 0)
            this.setState({users: users})
        });
    }

    hideSuggestions() {
        this.setState({style: {display: "none"}})
        document.getElementById("sInput").value = " "
    }

    render() {

        let results = this.state.users.map(user =>
            <div className="suggestion" style={this.state.style} onClick={() => { this.props.updateTeam(user); this.hideSuggestions() }}>
                <img className="suggestionImg" alt="" src={user.imageurl}></img>
                <span className="suggestionName">{user.fullname}</span>
                <span className="suggestionTitle"> - {user.title}</span>
            </div>)

        let selected = this.props.team.map(t => <img alt="" className="selectedImg" src={t.imageurl} onClick={() => { this.props.removeFromTeam(t._id) }}></img>)

        return (
            <>
                <div className="inputContainer">
                    <input autoComplete="off" id="sInput" className="suggestionInput" type="text" placeholder="Ansvarlige for projektet" name="user" onChange={event => this.handleChange(event)}></input>
                    <span className="selectedTeam">{selected}</span>
                </div>
                <div className="suggestionContainer">{results}</div>
            </>
        );
    }
}

Autocomplete.contextType = UserContext;

export default Autocomplete;
