// interaction code stage1

navigate('https://stats.espncricinfo.com/ci/engine/records/team/match_results.html?id=14450;type=tournament');

let links = parse().matchSummaryLinks;
for(let i of links) { 
  next_stage({url: i}) 
}


//parser code stage1
let links = []
const allRows = $('table.engineTable > tbody > tr.data1');
 allRows.each((index, element) => {
  const tds = $(element).find('td');
  const rowURL = "https://www.espncricinfo.com" +$(tds[6]).find('a').attr('href');
  links.push(rowURL);
 })
return {
  'matchSummaryLinks': links
};
// intyeraction code stage 2
navigate(input.url);


let playersData = parse().playersData;
for(let obj of playersData) { 
  name = obj['name']
  team = obj['team']
  url = obj['link']
  next_stage({name: name, team: team, url: url}) 
}

//parser code stage 2
var playersLinks = []

var match = $('div').filter(function(){
	return $(this)
      .find('span > span > span').text() === String("Match Details") 
}).siblings()
team1 = $(match.eq(0)).find('span > span > span').text().replace(" Innings", "")
team2 = $(match.eq(1)).find('span > span > span').text().replace(" Innings", "")



var tables = $('div > table.ci-scorecard-table');
var firstInningRows = $(tables.eq(0)).find('tbody > tr').filter(function(index, element){
  return $(this).find("td").length >= 8
})

var secondInningsRows = $(tables.eq(1)).find('tbody > tr').filter(function(index, element){
  return $(this).find("td").length >= 8
});

firstInningRows.each((index, element) => {
  var tds = $(element).find('td');
  playersLinks.push({
  		"name": $(tds.eq(0)).find('a > span > span').text().replace(' ', ''),
    	"team": team1,
    	"link": "https://www.espncricinfo.com" + $(tds.eq(0)).find('a').attr('href')  
  });
});

secondInningsRows.each((index, element) => {
  var tds = $(element).find('td');
   playersLinks.push({
  		"name": $(tds.eq(0)).find('a > span > span').text().replace(' ', ''),
     	"team": team2,
     	"link": "https://www.espncricinfo.com" + $(tds.eq(0)).find('a').attr('href')  
  });
});



var tables = $('div > table.ds-table');
var firstInningRows = $(tables.eq(1)).find('tbody > tr').filter(function(index, element){
  return $(this).find("td").length >= 11
})

var secondInningsRows = $(tables.eq(3)).find('tbody > tr').filter(function(index, element){
  return $(this).find("td").length >= 11
});


firstInningRows.each((index, element) => {
  var tds = $(element).find('td');
  playersLinks.push({
   		"name": $(tds.eq(0)).find('a > span').text().replace(' ', ''),
    	"team": team2.replace(" Innings", ""),
    	"link": "https://www.espncricinfo.com" + $(tds.eq(0)).find('a').attr('href')  
    	
  });
});

secondInningsRows.each((index, element) => {
  var tds = $(element).find('td');
   playersLinks.push({
  		"name": $(tds.eq(0)).find('a > span').text().replace(' ', ''),
    	"team": team1.replace(" Innings", ""),
    	"link": "https://www.espncricinfo.com" + $(tds.eq(0)).find('a').attr('href')
  });
});
  
return {"playersData": playersLinks}
 
 


navigate(input.url);
final_data = parse()
collect(
{
 "name": input.name,
  "team": input.team,
  "battingStyle": final_data.battingStyle,
  "bowlingStyle": final_data.bowlingStyle,
  "playingRole":  final_data.playingRole,
  "description": final_data.content,
});
 

const battingStyle = $('div.ds-grid > div').filter(function(index){
    return $(this).find('p').first().text() === String('Batting Style')
  })

const bowlingStyle = $('div.ds-grid > div').filter(function(index){
    return $(this).find('p').first().text() === String('Bowling Style')
  })

const playingRole = $('div.ds-grid > div').filter(function(index){
    return $(this).find('p').first().text() === String('Playing Role')
  })



 return {
  	"battingStyle": battingStyle.find('span').text(),
   "bowlingStyle": bowlingStyle.find('span').text(),
   "playingRole": playingRole.find('span').text(),
   "content": $('div.ci-player-bio-content').find('p').first().text()
}
