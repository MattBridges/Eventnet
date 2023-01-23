var events = [{
  event: "ComicCon",
  city: "New York",
  state: "New York",
  attendance: 240000,
  date: "06/01/2017",
},
{
  event: "ComicCon",
  city: "New York",
  state: "New York",
  attendance: 250000,
  date: "06/01/2018",
},
{
  event: "ComicCon",
  city: "New York",
  state: "New York",
  attendance: 257000,
  date: "06/01/2019",
},
{
  event: "ComicCon",
  city: "San Diego",
  state: "California",
  attendance: 130000,
  date: "06/01/2017",
},
{
  event: "ComicCon",
  city: "San Diego",
  state: "California",
  attendance: 140000,
  date: "06/01/2018",
},
{
  event: "ComicCon",
  city: "San Diego",
  state: "California",
  attendance: 150000,
  date: "06/01/2019",
},
{
  event: "HeroesCon",
  city: "Charlotte",
  state: "North Carolina",
  attendance: 40000,
  date: "06/01/2017",
},
{
  event: "HeroesCon",
  city: "Charlotte",
  state: "North Carolina",
  attendance: 45000,
  date: "06/01/2018",
},
{
  event: "HeroesCon",
  city: "Charlotte",
  state: "North Carolina",
  attendance: 50000,
  date: "06/01/2019",
},
];

function BuildDropDown() {
  //Get the dropdown menu from the page
  let dropdownMenu = document.getElementById('eventDropDown');
  //Empty the dropdown innerHTML to ensure theres nothing in it
  dropdownMenu.innerHTML = '';
  //Get our events
  let currEvents = GetEventData();

  //Pull out just the city names
  let eventCities = currEvents.map((event) => event.city);
  //Filter the cites to on distinct city names
  let distinctCities = [...new Set(eventCities)];

  //Get the template from the page
  const template = document.getElementById('dropdownItemTemplate');

  //Copy the template
  let dropdownTemplateNode = document.importNode(template.content, true);
  //Get the a tag from the template copy
  let menuItem = dropdownTemplateNode.querySelector('a');
  //change the text
  menuItem.textContent = 'All Cities';
  menuItem.setAttribute("data-string", "All");
  //Add item to the page
  dropdownMenu.appendChild(dropdownTemplateNode);

  for (let i = 0; i < distinctCities.length; i++) {
    let cityMenuItem = document.importNode(template.content, true);
    let cityBtn = cityMenuItem.querySelector('a')

    cityBtn.textContent = distinctCities[i];
    cityBtn.setAttribute("data-string", distinctCities[i]);

    dropdownMenu.appendChild(cityMenuItem);

  }

  DisplayStats(currEvents);
  DisplayEventData(currEvents);
}

function DisplayStats(eventsObj) {
  let calculatedValues = CalculateStats(eventsObj);

  document.getElementById('total').textContent = calculatedValues.total.toLocaleString();
  document.getElementById('average').textContent = calculatedValues.average.toLocaleString("en-US", { maximumFractionDigits: 0, minimumFractionDigits: 0 });
  document.getElementById('most').textContent = calculatedValues.most.toLocaleString();
  document.getElementById('least').textContent = calculatedValues.least.toLocaleString();
}

function CalculateStats(eventsArray) {
  let finalValues = {
    total: 0,
    average: 0,
    most: eventsArray[0].attendance,
    least: eventsArray[0].attendance
  }

  for (let i = 0; i < eventsArray.length; i++) {
    let currentEvent = eventsArray[i];
    //Calculate total and update the object
    finalValues.total += currentEvent.attendance;
    //test for most and update the object
    finalValues.most = finalValues.most < currentEvent.attendance ? currentEvent.attendance : finalValues.most;
    //test for least and update the object
    finalValues.least = finalValues.least > currentEvent.attendance ? currentEvent.attendance : finalValues.least;
  }
  //Calculate the average
  finalValues.average = finalValues.total / eventsArray.length;

  return finalValues;
}

function DisplayEventData(eventsArray) {
  let tableBody = document.getElementById('eventTableBody');
  const tableRowTemplate = document.getElementById('eventTableRowTemplate');

  tableBody.innerHTML = '';

  for (let i = 0; i < eventsArray.length; i++) {
      let eventRow = document.importNode(tableRowTemplate.content, true);
      let currentEvent = eventsArray[i];

      let tableCells = eventRow.querySelectorAll('td');

      tableCells[0].textContent = currentEvent.event;
      tableCells[1].textContent = currentEvent.city;
      tableCells[2].textContent = currentEvent.state;
      tableCells[3].textContent = currentEvent.attendance.toLocaleString();
      tableCells[4].textContent = currentEvent.date;

      tableBody.appendChild(eventRow);
  }
}

function GetEventData(){
  let currentEvents = JSON.parse(localStorage.getItem('eventnetEventData'));

  if(currentEvents == null){
    currentEvents = events;
    localStorage.setItem('eventnetEventData', JSON.stringify(currentEvents));
  }

  return currentEvents;
}

function GetEvents(element){
  let currentEvents = GetEventData();
  let cityName = element.getAttribute('data-string');

  let filteredEvents = currentEvents;

  if(cityName != 'All'){
     filteredEvents = currentEvents.filter(
      function(event){
        if(cityName == event.city){
          return event;
        }}
    );
  }

  document.getElementById('statsHeader').textContent = cityName;
  DisplayStats(filteredEvents);
  DisplayEventData(filteredEvents);
}
 
function SaveEventData(){
  let eventName = document.getElementById('newEventName').value;
  let cityName = document.getElementById('newEventCity').value;
  let eventAttendance = parseInt(document.getElementById('newEventAttendance').value);
  let eventDate = document.getElementById('newEventDate').value;
  eventDate = `${eventDate} 00:00`;
  eventDate = new Date(eventDate).toLocaleDateString();



  let stateSelect = document.getElementById('newEventState')
  let  state = stateSelect.options[stateSelect.selectedIndex].text;

  let newEvent = {
    event: eventName,
    city: cityName,
    state: state,
    attendance: eventAttendance,
    date: eventDate,
  }

  let currentEvents = GetEventData();
  currentEvents.push(newEvent);

  localStorage.setItem("eventnetEventData",JSON.stringify(currentEvents));

  BuildDropDown();
  document.getElementById('statsHeader').textContent = 'All';
  document.getElementById('newEventForm').requestFullscreen();
}
