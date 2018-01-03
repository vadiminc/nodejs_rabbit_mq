import mongoose from 'mongoose'
import passport from 'passport'
import bodyParser from 'body-parser'
import express from 'express'
import jwt from 'jsonwebtoken'
import amqp from 'amqp'
import rabbitMq from '../rabbitMQ'
import shared from '../shared'
import uuidv4 from 'uuid/v4';

const router = express.Router()
const q = 'tasks';
const qComplete = 'completed_tasks';

//****************************************************
/*   @TODO rebuild to use one channel per proceess
/*
/************************************************ */
export const listenComplete = async function ListenComplete() {
  const conn = await rabbitMq()
  const ok = conn.createChannel();
  ok.then(ch => {
    ch.assertQueue(qComplete, { durable: true });
    ch.prefetch(1);
    ch.consume(qComplete, function (msg) {
      const data = JSON.parse(msg.content.toString())

      shared.io.emit('task_completed', Object.assign(data, { doneTime: Date.now() }))
      ch.ack(msg);
    }, { noAck: false });

  })
}

router.post('/generate', bodyParser.json({ limit: '5mb' }), async (req, res) => {
  if (!req.userJWT) return res.status(403).end()
  const data = Object.assign({}, req.body, {
    id: uuidv4(),
    createdTime: Date.now()
  })
  const conn = await rabbitMq()
  const ok = conn.createChannel();

  let chAux = null
  ok.then( (ch) =>  {
    chAux = ch
    ch.assertQueue(q);
    ch.sendToQueue(q, new Buffer(JSON.stringify(data)));
  })
    .then(result => {
    }).catch((err) => {
      console.error(err)
    }).then(res => {
      chAux.close()
    })

  return res.json(data)
})

export default router
