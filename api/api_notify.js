const express = require("express");
const router = express.Router();
const connectdb = require("./../dbconnect");
const notify = require("./../models/Notify");
const moment = require('moment');
const bodyParser = require("body-parser");

var urlencodedParser = bodyParser.urlencoded({
  extended: false
});

router.get('/view/:id/:limit/:offset', function (req, res) {
  let id = req.params.id
  let limit = parseInt(req.params.limit)
  let offset = parseInt(req.params.offset)
  let dataSet = { data: {}, total: {} }
  connectdb.then(db => {
    notify.find({ "to": id, "status": 1 }, {
      _id: 1,
      id: 1,
      msg: 1,
      read: 1,
      ref_no: 1,
      createdAt: 1
    }).sort({
      createdAt: -1
    }).limit(limit).skip(offset)
      .then(data => {
        dataSet.data = data
        notify.find({ "to": id }, {
          _id: 1,
          id: 1,
          msg: 1,
          read: 1,
          ref_no: 1,
          updatedAt: 1
        }).then(total => {
          dataSet.total = total.length
          res.status(200).json(dataSet);
        })
      });
  })
})

router.post('/add-one', urlencodedParser, function (req, res) {
  let { id, msg, ref_no, to, createdBy } = req.body
  let notifyData = new notify({
    id: id,
    ref_no: ref_no,
    msg: msg,
    to: to,
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    createdBy: createdBy,
    updatedBy: createdBy
  })
  notifyData.save(function (err) {
    if (err) return res.json(err)
    return res.status(200).json("OK")
  })

})

router.post('/add', urlencodedParser, function (req, res) {
  let { id, msg, ref_no, to, createdBy } = req.body
  connectdb.then(db => {
    notify.find({ id: id }).then(data => {
      if (data.length) {
        notify.deleteMany({ id: id }).then(() => {
          for (let index = 0; index <= to.length; index++) {
            const element = to[index];
            if (index == to.length) {
              return res.status(200).json("OK")
            } else {
              let notifyData = new notify({
                id: id,
                ref_no: ref_no,
                msg: msg,
                to: element,
                createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                createdBy: createdBy,
                updatedBy: createdBy
              })
              notifyData.save()
            }
          }
        })
      }
      else {
        for (let index = 0; index <= to.length; index++) {
          const element = to[index];
          if (index == to.length) {
            return res.status(200).json("OK")
          } else {
            let notifyData = new notify({
              id: id,
              ref_no: ref_no,
              msg: msg,
              to: element,
              createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
              createdBy: createdBy,
              updatedBy: createdBy
            })
            notifyData.save()
          }
        }
      }
    })
  })
})

router.post('/edit', urlencodedParser, function (req, res) {
  let { id, msg, ref_no, to, updateBy } = req.body
  connectdb.then(db => {
    notify.findOneAndUpdate({ id: id }, { msg: msg, ref_no: ref_no, to: to, updateBy: updateBy }).then(data => {
      return res.status(200).json("OK")
    }).catch(err => {
      return res.status(500).json("update fail")
    })
  })
})

router.get('/read/:userId/:id', function (req, res) {
  let id = req.params.id
  let userId = req.params.userId
  connectdb.then(db => {
    notify.findOneAndUpdate({ _id: id }, { read: true, updateBy: userId }).then(data => {
      return res.status(200).json("OK")
    }).catch(err => {
      return res.status(500).json("update fail")
    })
  })
})

router.delete('/', function (req, res) {
  let id = req.query.id
  let userId = req.query.userId
  connectdb.then(db => {
    notify.findOneAndUpdate({ id: id }, { status: 0, updateBy: userId }).then(data => {
      return res.status(200).json("OK")
    }).catch(err => {
      return res.status(500).json("update fail")
    })
  })
})

router.get('/notify/:userId',function (req, res) {
  let userId = req.params.userId
  connectdb.then(db => {
    notify
      .aggregate([{
        $match: {
          $and: [
            {
              to: userId
            },
            {
              read: false
            }
          ]
        }
      }, { $count: "read" }])
      .then(notify => {
        if (notify.length) {
          res.status(200).json(notify[0].read);
        }else{
          res.status(200).json(0);
        }
      });
  })

})
module.exports = router;