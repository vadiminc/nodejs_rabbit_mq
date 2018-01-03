import {promisify} from 'util'
import amqplib from 'amqplib'

let connection = null

export default () => {
  if ( connection ){
    return Promise.resolve(connection)
  }

  var open = require('amqplib').connect('amqp://localhost');

  // Publisher
  return open.then(function(conn) {
    connection=conn
    const ok = conn.createChannel();
    return connection
  })

}