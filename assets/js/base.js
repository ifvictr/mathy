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
        makeQuestion(true);
        interval = setInterval(function(){
            timer -= 0.1;
            $("#timer").css("width", ((timer / 15) * 100)+"%");
            if(timer <= 0){
                zodiac.options.parallax = 0; //Disable parallax
                clearInterval(interval); //Stop the timer
                $("#answer").blur();
                $("#problem, #stats").fadeOut(800);
                $("#over").fadeIn(2000);
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
        $(document).keypress(function(event){
            if(timer <= 0){
                return;
            }
            if(event.keyCode === 13){
                $(".stats-total").html(++total);
                if(isCorrect()){
                    (timer + 4) > 15 ? timer = 15 : timer += 4; //If timer + 4 > 15, just set timer to 15
                    $(".stats-right").html(++right);
                    makeQuestion(true);
                }
                else{
                    timer -= 2;
                    $(".stats-wrong").html(++wrong);
                    $("#answer").css("color", "#ff0000"); //Make the input text red
                    if(++attempts >= 3){
                        makeQuestion(false); //Make a new question, player seems stumped
                    }
                }
            }
        });
    });
    //Methods
    function getRandomColor(brightness){
        var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
        var mix = [brightness * 51, brightness * 51, brightness * 51];
        var mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function(x){ return Math.round(x / 2.0); });
        return "rgb("+mixedrgb.join(",")+")";
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
        attempts = 0; //Reset attempts to 0
        var number1 = getRandomNumber(min, max);
        var number2 = getRandomNumber(min, max);
        var operator = getRandomOperator();
        answer = eval(number1+operator+number2);
        $("#number1").html(number1);
        $("#number2").html(number2);
        $("#operator").html(operator);
        $("#answer")
            .focus() //Focus to the input
            .val("") //Empty previous input
            .css("color", "#000000"); //Reset color to black, in case user had it wrong previously
    }
})();