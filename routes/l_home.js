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
    var email = 'x.eleazar@htl-ottakring.ac.at';
    var vname = 'xyruz kyle';
    var nname = 'eleazar';
    console.log('Lehrer: '+email+', '+vname+', '+nname);
    mysql.firstLoginLehrer(email,vname,nname,function(){
        mysql.selectKurseLehrer(email,function(kurseLehrer){
            mysql.selectAngeboteneKurseLehrer(email,function(angeboteneKurseLehrer){
                var x = 710;
                for(var i=0; i<kurseLehrer.length;i=i+4){ x+=180; }
                for(var i=0; i<angeboteneKurseLehrer.length;i=i+4) { x+=180; }
                console.log('oo'+kurseLehrer);
                res.render('l_home',
                    {
                        dateNow: moment().format('DD.MM.YYYY'),
                        wochentag: n,
                        kurse: kurseLehrer,
                        angeboteneKurse: angeboteneKurseLehrer,
                        jumbotronheight: x
                    });
            });
        });
    });
});

router.post('/', function(req, res, next) {
    var email = req.body.email;
    var vname = req.body.vname;
    var nname = req.body.nname;
    console.log('Lehrer: '+email+', '+vname+', '+nname);
    mysql.firstLoginLehrer(email,vname,nname,function(){
        mysql.selectKurseLehrer(email,function(kurseLehrer){
            mysql.selectAngeboteneKurseLehrer(email,function(angeboteneKurseLehrer){
              var x = 710;
              for(var i=0; i<kurseLehrer.length;i=i+4){ x+=180; }
              for(var i=0; i<angeboteneKurseLehrer.length;i=i+4) { x+=180; }
                console.log(kurseLehrer);
              res.render('l_home',
                  {
                    dateNow: moment().format('DD.MM.YYYY'),
                    wochentag: n,
                    kurse: kurseLehrer,
                    angeboteneKurse: angeboteneKurseLehrer,
                    jumbotronheight: x
                  });
            });
        });
    });
});

module.exports = router;
