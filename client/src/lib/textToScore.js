var Sentiment = require('sentiment');
var sentiment = new Sentiment();

export default function(input){
  return sentiment.analyze(input).score
}