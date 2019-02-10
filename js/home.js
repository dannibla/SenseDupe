// Memory Game
// © 2014 Nate Wiley
// License -- MIT
// best in full screen, works on phones/tablets (min height for game is 500px..) enjoy ;)
// Follow me on Codepen

(function () {


    var time = 0;
    var moves = 0;
    var Memory = {

        init: function (cards) {
            this.$game = $(".game");
            this.$modal = $(".modal");
            this.$overlay = $(".modal-overlay");
            this.$restartButton = $("button.restart");
            this.cardsArray = $.merge(cards, cards);
            this.shuffleCards(this.cardsArray);
            this.setup();
        },

        shuffleCards: function (cardsArray) {
            this.$cards = $(this.shuffle(this.cardsArray));
        },

        setup: function () {
            this.html = this.buildHTML();
            this.$game.html(this.html);
            this.$memoryCards = $(".card");
            this.paused = false;
            this.guess = null;
            this.binding();
        },

        binding: function () {
            this.$memoryCards.on("click", this.cardClicked);
            this.$restartButton.on("click", function () {
                location.reload()
            });
        },
        // kinda messy but hey
        cardClicked: function () {
            var _ = Memory;
            var $card = $(this);
            moves = moves + 1;
            if (!_.paused && !$card.find(".inside").hasClass("matched") && !$card.find(".inside").hasClass("picked")) {
                $card.find(".inside").addClass("picked");
                if (!_.guess) {
                    _.guess = $(this).attr("data-id");
                } else if (_.guess == $(this).attr("data-id") && !$(this).hasClass("picked")) {
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
                if ($(".matched").length == $(".card").length) {
                    _.win();
                }
            }
        },

        win: function () {
            this.paused = true;
            setTimeout(function () {
                Memory.showModal();
                Memory.$game.fadeOut();
            }, 1000);
        },

        showModal: function () {
            this.$overlay.show();
            this.$modal.fadeIn("slow");
            $("#quot").html(rand);
            clearInterval(timer);
        },

        hideModal: function () {
            this.$overlay.hide();
            this.$modal.hide();
        },

        reset: function () {
            this.hideModal();
            this.shuffleCards(this.cardsArray);
            this.setup();
            this.$game.show("slow");
        },

        // Fisher--Yates Algorithm -- https://bost.ocks.org/mike/shuffle/
        shuffle: function (array) {
            var counter = array.length, temp, index;
            // While there are elements in the array
            while (counter > 0) {
                // Pick a random index
                index = Math.floor(Math.random() * counter);
                // Decrease counter by 1
                counter--;
                // And swap the last element with it
                temp = array[counter];
                array[counter] = array[index];
                array[index] = temp;
            }
            return array;
        },

        buildHTML: function () {
            var frag = '';
            this.$cards.each(function (k, v) {
                frag += '<div class="card" data-id="' + v.id + '"><div class="inside">\
				<div class="front"><img src="'+ v.img + '"\
				alt="'+ v.name + '" /></div>\
				<div class="back"><img src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgaGVpZ2h0PSI1MTJweCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHdpZHRoPSI1MTJweCI+PGxpbmVhckdyYWRpZW50IGlkPSJhIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAiIHgyPSI1MTIiIHkxPSIyNTYiIHkyPSIyNTYiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzAwZjJmZSIvPjxzdG9wIG9mZnNldD0iLjAyMDgiIHN0b3AtY29sb3I9IiMwM2VmZmUiLz48c3RvcCBvZmZzZXQ9Ii4yOTMxIiBzdG9wLWNvbG9yPSIjMjRkMmZlIi8+PHN0b3Agb2Zmc2V0PSIuNTUzOCIgc3RvcC1jb2xvcj0iIzNjYmRmZSIvPjxzdG9wIG9mZnNldD0iLjc5NTYiIHN0b3AtY29sb3I9IiM0YWIwZmUiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM0ZmFjZmUiLz48L2xpbmVhckdyYWRpZW50PjxwYXRoIGQ9Im01MTIgMjU2YzAgNTAuNTMxMjUtMTUgOTkuNjc1NzgxLTQzLjM3NSAxNDIuMTE3MTg4LTYuMTM2NzE5IDkuMTgzNTkzLTE4LjU1ODU5NCAxMS42NDg0MzctMjcuNzQyMTg4IDUuNTExNzE4LTkuMTgzNTkzLTYuMTQwNjI1LTExLjY0ODQzNy0xOC41NjI1LTUuNTExNzE4LTI3Ljc0MjE4NyAyMy45NjQ4NDQtMzUuODQzNzUgMzYuNjI4OTA2LTc3LjI5Njg3NSAzNi42Mjg5MDYtMTE5Ljg4NjcxOSAwLTExOS4xMDE1NjItOTYuODk4NDM4LTIxNi0yMTYtMjE2cy0yMTYgOTYuODk4NDM4LTIxNiAyMTYgOTYuODk4NDM4IDIxNiAyMTYgMjE2YzM5LjUwMzkwNiAwIDc4LjE0NDUzMS0xMC43NTc4MTIgMTExLjczODI4MS0zMS4xMDU0NjkgOS40NDUzMTMtNS43MjI2NTYgMjEuNzQ2MDk0LTIuNzAzMTI1IDI3LjQ2ODc1IDYuNzQ2MDk0IDUuNzIyNjU3IDkuNDQ1MzEzIDIuNzAzMTI1IDIxLjc0MjE4Ny02Ljc0NjA5MyAyNy40NjQ4NDQtMzkuODQzNzUgMjQuMTM2NzE5LTg1LjY0ODQzOCAzNi44OTQ1MzEtMTMyLjQ2MDkzOCAzNi44OTQ1MzEtNjguMzc4OTA2IDAtMTMyLjY2Nzk2OS0yNi42Mjg5MDYtMTgxLjAxOTUzMS03NC45ODA0NjktNDguMzUxNTYzLTQ4LjM1MTU2Mi03NC45ODA0NjktMTEyLjY0MDYyNS03NC45ODA0NjktMTgxLjAxOTUzMXMyNi42Mjg5MDYtMTMyLjY2Nzk2OSA3NC45ODA0NjktMTgxLjAxOTUzMWM0OC4zNTE1NjItNDguMzUxNTYzIDExMi42NDA2MjUtNzQuOTgwNDY5IDE4MS4wMTk1MzEtNzQuOTgwNDY5czEzMi42Njc5NjkgMjYuNjI4OTA2IDE4MS4wMTk1MzEgNzQuOTgwNDY5YzQ4LjM1MTU2MyA0OC4zNTE1NjIgNzQuOTgwNDY5IDExMi42NDA2MjUgNzQuOTgwNDY5IDE4MS4wMTk1MzF6bS0yNTUuOTkyMTg4IDEyNGMtMTEuMDQ2ODc0IDAtMjAgOC45NTMxMjUtMjAgMjBzOC45NTMxMjYgMjAgMjAgMjBjMTEuMDQyOTY5IDAgMjAtOC45NTMxMjUgMjAtMjBzLTguOTU3MDMxLTIwLTIwLTIwem00MS45ODgyODItODQuNTM5MDYyYzM5LjUwNzgxMi0xNi44NjcxODggNjUuMDMxMjUtNTUuNTE5NTMyIDY1LjAxOTUzMS05OC40NzY1NjMgMC0uMzM1OTM3LS4wMDc4MTMtLjY3MTg3NS0uMDIzNDM3LTEuMDA3ODEzLS41NDY4NzYtNTguNTI3MzQzLTQ4LjMzMjAzMi0xMDUuOTc2NTYyLTEwNi45ODQzNzYtMTA1Ljk3NjU2Mi01OC45OTYwOTMgMC0xMDYuOTkyMTg3IDQ3Ljk5NjA5NC0xMDYuOTkyMTg3IDEwNi45ODgyODEgMCAxMS4wNDY4NzUgOC45NTMxMjUgMjAgMjAgMjBzMjAtOC45NTMxMjUgMjAtMjBjMC0zNi45Mzc1IDMwLjA1MDc4MS02Ni45ODgyODEgNjYuOTkyMTg3LTY2Ljk4ODI4MSAzNi45Mzc1IDAgNjYuOTg4MjgyIDMwLjA1MDc4MSA2Ni45ODgyODIgNjYuOTg4MjgxIDAgLjI3MzQzOC4wMDM5MDYuNTM5MDYzLjAxNTYyNS44MDg1OTQtLjMwODU5NCAyNi41ODIwMzEtMTYuMjIyNjU3IDUwLjQxNzk2OS00MC43MjI2NTcgNjAuODc4OTA2LTI3LjY4MzU5MyAxMS44MTY0MDctNDYuMjgxMjUgNDAuNDgwNDY5LTQ2LjI4MTI1IDcxLjMyNDIxOSAwIDExLjA0Njg3NSA4Ljk1MzEyNiAyMCAyMCAyMCAxMS4wNDI5NjkgMCAyMC04Ljk1MzEyNSAyMC0yMCAwLTE1LjA0Mjk2OSA4LjgzNTkzOC0yOC45MjE4NzUgMjEuOTg4MjgyLTM0LjUzOTA2MnptMCAwIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+Cg==" \
				alt="Sense Dupe" /></div></div>\
				</div>';
            });
            return frag;
        }
    };

    var cards = [
        {
            name: "php",
            img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/php-logo_1.png",
            id: 1,
        },
        {
            name: "css3",
            img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/css3-logo.png",
            id: 2
        },
        {
            name: "html5",
            img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/html5-logo.png",
            id: 3
        },
        {
            name: "jquery",
            img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/jquery-logo.png",
            id: 4
        },
        {
            name: "javascript",
            img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/js-logo.png",
            id: 5
        },
        {
            name: "node",
            img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/nodejs-logo.png",
            id: 6
        },
        {
            name: "photoshop",
            img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/photoshop-logo.png",
            id: 7
        },
        {
            name: "python",
            img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/python-logo.png",
            id: 8
        },
        {
            name: "rails",
            img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/rails-logo.png",
            id: 9
        },
        {
            name: "sass",
            img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/sass-logo.png",
            id: 10
        },
        {
            name: "sublime",
            img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/sublime-logo.png",
            id: 11
        },
        {
            name: "wordpress",
            img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/wordpress-logo.png",
            id: 12
        }
    ];
    var winQuotes = ['Think little goals and expect little achievements. Think big goals and win big success.',
        'You were born to win, but to be a winner, you must plan to win, prepare to win, and expect to win.',
        'The true competitors, though, are the ones who always play to win.',
        'Sometimes it is better to lose and do the right thing than to win and do the wrong thing.',
        'To be a good loser is to learn how to win.',
        'I race to win. If I am on the bike or in a car it will always be the same.',
        'You can never quit. Winners never quit, and quitters never win.']
    var rand = winQuotes[Math.floor(Math.random() * winQuotes.length)];

    var timer = setInterval(function () { oneSecondFunction(moves); }, 1000);

    var level, level_score, max_bonus, bonus_score, score;
    function oneSecondFunction(moves) {
        time = time + 1;
        $("#yourMove").html(moves);
        $("#yourTime").html(time + " <small>s</small>");
        level = 1;
        level_score = level * 100;
        max_bonus = 100000;
        bonus_score = max_bonus / (time + moves + level * 10);
        score = level_score + bonus_score;
        console.log(score);
    }
    $(".modal-overlay").show();
    $(".modal").show();
    $("#quot").html(rand);
    Memory.init(cards);

})();

