
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

const answerPrefixs = [
  "You can try",
  "I'd recommend",
  "Its gotta be",
  "Check out"
]

const answerSuffixs = [
  "would be good.",
  "is not a bad choice.",
  "is a good bet.",
  "is certainly the one."
]

const answer = (result) => {
  let fix = getRandomInt(0,2);
  if(fix == 0) {
    let max = answerPrefixs.length;
    return answerPrefixs[getRandomInt(0,max)] + " " + result + ".";
  }
  else {
    let max = answerSuffixs.length;
    return result + " " + answerSuffixs[getRandomInt(0,max)];
  }
}

const cannedNoAnswers = [
  "I'm afraid it is not in my recommendations. How about something else?",
  "Sorry... I don't have it in my list leh. Try something else can or not?",
  "Aiya, I can't find anything that is close. Some other things ok?"
];

const noAnswer = () => {
  let max = cannedNoAnswers.length;
  return cannedNoAnswers[getRandomInt(0,max)];
}

const cannedSuggestions = [
  "What bib gourmand recommendations would you like?",
  "Feeling hungry? I'm ready to make some recommendations.",
  "How about some chicken rice or laksa to start with?",
  "Can I make some food recommendations for you today?"
];

const cannedGreetings = [
  "Not bad at all!",
  "Well and good!",
  "Not too bad.",
  "Good good."
];

const cannedHellos = [
  "Hello there.",
  "Hi hi!",
  "Good day!",
  "At your service."
]

const sayHi = () => {
  let max = cannedHellos.length;
  let hi = cannedHellos[getRandomInt(0,max)];
  return hi + greetingFollowup();
}

const respondToGreeting = () => {
  let max = cannedGreetings.length;
  let greeting = cannedGreetings[getRandomInt(0,max)];
  return greeting + greetingFollowup();
}

const greetingFollowup = () => {
  let max = cannedSuggestions.length;
  return " "+cannedSuggestions[getRandomInt(0,max)];
}

const cannedSignOff = [
  "Hope that was useful. Bye!!",
  "Ciao! Glad I was of help.",
  "My pleasure!",
  "See you again soon!",
  "Tada!"
];

const signOff = () => {
  let max = cannedSignOff.length;
  let signOff = cannedSignOff[getRandomInt(0,max)];
  return signOff;
}

const cannedUnderstandFailed = [
  "I'm sorry but I'm not sure I understand you",
  "I'm sorry but I didn't get you.",
  "Not sure what you are lookig for."
];

const cannedRecovery = [
  "Can I help you with some food recommendations?",
  "Maybe you can tell me the type of food you are looking for."
];

const notUnderstand = () => {
  let max = cannedUnderstandFailed.length;
  let pre = cannedUnderstandFailed[getRandomInt(0,max)];
  return pre + recover;
}

const recover = () => {
  let max = cannedRecovery.length;
  return " " + cannedRecovery[getRandomInt(0,max)];
}

exports.noAnswer = noAnswer;
exports.answer = answer;
exports.sayHi = sayHi;
exports.respondToGreeting = respondToGreeting;
exports.signOff = signOff;
exports.notUnderstand = notUnderstand;
