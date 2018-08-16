import React from 'react'
import {Form,FieldGroup,Checkbox,FormControl,FormGroup,ControlLabel,Button} from 'react-bootstrap'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import '../styles/css/login.css';

export default class Login extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  }

  onSubmit(e){
    this.props.onLogin(this.state.email,this.state.password);
    e.preventDefault();
  }

  handleEmailInput(e){
    this.setState({'email':e.target.value})
  }

  handlePasswordInput(e){
    this.setState({'password':e.target.value})
  }

  render(){
    return(
      <div className="container-login">
        <div className="wrap-login">
          <div className="login-pic" style={{backgroundImage:`url("https://images.unsplash.com/photo-1512601086497-37250d726de8?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=9004b9f8bc2b3351406e5be7213eea79&auto=format&fit=crop&w=1500&q=80")`}}></div>
            <form className="login-form" onSubmit={(e)=>this.onSubmit(e)}>
              <span className="login-form-title" style={{paddingBottom:"36px"}}>
                Account Login
              </span>
              <div className="wrap-input left-input" style={{marginBottom:"24px"}}>
                <input className="input" type="text" name="username" placeholder="User name" onChange={(e)=>this.handleEmailInput(e)}></input>
                <span className="focus-input"></span>
              </div>
              <div className="wrap-input right-input" style={{marginBottom:"24px"}}>
                <input className="input" type="password" name="pass" placeholder="Password" onChange={(e)=>this.handlePasswordInput(e)}></input>
                <span className="focus-input"></span>
              </div>
              <div className="container-login-form-btn">
                <button className="login-form-btn" style={{marginBottom:"8px"}}>
                  Log in
                </button>
                <div onClick={()=>this.props.onSignUp(this.state.email,this.state.password)} className="login-form-btn">
                  Sign Up
                </div>
              </div>
          </form>
        </div>
      </div>
    )
  }
}
