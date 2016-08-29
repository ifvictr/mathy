(function(){
    var right = 0;
    var wrong = 0;
    var total = 0;
    var min = 0;
    var max = 0;
    var attempts = 0;
    var timer = 15;
    var answer = null;
    var interval = null;
    var zodiac = null;
    $(function(){
        if(location.hash.substr(0, 2) == "#s"){
            var value = parseInt(location.hash.substr(2));
            if(value <= 0 || value >= 4){ //If value is not between 0 and 3, exclusively
                value = 1; //If the value doesn't exist, default back to style #1
            }
            $("#stats").find("ul").attr("data-style", value);
        }
        makeQuestion(true); //Make the first question
        interval = setInterval(function(){
            timer -= 0.1; //Decrement by 0.1 seconds, this runs 10 times per second
            $("#timer").css("width", ((timer / 15) * 100)+"%");
            if(timer <= 0){
                clearInterval(interval); //Stop the timer
                zodiac.options.parallax = 0; //Disable parallax
                $("[data-label='mark']").html(["", "?", "!", " (^_^)", " :)", " :P"][getRandomNumber(0, 5)]); //Generate random ending for "play again" message :)
                $("#answer").blur(); //Un-focus on input
                $("#problem, #stats").fadeOut(800); //Hide stats and problem
                $("#over")
                    .delay(600)
                    .fadeIn(1600);
            }
        }, 100);
        zodiac = new Zodiac("particles", {
            dotColor: getRandomColor(2),
            dotRadius: [2, 5],
            lineColor: getRandomColor(4),
            linkDistance: getRandomNumber(10, 130),
            linkWidth: 1,
            parallax: 0.6
        });
        $(window)
            .on("keypress", function(event){
                if(timer <= 0){
                    return;
                }
                if(event.keyCode === 13){
                    $("[data-label='total']").html(++total);
                    if(isCorrect()){
                        (timer + 4) > 15 ? timer = 15 : timer += 4; //If timer + 4 > 15, just set timer to 15
                        $("[data-label='right']").html(++right);
                        makeQuestion(true);
                    }
                    else{
                        timer -= 2; //Decrement by 2 seconds
                        $("[data-label='wrong']").html(++wrong);
                        $("#answer").css("color", "#b20000"); //Make the input text red
                        if(++attempts >= 3){
                            makeQuestion(false); //Make a new question, player seems stumped
                        }
                    }
                }
            })
            .on("click", function(){
                $("#answer").focus(); //If the player clicks on anything else, it'll still be focused on the answer input
            });
        $("[data-label='title']").on("click", function(event){
            event.preventDefault();
            var parent = $(this).parent();
            var style = parseInt(parent.attr("data-style"));
            console.log(style);
            parent.attr('data-style', (++style) <= 3 ? style : 1); //If style + 1 is equal or less than 3, keep it, or else start again at 1
        })
    });
    //Methods
    function getRandomColor(brightness){
        return "rgb("+[Math.random() * 256 + brightness * 51, Math.random() * 256 + brightness * 51, Math.random() * 256 + brightness * 51].map(function(x){ return Math.round(x / 2); }).join(",")+")";
    }
    function getRandomNumber(min, max){
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    function getRandomOperator(){
        var operators = ["+", "-"];
        if(right > 20 && (right / wrong) > 1){ //Player has more than 20 correct and right-to-wrong ratio is > 1
            operators.push("*", "/", "%");
        }
        return operators[getRandomNumber(0, operators.length - 1)];
    }
    function isCorrect(){
        return parseInt($("#answer").val()) === answer;
    }
    function makeQuestion(correct){
        if(correct){ //Correct?
            min += getRandomNumber(0, 2);
            max += getRandomNumber(1, 3);
        }
        else if(total % 5 === 0){ //Has been five questions?
            min += getRandomNumber(-4, 2);
            max += getRandomNumber(-3, 3);
        }
        else{
            min -= getRandomNumber(0, 3);
            max -= getRandomNumber(1, 4);
        }
        var number1 = getRandomNumber(min, max);
        var number2 = getRandomNumber(min, max);
        var operator = getRandomOperator();
        attempts = 0; //Reset attempts to 0
        answer = eval(number1+operator+number2); //Saves the answer to the newly generated problem
        $("#n1").html(number1);
        $("#n2").html(number2);
        $("#op").html(operator);
        $("#answer")
            .focus() //Focus on the input
            .val("") //Empty previous input
            .css("color", "#000000"); //Reset color to black, in case user had it wrong previously
    }
})();