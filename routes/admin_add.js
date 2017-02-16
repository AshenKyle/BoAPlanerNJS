var express = require('express');
var router = express.Router();
var moment = require('moment');
var mysql = require('../mysqlmodule/mysqlModule');

/* GET home page. */

var d = new Date();
var wochentag = new Array(7);
wochentag[0]=  "Sonntag";
wochentag[1] = "Montag";
wochentag[2] = "Dienstag";
wochentag[3] = "Mittwoch";
wochentag[4] = "Donnerstag";
wochentag[5] = "Freitag";
wochentag[6] = "Samstag";

var n = wochentag[d.getDay()];



router.get('/', function(req, res, next) {
  mysql.selectKurseSchueler('x.eleazar98@htl-ottakring.ac.at',function(kurseSchueler){
    mysql.selectAngeboteneKurse('x.eleazar98@htl-ottakring.ac.at',function(angeboteneKurse){
      var x = 710;
      for(var i=0; i<kurseSchueler.length;i=i+4){ x+=180; }
      for(var i=0; i<angeboteneKurse.length;i=i+4) { x+=180; }
        console.log(kurseSchueler);
      res.render('admin_add',
          {
            dateNow: moment().format('DD.MM.YYYY'),
            wochentag: n,
            kurse: kurseSchueler,
            angeboteneKurse: angeboteneKurse,
            jumbotronheight: x
          });
    });
  });
});

router.post('/', function(req, res){
    console.log(req.body.neuEintrag+" "+req.body.neuName);
    mysql.erstelleKursLehrer(req.body.neuEintrag, req.body.neuName, function(result,err){
        mysql.selectKurseLehrer()
        res.render('index', {
            eintraege: result
        });
    });
});

module.exports = router;
