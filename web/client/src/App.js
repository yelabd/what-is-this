import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import ImageUploader from 'react-image-uploader';
import axios from 'axios';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dropzone from 'react-dropzone';

//literally all this for navbar
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';

class App extends Component {

  constructor(props) {
        super(props);
           this.state = {
            loggedIn : true,
            username : '',
            password : '',
            api_key  : '',
            errors : '',
           }

           //render functions
           this.renderLoggedIn = this.renderLoggedIn.bind(this);
           this.renderDefault = this.renderDefault.bind(this);

           //event handlers
           this.onDrop = this.onDrop.bind(this);
           this.handleLogin = this.handleLogin.bind(this);
           this.handleRegister = this.handleRegister.bind(this);
           this.handlePostClassification = this.handlePostClassification.bind(this);
           this.handleLogout = this.handleLogout.bind(this);
           this.handleListAllClassifications = this.handleListAllClassifications.bind(this);
           this.handleListUserClassifications = this.handleListUserClassifications.bind(this);
           this.handleClassificationInfo = this.handleClassificationInfo.bind(this);
  }

   onDrop(files) {
        this.setState({
            uploadedFile: files[0]
        });
    }

  handlePostClassification(event){
    const file = this.uploadedFile;
    var apiBaseUrl = "http:/167.99.228.85:8000/api/user/classification/create/";
    if(this.loggedIn === true){
      var headers = {
        'Content-Type' : 'application/json',
        'Authorization': 'ApiKey ' + this.username + ':' + this.api_key
      }
      var parameters = {
        'photo' : this.uploadedFile,
      }
      const response = axios.post(apiBaseUrl, JSON.stringify(parameters), headers);

    }
  }

  handleLogin(event){
    var apiBaseUrl = "http://167.99.228.85:8000/api/user/login/";
    var self = this;
    var parameters = {
      "username" : self.state.username,
      "password" : self.state.password
    }
    const response = axios.post(apiBaseUrl, JSON.stringify(parameters), { headers: { 'Content-Type': 'application/json' } }).catch(function(error){
      if(!error.status){
            self.setState({errors : "Something went wrong. Please try again."});
      }
    });
    console.log(response.data);
    if(response.data !== undefined){
      if(response.data.success === "failure"){
        this.setState({ errors : response.data.message });
      }else{
        this.setState({ 
            loggedIn : true,
            api_key : response.data.api_key,
            username : response.data.username,
        });
      }
    }
    ReactDOM.render(<App />, document.getElementById('root'));
  }

  handleRegister(event){
    var apiBaseUrl = "http://167.99.228.85:8000/api/user/login/";
    var self = this;
    var parameters = {
      "username" : self.state.username,
      "password" : self.state.password
    }
  
    const response = axios.post(apiBaseUrl, JSON.stringify(parameters), { headers: { 'Content-Type': 'application/json' } }).catch(function(error){
      if(!error.status){
            this.setState({errors : "Something went wrong. Please try again."});
      }
    });
    console.log(response.data);
    if(response.data !== undefined){
      if(response.data.success !== "failure"){
        this.setState({ errors : response.data.message });
      }else{
        this.setState({ 
            loggedIn : true,
            api_key : response.data.api_key,
            username : response.data.username,
        });
      }
    }
    console.log(response.data);
    ReactDOM.render(<App />, document.getElementById('root'));
  }

  renderLoggedIn(){
    return (
      <div>
          <div className="App">
            <header className="App-header">
              <h1 className="App-title">Welcome {this.state.username}! Upload a picture below!</h1>
            </header>
            <Dropzone
              multiple={false}
              accept="image/*"
              onDrop={this.onDrop}>
              <p>Drop an image or click to select a file to upload.</p>
            </Dropzone>
            <MuiThemeProvider>    
              <RaisedButton label="Classify!" primary={true} onClick={(event) => this.handlePostClassification(event)}/>
            </MuiThemeProvider>
          </div>
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
        <br/>
        <br/>
        <span class="label label-danger">{this.state.errors}</span>
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
