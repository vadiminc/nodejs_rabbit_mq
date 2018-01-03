import React, { Component } from 'react';
import { BrowserRouter, Link} from 'react-router-dom'
import {observer, inject, Provider} from 'mobx-react';


import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;

@inject('mainStore')
@Form.create()
@observer
export default class Signup extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        console.log('Received values of form: ', values);
        return
      }
      const { mainStore } = this.props;
      mainStore.signUp(values)
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="login-form"  style={{maxWidth: '400px', margin: '0 auto', paddingTop: '30px'}}>
        <h3 style={{textAlign: 'center'}}>Register</h3>
        <FormItem>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} autoComplete="new-password" type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('confirm', {
            rules: [{ required: true, message: 'Please confirm password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} autoComplete="new-password" type="password" placeholder="Confirm Password" />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="button" className="login-form-button"  onClick={this.handleSubmit} >
            Register
          </Button>
          <br/>
          Or <Link to="/sign-in">Login!</Link>
        </FormItem>
      </Form>
    );
  }
}

