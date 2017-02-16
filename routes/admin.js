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
    var email = req.body.email.toString();
    console.log('lzehm@htl-ottakring.at');
    mysql.selectKurseLehrer(email,function(kurseLehrer){
        mysql.selectAngeboteneKurseLehrer(email,function(angeboteneKurseLehrer){
            mysql.selectProjektWoche(function(wocheVonBis){
                var startDatum, endDatum;
                var x = 710;
                for(var i=0; i<kurseLehrer.length;i=i+4){ x+=180; }
                for(var i=0; i<angeboteneKurseLehrer.length;i=i+4) { x+=200; }
                console.log(x);
                for(var prop in wocheVonBis){
                    if(startDatum) startDatum = wocheVonBis[prop];
                    else endDatum = wocheVonBis[prop+1];
                }
                console.log(startDatum+', '+endDatum);
                res.render('admin',
                    {
                        dateNow: moment().format('DD.MM.YYYY'),
                        wochentag: n,
                        kurse: kurseLehrer,
                        angeboteneKurse: angeboteneKurseLehrer,
                        jumbotronheight: x,
                        wocheVonBis: wocheVonBis[0]
                    });
            });
        });
    });
});

router.post('/:woche', function(req, res, next) {
    mysql.setWoche(req.body.dateVon,req.body.dateBis, function(){
        res.reload();
    });
});

router.get('/:deletewoche', function(req, res, next) {
    mysql.fullReset(function(){
        res.render('/');
    });
});

module.exports = router;
