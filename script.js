var questions = [
	{
		"instr": "When was Javascript created ?",
		"feedback": "1995",
		"options":["1984","1995","2000"],
		"answers":[false,true,false]
	},
	{
		"instr": "React was originally created by ?",
		"feedback": "Jordan Walke",
		"options":["Jesse Beach","Jordan Walke"],
		"answers":[false,true]
	},
	{
		"instr": "What does HTML stand for ?",
		"feedback": "Hyper Text Markup Language",
		"options":["Hyper Text Preprocessor","Hyper Text Markup Language","Hyper Tool Multi Language"],
		"answers":[false,true,false]
	},
	{
		"instr": "What styles a webpage ?",
		"feedback": "CSS",
		"options":["JSON","HTML","CSS","PHP"],
		"answers":[false,false,true,false]
	},
	{
		"instr": "How many data types does JavaScript have ?",
		"feedback": "Seven",
		"options":["Four","Three","Seven"],
		"answers":[false,false,true]
	}
];

var feedback= '';
var countQ=0;
var countTrue=0;
var countTime=0;

createQuestion();
$('#feedback').hide();
$('#lastScreen').hide();
$('#answersScreen').hide();

$('.submit').click(function(){
	var nbRightAnswers = countRightAnswers();
	if($('.clicked').length ===0){
		//no option selected, display an error message 
		alert('Please select at least one option');
		$('.clicked').toggleClass('clicked');
		$('.option').css('cursor','pointer');
		$('.option').css('pointer-events','auto');
		
	}else{
		//at least an option has been selected
		//the user can't click on the options
		$('.option').css('pointer-events','none');
		if(nbRightAnswers<=1){
			//single answer
			console.log('single answer')
			if($('.clicked').length !==1){
				//too many options selected, display an error message
				alert('Please select ONLY one option');
				$('.clicked').toggleClass('clicked');
				$('.option').css('cursor','pointer');
				$('.option').css('pointer-events','auto');
			}else{
				checkAnswer(nbRightAnswers);
				nextQuestion();
			}
		}else{
			//multiple answer
			console.log('multiple answer');
			checkAnswer(nbRightAnswers);
			nextQuestion();
		}
	}
});

$('.retake').click(function(){
	feedback= '';
	countQ=0;
	countTrue=0;
  $('#answers').html("");
	$('#lastScreen').hide();
	$('#answersScreen').hide();
	$('#feedback').hide();
	$('#quiz').show();
	createQuestion();
});

$('.answers').click(function(){
	$('#lastScreen').hide();
	$('#answersScreen').show();
	console.log(questions.length);
	for(var i=0; i<questions.length; i++) {
		var questionNb = i+1;
		var title = 'Question ' + questionNb;
		var answerText = questions[i].feedback;
		var questionReminder = questions[i].instr;
		
		var answerItem = '<h2>'+title+'</h2><p>'+questionReminder+'</p><p>'+answerText+'</p>';
		$('#answers').append(answerItem);
	}
	 
});

function nextQuestion(){
	createQuestion();
	$('#feedback').hide();
	$('.clicked').toggleClass('clicked');
};


function countRightAnswers(){
	//Check the number of right answers for the question
	var $option = $('.option');
	var count = $option.length;
	var answer = 0;
	for(var i=0; i<count; i++){
		if($option[i].dataset.result === 'true'){
			answer ++;
		}
	}
	return answer;
}

function checkAnswer(nbRightA){
	//Check if the user has selected the right answers
	var answersSelected = $('.clicked').length;
	if (answersSelected !== nbRightA){
		//The user hasn't selected the right number of right answers (in case of multiple answers)
		feedback = 'wrong';
		return feedback;
	}else{
		for(var i=0; i<answersSelected; i++){
			//Check if in the selected answers all have the data-result equal to true, which means this is a right answer
			if($('.clicked')[i].dataset.result==='false'){
				//The user has selected a wrong answer, then the whole answer will be wrong
				feedback = 'wrong';
				return feedback;
			}
		}
		feedback = 'true';
		countTrue++;
	}
}

function displayFeedback(feedback){
	$('.submit').hide();
	$('#feedback').show();
	$('#answer').html(feedback);
	var nbOption = $('.option').length;
	//display the feedback window at the right place
	if(nbOption<=2){
		 $('#feedback').css('top','50%');
	}else if(nbOption>=3 && nbOption<4){
		 $('#feedback').css('top','55%');
	}else{
		$('#feedback').css('top','62%');	 
	}
}

function createQuestion(){
	$('.clicked').toggleClass('clicked');
	$('.submit').show();
	//create a counter
	var interval = setInterval(function() {
		countTime++;
	}, 1000);
	//Create the question with the options stated in the array questions on top
	if(countQ===questions.length){
		//if there are no more questions, display the last screen with the score
		$('#quiz').hide();
		$('#lastScreen').show();
		var scorePercentage = Math.floor((countTrue/countQ)*100);
		$('#score').html(scorePercentage);
		clearInterval(interval);
		var time = secondsToTime(countTime);
    	$('#time').html(time);
	}
	$('.option').css('cursor','pointer');
	$('.option').css('pointer-events','auto');
	$('.options').empty();
	var Qnb = countQ+1;
	var title = 'Question ' + Qnb + ' of 5';
	var instr = questions[countQ].instr;
	var feedbackText = questions[countQ].feedback;
  
	$('.question h1').html(title);
	$('.question p').html(instr);
	$('.feedbackTxt').html(feedbackText);
	
	//Create the list of options and append to the container named options
	for(var i=0; i<questions[countQ].options.length; i++){
		var option = "<div class='option btn' data-result='"+questions[countQ].answers[i]+"'>"+questions[countQ].options[i]+"</div>";
		$('.options').append(option);
	}
		$('.option').click(function(){
		$(this).toggleClass('clicked');
	});
	countQ++;
}

function secondsToTime(s) {
  var h = Math.floor(s / 3600); //Get whole hours
  s -= h *3600;
  var m = Math.floor(s / 60); //Get remaining minutes
  s -= m *60;
  return h + ":" + (m < 10 ? '0' + m : m) + ":" + (s < 10 ? '0' + s : s); //zero padding on minutes and seconds
}