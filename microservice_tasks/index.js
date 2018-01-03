#!/usr/bin/env node
import amqp from 'amqplib/callback_api'

const q = 'tasks';
const qComplete = 'completed_tasks';

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    ch.assertQueue(q, {durable: true});
    ch.prefetch(1);

    ch.consume(q, function(msg) {
      var data = JSON.parse( msg.content.toString() );
      setTimeout(function() {
        //completed tasks
        ch.assertQueue(qComplete);
        ch.sendToQueue(qComplete, new Buffer(JSON.stringify(Object.assign( {completed: true }, data )  )));

        ch.ack(msg);
      }, data.time * 1000);
    }, {noAck: false});
  });
});