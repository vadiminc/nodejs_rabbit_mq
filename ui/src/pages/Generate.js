import React, { Component } from 'react';
import { BrowserRouter, Link } from 'react-router-dom'
import { observer, inject, Provider } from 'mobx-react';
import moment from 'moment'



import { Form, Icon, Input, Button, Checkbox, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

@inject('mainStore')
@Form.create()
@observer
export default class Signin extends Component {
  logOut = () => {

  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { mainStore } = this.props;
    const { signOut } = mainStore;
    return (
      <div>
        <div style={{ textAlign: 'right' }}>
          <Button onClick={signOut} >Logout</Button>
        </div>
        <h3 style={{ textAlign: 'center' }}>New Task</h3>
        <CreateTask />
        <h3 style={{ textAlign: 'center' }}>Completed tasks</h3>
      </div>
    );
  }
}


@inject('mainStore')
@Form.create()
@observer
class CreateTask extends Component {
  state = {
    tasks: {}
  }

  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        console.log('Received values of form: ', values);
        return
      }
      const { mainStore } = this.props;
      mainStore.generate(values)
        .then(
        task => {
          mainStore.tasks.set(task.id, task)
        }
        )

    });
  }

  componentDidMount = () => {
    const { mainStore } = this.props;
    mainStore.tasks.clear()
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { mainStore } = this.props;

    return (
      <div>
        <Form style={{ width: '400px', margin: '0 auto' }}>
          <FormItem
            label="Time to process a task secconds (task complexity)"
          >
            {getFieldDecorator('time', {
              rules: [{ required: true, message: 'Please select your gender!' }],
              initialValue: 5
            })(
              <Select
                placeholder="Select a option and change input text above"
                onChange={this.handleSelectChange}
              >
                <Option value="5">5 sec</Option>
                <Option value="10">10 sec</Option>
                <Option value="20">20 sec</Option>
                <Option value="40">40 sec</Option>
                <Option value="80">80 sec</Option>
              </Select>
              )}
          </FormItem>
          <FormItem
            wrapperCol={{ span: 12, offset: 5 }}
          >
            <Button type="primary" htmlType="button" onClick={this.handleSubmit}>
              Add
        </Button>
          </FormItem>
        </Form>

        {
          mainStore.tasks.values().reverse()
          .map(el => {
            return (
              <div  key={el.id}>
                <span> time: {el.time}</span> |
                 <span> started at : {moment(el.createdTime).format() }</span> |
                 <span> completed at : { el.doneTime ? moment(el.doneTime).format() : 'processing ....' }</span>
                <hr/>
              </div>)
          })
        }

      </div>
    );
  }
}
