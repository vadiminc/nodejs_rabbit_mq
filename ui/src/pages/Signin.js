import React, { Component } from 'react';
import { BrowserRouter, Link } from 'react-router-dom'
import {observer, inject, Provider} from 'mobx-react';



import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;

@inject('mainStore')
@Form.create()
@observer
export default class Signin extends Component {
  state = {
    invalidCredentials: false
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        console.log('Received values of form: ', values);
        return
      }
      const { mainStore } = this.props;
      mainStore.signIn(values).catch( err => {
        this.setState({invalidCredentials: true})
      })
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="login-form" style={{maxWidth: '400px', margin: '0 auto', paddingTop: '30px'}}>
        <h3 style={{textAlign: 'center'}}>Log In</h3>
        <FormItem>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input onChange={ () => this.setState({invalidCredentials: false}) } prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input onChange={ () => this.setState({invalidCredentials: false}) } prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}  autoComplete="new-password" type="password" placeholder="Password" />
          )}
        </FormItem>
        { this.state.invalidCredentials && <span style={{color: 'red'}}>username or passwor was invalid</span> }
        <FormItem>
          <Button type="primary" htmlType="button" className="login-form-button" onClick={this.handleSubmit}>
            Log in
          </Button>
          <br/>
          Or <Link to="/sign-up">register now!</Link>
        </FormItem>
      </Form>
    );
  }
}


