import {observable, computed, asStructure, extendObservable, action, ObservableMap} from 'mobx';
import JsCookies from 'js-cookie';


const pathBase = 'http://localhost:4000'



export default class Main {

  constructor(){
    const userJsonString = JsCookies.get('user');
    const user = userJsonString ? JSON.parse( userJsonString ): null
    extendObservable(this, {
      user,
      tasks : new ObservableMap()
    })
    this.socket = window.io.connect(pathBase);
    this.socket.on('task_completed', (msg) => {
      this.tasks.set(msg.id, msg)
    });
  }

  @action setUser = (user) => {
    if(user){
      JsCookies.set('user', JSON.stringify(user));
      this.user = user
    }else{
      JsCookies.remove('user');
      this.user = null
    }
  }

  @action signIn = (values) => {
    return fetch(`${pathBase}/login`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(values)
    })
    .then(res => res.json())
    .then(res => this.setUser(res))
  }

  @action signUp = (values) => {
    return fetch(`${pathBase}/register`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(values)
    })
    .then(res => res.json())
    .then(res => this.setUser(res))
  }

  @action signOut = () => {
    this.setUser(null)
    window.location = '/'
  }


  @action generate = (values) => {
    const userJsonString = JsCookies.get('user');
    const user = userJsonString ? JSON.parse( userJsonString ): null
    return fetch(`${pathBase}/generate`, {
      headers: {
        'Authorization' : user.token,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(values)
    })
    .then(res => res.json())
    .catch( err => {
      alert(err)
      console.error(err)
    })
  }

}