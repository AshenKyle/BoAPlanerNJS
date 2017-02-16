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


router.post('/', function(req, res, next) {
    var email = req.body.email;
    var vname = req.body.vname;
    var nname = req.body.nname;
    console.log('Schueler: '+email+', '+vname+', '+nname);
  mysql.firstLogin(email,vname,nname,function(){
      mysql.selectKurseSchueler(email,function(kurseSchueler){
        mysql.selectAngeboteneKurse(email,function(angeboteneKurse){
          var x = 710;
          for(var i=0; i<kurseSchueler.length;i=i+4){ x+=180; }
          for(var i=0; i<angeboteneKurse.length;i=i+4) { x+=180; }
            console.log(kurseSchueler);
          res.render('s_home',
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
});

module.exports = router;
