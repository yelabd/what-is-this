import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import ImageUploader from 'react-image-uploader';
import axios from 'axios';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dropzone from 'react-dropzone';
import AppBar from 'material-ui/AppBar';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import FileBase64 from 'react-file-base64';
import Base64 from 'base-64';
require('axios-debug')(axios);

class App extends Component {

  constructor(props) {
        super(props);
        this.baseIP = "http://167.99.228.85";
        this.basePort= "3000";
           this.state = {
            loggedIn : false,
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


   handleLogout(event){
    var apiBaseUrl = this.baseIP + ":" + this.basePort + "/api/user/logout/";
    var self = this;
    var headers={
      'Content-Type' : 'application/json',
      'Authorization': 'ApiKey ' + this.username + ':' + this.api_key
    }
     axios({ 
                url: apiBaseUrl,
                method:'post',
                headers : headers,
            })
            .then((response) => {
                if(response.data.success !== "false"){
                  this.setState({ 
                    loggedIn : false,
                  });
                }else{
                  this.setState({ errors : response.data.message });
                }
            })
            .catch(function(error) {
              self.setState({ errors : "Something went wrong. Please try again." });
            });


    this.setState({
      loggedIn:false,
      username:'',
      password : '',
      api_key  : '',
      errors : '',
    });
   }

   handleClassificationInfo(event){

   }

   handleListUserClassifications(event){

   }
   handleListAllClassifications(event){

   }

   onDrop(files) {
        this.setState({
            uploadedFile: files[0]
        });
    }

  handlePostClassification(event){
    const file = this.uploadedFile;
    var apiBaseUrl = this.baseIP + ":" + this.basePort + "/api/user/classification/create/";
    var self = this;
    if(this.loggedIn === true){
      var headers = {
        'Content-Type' : 'application/json',
        'Authorization': 'ApiKey ' + this.username + ':' + this.api_key
      }
      var parameters = {
        "photo" : "data:"+this.uploadedFile +";" + "base-64" + "," + Base64.encode(this.uploadedFile)
      }
       axios({ 
                url: apiBaseUrl,
                method:'post',
                headers : {
                   "Content-Type" : "application/json"
                },
                data : parameters
            })
            .then((response) => {
                if(response.data.success !== "false"){
                  this.setState({ 
                    loggedIn : true,
                    api_key : response.data.api_key,
                    username : response.data.username,
                  });
                }else{
                  this.setState({ errors : response.data.message });
                }
            })
            .catch(function(error) {
              self.setState({ errors : "Something went wrong. Please try again." });
            });

    }
  }

  handleLogin(event){
    var apiBaseUrl = this.baseIP + ":" + this.basePort + "/api/user/login/";
    var self = this;
    var parameters = {
      "username" : self.state.username,
      "password" : self.state.password
    }
    axios({ 
                url: apiBaseUrl,
                method:'post',
                headers : {
                   "Content-Type" : "application/json"
                },
                data : parameters
            })
            .then((response) => {
                if(response.data.success !== "false"){
                  this.setState({ 
                    loggedIn : true,
                    api_key : response.data.api_key,
                    username : response.data.username,
                  });
                }else{
                  this.setState({ errors : response.data.message });
                }
            })
            .catch(function(error) {
              self.setState({ errors : "Something went wrong. Please try again." });
            });
    ReactDOM.render(<App />, document.getElementById('root'));
  }

  handleRegister(event){
    var apiBaseUrl = this.baseIP + ":" + this.basePort + "/api/user/register/";
    var self = this;
    var parameters = {
      "username" : self.state.username,
      "password" : self.state.password
    }
  
    axios({ 
                url: apiBaseUrl,
                method:'post',
                headers : {
                   "Content-Type" : "application/json"
                },
                data : parameters
            })
            .then((response) => {
                if(response.data.success !== "false"){
                  this.setState({ 
                    loggedIn : true,
                    api_key : response.data.api_key,
                    username : response.data.username,
                  });
                }else{
                  this.setState({ errors : response.data.message });
                }
            })
            .catch(function(error) {
              self.setState({ errors : "Something went wrong. Please try again." });
            });
    ReactDOM.render(<App />, document.getElementById('root'));
  }

  renderLoggedIn(){
    return (
      <div>
      <MuiThemeProvider>   
        <AppBar title="What is this?" iconElementRight={
            <RaisedButton label="Logout" onClick={(event) => this.handleLogout(event)}/>
        }
        iconElementLeft={
          <DropDownMenu menuItems={ 
            <MenuItem primaryText='New Classification' onClick={(event) => this.renderLoggedIn(event)}/> ,
            <MenuItem primaryText='My Classifications' onClick={(event) => this.handleListUserClassifications(event)}/> ,
            <MenuItem primaryText='All Classifications' onClick={(event) => this.handleListAllClassifications(event)}/>
         }/>
      }/>
          <div className="App">
            <header className="App-header">
              <h1 className="App-title">Welcome {this.state.username}! Classify an image below!</h1>
            </header>
            <Dropzone
              multiple={false}
              accept="image/*"
              onDrop={this.onDrop}>
              <p>Drop an image or click to select a file to upload.</p>
            </Dropzone> 
              <RaisedButton label="Classify!" primary={true} onClick={(event) => this.handlePostClassification(event)}/>
          </div>
          </MuiThemeProvider>
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
        <span className="label label-danger">{this.state.errors}</span>
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
