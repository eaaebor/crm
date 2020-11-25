import React, { Component } from 'react';
import { Router, Link } from "@reach/router";
import AuthService from "./AuthService";
import UserProvider from "./Contexts/UserProvider";
import CustomerProvider from "./Contexts/CustomerProvider";
import ProjectProvider from "./Contexts/ProjectProvider";
import Login from "./Login";
import Users from "./Users";
import User from "./User";
import Customers from "./Customers";
import Customer from "./Customer";
import Projects from "./Projects";
import Project from "./Project";
import ProjectReload from "./ProjectReload";
import CustomerReload from "./CustomerReload";
import TopBar from "./TopBar";
import News from "./News";
import './App.css';

class App extends Component {
  API_URL = process.env.REACT_APP_API_URL;;

  constructor(props) {
    super(props);
    this.Auth = new AuthService(`${this.API_URL}/user/authenticate`);
  }

  activeMenu(event){
    document.getElementsByClassName("active")[0].classList.remove("active");
    event.currentTarget.classList.add("active")
  }

  render() {

    let isLoggedIn = localStorage.getItem("username")

    return (
      <>

        {isLoggedIn ?
          <>
            <nav>
              <Link to="/"><li onClick={event => this.activeMenu(event)} className="active"><i className="material-icons-outlined">store</i>Forside</li></Link>
              <Link to="/users"><li onClick={event => this.activeMenu(event)}><i className="material-icons-outlined">face</i>Medarbejdere</li></Link>
              <Link to="/customers"><li onClick={event => this.activeMenu(event)}><i className="material-icons-outlined">local_mall</i>Kunder</li></Link>
              <Link to="/projects"><li onClick={event => this.activeMenu(event)}><i className="material-icons-outlined">content_copy</i>Projekter</li></Link>
            </nav>
          </>
          :
          <>
            <nav>
              <li><Link to="/">Log ind</Link></li>
            </nav>
          </>}
        <CustomerProvider>
        <ProjectProvider>
          <UserProvider>
            <TopBar></TopBar>
            <ProjectReload></ProjectReload>
            <CustomerReload></CustomerReload>
            <div className="container">
              <Router>
                {isLoggedIn ?
                  <>
                    <Users path="/users"></Users>
                    <User path="/user/:username"></User>
                    <Customer path="/customer/:id"></Customer>
                    <Customers path="/customers"></Customers>
                    <Projects path="/projects"></Projects>
                    <Project path="/project/:id"></Project>
                    <News path="/"></News>
                  </>
                  :
                  <>
                    <Login path="/" login={(username, password) => this.login(username, password)}></Login>
                  </>}
              </Router>
            </div>
          </UserProvider>
        </ProjectProvider>
        </CustomerProvider>
      </>
    );
  }
}

export default App;
