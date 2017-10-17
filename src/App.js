import React, { Component } from 'react';
import axios from 'axios';

import { SIBI } from './config';

import './App.css';
import logo from './logo.png'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      sent: false,
      contact: {}
    }

    this.firstNameChange = this.firstNameChange.bind(this);
    this.lastNameChange = this.lastNameChange.bind(this);
    this.companyChange = this.companyChange.bind(this);
    this.emailChange = this.emailChange.bind(this);
    this.messageChange = this.messageChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  renderButton() {
    if(this.state.loading === true) return (
      <button className="btn btn-default mt10" disabled>
        <i className="fa fa-spinner fa-pulse"></i>
        Loading
      </button>
    );

    return (
      <button className="btn btn-default mt10" onClick={ this.submitForm }>
        Submit
      </button>
    );
  }

  renderAlert() {
    if(this.state.sent === true) return (
      <div className="alert alert-success alert-dismissible" role="alert">
        <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => this.setState({ sent: false }) }>
          <span aria-hidden="true">&times;</span>
        </button>
        Your message has been sent, we'll get back to you shortly.
      </div>
    );

    if(this.state.error !== undefined) return (
      <div className="alert alert-danger alert-dismissible" role="alert">
        <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => this.setState({ error: undefined }) }>
          <span aria-hidden="true">&times;</span>
        </button>

        { this.state.error }
      </div>
    );
  }

  submitForm() {
    const { first_name, last_name, email, message } = this.state.contact;
    if(!first_name || !last_name || !message) return this.setState({ error: 'Please fill out all required fields' });

    this.setState({ loading: true });

    axios.post(`${ SIBI.host }/contacts`, this.state.contact).then(resp => {
      let data = resp.data;
      if(data.error !== undefined) return this.setState({ error: data.message, loading: false });
      this.setState({ contact: {}, loading: false, sent: true });
    }).catch(err => {
      this.setState({ error: 'Failed to connect with API, please try again or contact support if this issue persists', loading: false });
    });
  }

  firstNameChange(e) {
    this.setState({ contact: { ...this.state.contact, first_name: e.target.value } });
  }

  lastNameChange(e) {
    this.setState({ contact: { ...this.state.contact, last_name: e.target.value } });
  }

  companyChange(e) {
    this.setState({ contact: { ...this.state.contact, company: e.target.value } })
  }

  emailChange(e) {
    this.setState({ contact: { ...this.state.contact, email: e.target.value } })
  }

  messageChange(e) {
    this.setState({ contact: { ...this.state.contact, message: e.target.value } })
  }

  render() {
    return (
      <div className="app">
        <header className="row app-header">
          <img src={ logo } className="app-logo" alt="logo" />
          <h1 className="app-title">Contact Us</h1>
        </header>
        <div className="container p20">
          { this.renderAlert() }
          <div className="col-sm-4 col-sm-offset-4">
            <input className="form-control" type="text" placeholder="First name" onChange={ this.firstNameChange } />
            <input className="form-control" type="text" placeholder="Last name" onChange={ this.lastNameChange } />
            <input className="form-control" type="text" placeholder="Company" onChange={ this.companyChange } />
            <input className="form-control" type="email" placeholder="Email" onChange={ this.emailChange } />
            <textarea className="form-control" placeholder="Questions, Comments, etc." onChange={ this.messageChange } ></textarea>
            { this.renderButton() }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
