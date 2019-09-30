'use strict';

module.exports.playSnake = (event, context, callback) => {
  const html =
  `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <style>       
        #container {
          width: 400px;
          height: 450px;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }            
      </style>
  </head>
  <body>
    <div id="container">
    <canvas id="gameCanvas" width="400" height="400"></canvas>
    </div>
  </body>
  <script>
    var Schwierigkeitsgrad = 100;
    var gameCanvas = document.getElementById("gameCanvas");
    var ctx = gameCanvas.getContext("2d");

    function zeichneCanvas() {
      ctx.fillStyle = "#ffffff";
      ctx.strokestyle = "#000000";
      ctx.fillRect (0, 0, 400, 400);
      ctx.strokeRect(0, 0, 400, 400);
    }

    var schlange = [
      {x: 200, y: 200},
      {x: 180, y: 200},
      {x: 160, y: 200},
      {x: 140, y: 200},
    ]

    function zeichneFressen() {
      ctx.fillStyle = "#ff0000";
      ctx.strokestyle = "#ffffff";
      ctx.fillRect(futterHorizontal, futterVertikal, 20, 20);
      ctx.strokeRect(futterHorizontal, futterVertikal, 20, 20);
    }

    var punkte = 0;
    var futterHorizontal;
    var futterVertikal;

    var bewegungHorizontal = 20;
    var bewegungVertikal = 0;

    function schlangeWaechst() {

      var kopf = {x: schlange[0].x + bewegungHorizontal, y: schlange[0].y + bewegungVertikal};

      schlange.unshift(kopf);

      // Prüfen, ob gefressen wurde
      var gefressen = schlange[0].x === futterHorizontal && schlange[0].y === futterVertikal;

      if (gefressen) {
        punkte += 100;
        function maxPointsReached() {
            if (punkte ==  39600) {
              alert("Herzlichen Glückwunsch! Du hast den Highscore erzielt!")
              return [localStorage.setItem("Score", punkte), location.href = 'GameOver.html']
              ;
            }
        }
        maxPointsReached();

        erzeugeFressen();
      }
      else {
        schlange.pop();
      }
    }

    function zufall(min, max) {
      return Math.round((Math.random() * (max-min) + min) / 20) * 20;
    }

    function erzeugeFressen() {
      futterHorizontal = zufall(0, 400 - 20);
      futterVertikal = zufall(0, 400 - 20);

      schlange.forEach(function futterPosition(schlangenGlied) {
        //var FutterKoordinaten = schlangenGlied.x == futterHorizontal && schlangenGlied.y == futterVertikal
        if (schlangenGlied.x == futterHorizontal && schlangenGlied.y == futterVertikal) {
          erzeugeFressen();
        }
      });
    } 
  
    function zeichneSchlange() {
      schlange.forEach(zeichneGlied)
    }

    function zeichneGlied(schlangenGlied) {

      ctx.fillStyle = "#000000";
      ctx.strokestyle = "#ffffff";

      ctx.fillRect(schlangenGlied.x, schlangenGlied.y, 20, 20);
      ctx.strokeRect(schlangenGlied.x, schlangenGlied.y, 20, 20);
    }

    function richtungsWechsel(event) {
      var tasteOben = 38;
      var tasteUnten = 40;
      var tasteRechts = 39;
      var tasteLinks = 37;

      if (richtungsWechsel) return;
        richtungsWechsel = true;

      var gedrTaste = event.keyCode;
      var Oben = bewegungVertikal === -20;
      var Unten = bewegungVertikal === 20;
      var Rechts = bewegungHorizontal === 20;
      var Links = bewegungHorizontal === -20;

      if (gedrTaste === tasteOben && !Unten) {
        bewegungHorizontal = 0;
        bewegungVertikal = -20;
      }

      if (gedrTaste === tasteUnten && !Oben) {
        bewegungHorizontal = 0;
        bewegungVertikal = 20;
      }

      if (gedrTaste === tasteRechts && !Links) {
        bewegungHorizontal = 20;
        bewegungVertikal = 0;
      }

      if (gedrTaste === tasteLinks && !Rechts) {
        bewegungHorizontal = -20;
        bewegungVertikal = 0;
      }
    }

    function gameOver() {

      for (var i = 4; i < schlange.length; i++) {
        if (schlange[i].x === schlange[0].x && schlange[i].y === schlange[0].y) return true
      }

      var crashLinks = schlange[0].x < 0;
      var crashRechts = schlange[0].x > 380;
      var crashOben = schlange[0].y < 0;
      var crashUnten = schlange[0].y > 380;
      return crashLinks || crashRechts || crashOben || crashUnten
    }

    start();
    erzeugeFressen();

    document.addEventListener("keydown", richtungsWechsel);
    document.addEventListener("keydown", pause)

    function start() {
      if (gameOver()) return alert = 'GameOver.html';
        setTimeout(function timeOut() {
          richtungsWechsel = false;
          zeichneCanvas();
          zeichneFressen();
          schlangeWaechst();
          zeichneSchlange();
          start();
        }, Schwierigkeitsgrad)
    }
  </script>
  </html>`;

  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: html,
  };
  
  callback(null, response);
};