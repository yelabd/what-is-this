import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import ImageUploader from 'react-image-uploader';
import axios from 'axios';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Nav from 'react-bootstrap/lib/Nav';
import Navbar from 'react-bootstrap/lib/Navbar';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import NavItem from 'react-bootstrap/lib/NavItem';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';


class App extends Component {

  constructor(props) {
        super(props);
           this.state = {
            loggedIn : false,
            username : '',
            password : '',
            api_key  : '',
           }
           this.onDrop = this.onDrop.bind(this);
           this.renderLoggedIn = this.renderLoggedIn.bind(this);
           this.renderDefault = this.renderDefault.bind(this);
           this.handleLogin = this.handleLogin.bind(this);
           this.handleRegister = this.handleRegister.bind(this);
  }

   onDrop(picture) {
        this.setState({
            pictures: this.state.picture.set(picture),
        });
    }
  handleLogin(event){
    var apiBaseUrl = "http://167.99.228.85:8000/api/user/login/";
    var self = this;
    var parameters = {
      "username" : self.state.username,
      "password" : self.state.password
    }
    const response = axios.post(apiBaseUrl, JSON.stringify(parameters), { headers: { 'Content-Type': 'application/json' } });
    console.log(response);
    this.setState({loggedIn:true})
    ReactDOM.render(<App />, document.getElementById('root'));
  }

  handleRegister(event){
    var apiBaseUrl = "http://167.99.228.85:8000/api/user/login/";
    var self = this;
    var parameters = {
      "username" : self.state.username,
      "password" : self.state.password
    }
  
    const response = axios.post(apiBaseUrl, JSON.stringify(parameters), { headers: { 'Content-Type': 'application/json' } });
    this.setState({loggedIn:true})
    console.log(response);
    ReactDOM.render(<App />, document.getElementById('root'));
  }

  renderLoggedIn(){
    return (
      <div className="App">
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#home">React-Bootstrap</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <NavItem eventKey={1} href="#">
              Link
            </NavItem>
            <NavItem eventKey={2} href="#">
              Link
            </NavItem>
            <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
              <MenuItem eventKey={3.1}>Action</MenuItem>
              <MenuItem eventKey={3.2}>Another action</MenuItem>
              <MenuItem eventKey={3.3}>Something else here</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey={3.4}>Separated link</MenuItem>
            </NavDropdown>
          </Nav>
        </Navbar>
        <header className="App-header">
          <h1 className="App-title">Welcome {this.state.username}! Upload a picture below!</h1>
        </header>
        <ImageUploader
                className="center"
                withIcon={true}
                withPreview={true}
                buttonClassName="btn btn-primary"
                buttonText='Choose images'
                onChange={this.onDrop}
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880} />
            
        <button className="btn btn-primary">Classify Image</button>
      </div>
    );
  }
  renderDefault(){
    return (
      <div className="App"> 
       <MuiThemeProvider>
        <header className="App-header">
          <h1 className="App-title">Welcome to "What is this?"</h1>
        </header>
        <br/>
        <header className="Prompt">
          <h2 className="Login">Please login/register below!</h2>
        </header>
         <TextField
             hintText="Enter your Username"
             floatingLabelText="Username"
             onChange = {(event,newValue) => this.setState({username:newValue})} 
             />
           <br/>
             <TextField
               type="password"
               hintText="Enter your Password"
               floatingLabelText="Password"
               onChange = {(event,newValue) => this.setState({password:newValue})} 
              />
              <br/>
              <br/>
             <RaisedButton label="Login" primary={true} onClick={(event) => this.handleLogin(event)}/>
              &nbsp; &nbsp; &nbsp; or &nbsp; &nbsp; &nbsp;
             <RaisedButton label="Register" primary={true} onClick={(event) => this.handleRegister(event)}/>
        </MuiThemeProvider>
      </div>
    );
  }
  render() {
    if(this.state.loggedIn === true){
      return this.renderLoggedIn();
    } else{
      return this.renderDefault();
    }
  }
}

export default App;
