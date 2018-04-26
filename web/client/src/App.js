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
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FileBase64 from 'react-file-base64';
import Base64 from 'base-64';
require('axios-debug')(axios);

class App extends Component {

  constructor(props) {
        super(props);
        this.baseIP = "http://167.99.228.85";
        this.basePort= "8000";
           this.state = {
            loggedIn : false,
            username : '',
            password : '',
            api_key  : '',
            user_id  : '',
            category_id: '',
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
           this.handleListUserClassifications = this.handleListUserClassifications.bind(this);
           this.handleClassificationInfo = this.handleClassificationInfo.bind(this);
           this.startOver = this.startOver.bind(this);
           this.renderCategories = this.renderCategories.bind(this);
           this.handleCategoryChange = this.handleCategoryChange.bind(this);
  }

  handleCategoryChange = (event, index, value) => this.setState({category_id: value});

  renderCategories(){
    console.log("Rendering Categories");
    var apiBaseUrl = this.baseIP + ":" + this.basePort + "/api/classification_category/";
    var self = this;
    var headers={
      'Content-Type' : 'application/json',
      'Authorization': 'ApiKey ' + this.state.username + ':' + this.state.api_key
    }
    axios({ 
                url: apiBaseUrl,
                method:'get',
                headers : headers,
            })
            .then((response) => {
                if(response.data.success !== "false"){
                  var items = [];
                  var objects = response.data.objects;
                  for(var i = 0; i < objects.length; i++){
                    console.log(objects[i].value);
                    items.push(
                      <MenuItem primaryText={objects[i].value} key={objects[i].value} value={objects[i].value}/>
                    );
                  }
                  return(items);
                }else{
                  return (
                    <MenuItem primaryText="No categories available" value="0"/>
                   );
                }
            })
            .catch(function(error) {
                return (
                    <MenuItem primaryText="No categories available" value="0"/>
                    );
            });
  }


   handleLogout(event){
    var apiBaseUrl = this.baseIP + ":" + this.basePort + "/api/user/logout/";
    var self = this;
    var headers={
      'Content-Type' : 'application/json',
      'Authorization': 'ApiKey ' + this.state.username + ':' + this.state.api_key
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
                  this.setState({ errors : response.data.reason });
                }
            })
            .catch(function(error) {
            });


    this.setState({
      loggedIn:false,
      username:'',
      password : '',
      api_key  : '',
      user_id : '',
      errors : '',
      category_id: '',
    });
   }

   handleClassificationInfo(event){

   }

   handleListUserClassifications(event){

   }

   onDrop(files) {
        this.setState({
            uploadedFile: files[0]
        });
    }

  handlePostClassification(event){

    const file = this.state.uploadedFile;
    var apiBaseUrl = this.baseIP + ":" + this.basePort + "/api/classification/create/";
    var self = this;
    if(this.state.loggedIn === true){
      var headers = {
        'Content-Type' : 'application/json',
        'Authorization': 'ApiKey ' + this.state.username + ':' + this.state.api_key
      }
      var parameters = {
        "photo" : "data:"+file.type +";base-64," + Base64.encode(file),
        "category_id": this.state.category_id
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
                  this.setState({ errors : response.data.reason });
                }
            })
            .catch(function(error) {
              self.setState({ errors : "Something went wrong. Please try again." });
            });
        }
        else{
          console.log("NOPE");
          this.setState({errors: "Please choose a category and/or image!"});
        }
        ReactDOM.render(<App />, document.getElementById('root'));
  }

  startOver(event){
    this.setState({
      uploadedFile : undefined
    });
    ReactDOM.render(<App />, document.getElementById('root'));
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
                    user_id : response.data.user.id,
                  });
                }else{
                  this.setState({ errors : response.data.message });
                }
            })
            .catch(function(error) {
              self.setState({ errors : error.response.data.reason });
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
                    user_id : response.data.user.id,
                  });
                }else{
                  this.setState({ errors : response.data.message });
                }
            })
            .catch(function(error) {
              self.setState({ errors : error.response.data.reason  });
            });
    ReactDOM.render(<App />, document.getElementById('root'));
  }

  renderPicture(){
    if(this.state.uploadedFile === undefined){
      return (
        <a className="center">
            <Dropzone
              multiple={false}
              accept="image/*"
              onDrop={this.onDrop}>
              <p>Drop an image or click to select an image to classify.</p>
            </Dropzone> 
            </a>
        );
    }else{
      return (
         <a className="center">
          <p>Uploaded {this.state.uploadedFile.name} </p>
         </a>
      )
    }
  }

  renderLoggedIn(){
    return (
      <div>
      <MuiThemeProvider>   
        <AppBar title="What is this?" iconElementRight={
            <RaisedButton label="Logout" onClick={(event) => this.handleLogout(event)}/>
        }
        iconElementLeft={
          <DropDownMenu text="Options">
              <MenuItem primaryText="New Classification" onClick={(event) => this.startOver(event)}/>
              <MenuItem primaryText="My Classifications" onClick={(event) => this.handleListUserClassifications(event)}/>
         </DropDownMenu>
      }/>
          <div className="App">
            <header className="App-header">
              <h1 className="App-title">Welcome {this.state.username}! Classify an image below!</h1>
            </header>
            <br/>
            <br/>
              {this.renderPicture()}
            <br/>
            <SelectField required={true} value={this.state.value} hintText="What category does your image fall under?" onChange={this.handleCategoryChange}>
              {this.renderCategories()}
              <MenuItem value="2" primaryText="Dogs v. Cats" key="2"/>
              <MenuItem value="1" primaryText="Flowers" key="1"/>
            </SelectField>
            <br/>
              <RaisedButton label="Classify!" primary={true} onClick={(event) => this.handlePostClassification(event)}/>
              <br/>
              <br/>
              <span className="label label-danger">{this.state.errors}</span>
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
