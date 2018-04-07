import React, { Component, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Routes from "./Routes";
import TopMenu from "./components/TopMenu";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      isAuthenticated: false,
      redirectTo: null,
      season: Date.now.year
    };

    this.handleMenuSelect = this.handleMenuSelect.bind(this);
  }
  
  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  handleLogout = event => {
    this.userHasAuthenticated(false);
  }

  handleMenuSelect(path) {
    if (path) {
      console.debug('New path: ' + path);
      const season = path.match('(?<=/season/)[0-9]{4}');
      console.debug('Selected season: ' + season);
      this.setState({ redirectTo: path, season: season ? season : this.state });
    }
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };

    return (
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Taça Barnabé</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              <LinkContainer to="/about">
                <NavItem>Sobre</NavItem>
              </LinkContainer>
              <LinkContainer to="/torneio">
                <NavItem>Torneio</NavItem>
              </LinkContainer>
              {this.state.isAuthenticated
                ? <NavItem onClick={this.handleLogout}>Logout</NavItem>
                : <Fragment>
                    <LinkContainer to="/login">
                      <NavItem>Login</NavItem>
                    </LinkContainer>
                  </Fragment>
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <TopMenu onMenuSelect={this.handleMenuSelect} />
        { this.state.redirectTo ? <Redirect push to={this.state.redirectTo} /> : "" }
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default App;
