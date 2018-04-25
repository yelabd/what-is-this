import React, { Component } from 'react';
import './App.css';
import { Button } from 'react-bootstrap';
import ImageUploader from 'react-image-uploader';
import axios from 'axios';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

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
           this.handleClick = this.handleClick.bind(this);
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
      "username" : this.state.username,
      "password" : this.state.password
    }
    axios.post(apiBaseUrl, parameters);
  }
  renderRegister(){

  }
  renderLoggedIn(){
    return (
      <div className="App">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="Container-fluid">
              <div className="navbar-header">
                <a href="" className="navbar-brand">What is this??</a>
              </div>
            </div>
          </nav>     
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
        <header className="Prompt">
          <h2 className="Login">Please login below!</h2>
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
             <RaisedButton label="Submit" primary={true} onClick={(event) => this.handleLogin(event)}/>
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
