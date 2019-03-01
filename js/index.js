'use strict';
var app = angular.module("myApp", ["ngRoute", "ngStorage"]);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "./views/home.html"
        })
        .when("/level", {
            templateUrl: "./views/level.html",
            controller: "levelCtrl"
        })
        .when("/level/:play", {
            templateUrl: "./views/play.html",
            controller: "playCtrl"
        });
});

app.controller('levelCtrl', function ($scope, $http, $localStorage) {

    $http.get("sensedupe.json")
        .then(function (response) {
            if (!$localStorage.gameData) {
                $scope.myLevel = response.data;
                $localStorage.gameData = $scope.myLevel;
            } else {

                if (response.data.length === $localStorage.gameData.length) {
                    $scope.myLevel = $localStorage.gameData;
                } else {
                    $scope.myLevel = removeDuplicates($.merge($localStorage.gameData, response.data), 'path');
                    $localStorage.gameData = $scope.myLevel;
                }
            }
        });

    function removeDuplicates(myArr, prop) {
        return myArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
    }

});
app.controller('playCtrl', function ($routeParams, $localStorage) {

    var Memory = {
        init: function (path) {
            var cards = [];
            this.$head = $(".header");
            this.$game = $(".game");
            this.$modal = $(".modal");
            this.$overlay = $(".modal-overlay");
            this.$restartButton = $("button.restart");
            this.$cards = this.setId(cards, path);
            this.cardsArray = $.merge(cards, cards);
            this.shuffleCards(this.cardsArray);
            this.setup();
        }, setup: function () {
            this.$header = this.buildHEADER();
            this.$head.html(this.$header);
            this.html = this.buildHTML();
            this.$game.html(this.html);
            this.$memoryCards = $(".card");
            this.paused = false;
            this.guess = null;
            this.interval = null;
            this.move = 0;
            this.time = 0;
            this.level = 1;
            this.binding();
        }, quotes: [
            'Think little goals and expect little achievements. Think big goals and win big success.',
            'You were born to win, but to be a winner, you must plan to win, prepare to win, and expect to win.',
            'The true competitors, though, are the ones who always play to win.',
            'Sometimes it is better to lose and do the right thing than to win and do the wrong thing.',
            'To be a good loser is to learn how to win.',
            'I race to win. If I am on the bike or in a car it will always be the same.',
            'You can never quit. Winners never quit, and quitters never win.'
        ], setId: function (data, path) {
            function dynamicId() {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                for (var i = 0; i < 5; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
            }
            for (var i = 1; i <= 12; i++) {
                var obj = {};
                obj["id"] = dynamicId();
                obj["img"] = "./images/" + path + "/" + i + ".png";
                data.push(obj);
            }
            this.setId = data;
        }, shuffleCards: function () {
            this.$cards = $(this.shuffle(this.cardsArray));
        }, binding: function () {
            var _ = Memory;
            this.$memoryCards.on("click", this.cardClicked);
            this.$restartButton.on("click", function () {
                location.reload();
            });
            _.interval = setInterval(function () {
                _.time++;
                $(".move h4").html(_.move);
                $(".time h4").html(_.time + " <small>s</small>");
            }, 1000);
        }, cardClicked: function () {
            var _ = Memory;
            var $card = $(this);
            _.move++;
            $(".move h4").html(_.move);
            if (!_.paused && !$card.find(".inside").hasClass("matched") && !$card.find(".inside").hasClass("picked")) {
                $card.find(".inside").addClass("picked");
                if (!_.guess) {
                    _.guess = $(this).attr("data-id");
                } else if (_.guess === $(this).attr("data-id") && !$(this).hasClass("picked")) {
                    $(".picked").addClass("matched");
                    _.guess = null;
                } else {
                    _.guess = null;
                    _.paused = true;
                    setTimeout(function () {
                        $(".picked").removeClass("picked");
                        Memory.paused = false;
                    }, 600);
                }
                if ($(".matched").length === $(".card").length) {
                    _.win();
                }
            }
        }, win: function () {
            var _ = Memory;
            this.paused = true;
            var level_score, bonus_score, max_bonus, score;
            level_score = _.level * 100;
            max_bonus = 100000;
            bonus_score = max_bonus / (_.time + _.move + _.level * 10);
            score = level_score + bonus_score;
            $(".score h4").html(Math.round(score));
            setTimeout(function () {
                _.showModal(score);
                _.$game.fadeOut();
            }, 1000);
        }, showModal: function (score) {
            var _ = Memory;
            this.$overlay.show();
            this.$modal.fadeIn("slow");
            var $quotes = _.quotes[Math.floor(Math.random() * _.quotes.length)];
            $(".winner").html($quotes);
            if ($localStorage.gameData && $routeParams.play) {
                $localStorage.gameData.forEach(function (data) {
                    if (data.path === $routeParams.play) {
                        if (!data.best || score > data.best) {
                            data["best"] = Math.round(score);
                            $(".best h4").html(Math.round(score));
                        } else if (data.best > score) {
                            $(".best h4").html(Math.round(data.best));
                        }
                    }
                });
            } else {
                $(".best h4").html(Math.round(score));
            }
            clearInterval(_.interval);
        }, hideModal: function () {
            this.$overlay.hide();
            this.$modal.hide();
        }, reset: function () {
            this.hideModal();
            this.shuffleCards(this.cardsArray);
            this.setup();
            this.$game.show("slow");
        }, shuffle: function (array) {
            var counter = array.length, temp, index;
            while (counter > 0) {
                index = Math.floor(Math.random() * counter);
                counter--;
                temp = array[counter];
                array[counter] = array[index];
                array[index] = temp;
            }
            return array;
        }, buildHTML: function () {
            var frag = '';
            this.$cards.each(function (k, v) {
                frag += '<div class="card" data-id="' + v.id + '"><div class="inside">\
                        <div class="front"><img src="'+ v.img + '" /></div>\
                        <div class="back"><img src="./images/mark.png" \
                        alt="Sense Dupe" /></div></div>\
                        </div>';
            });
            return frag;
        }, buildHEADER: function () {
            var frag = '';
            frag += '<div class="move"><h5>MOVE</h5>\
                        <h4>0</h4></div>\
                        <div class="time"><h5>TIME</h5>\
                        <h4>0 s</h4></div>';
            return frag;
        }
    };

    Memory.init($routeParams.play);

});