const calender = document.querySelector(".calender"),
date = document.querySelector(".date"),
daysContainer = document.querySelector(".days"),
prev = document.querySelector(".prev");
(next = document.querySelector(".next")),
(todayBtn = document.querySelector(".today-btn")),
(gotoBtn = document.querySelector(".goto-btn")),
(dateInput = document.querySelector(".date-input"));
const eventDay = document.querySelector(".event-day");
const eventDate= document.querySelector(".event-date");
const eventsContainer= document.querySelector(".events");
const addEventSubmit = document.querySelector(".add-event-btn");


let today = new Date();
let activeDay;
let month= today.getMonth();
let year = today.getFullYear();
// we created a handy array to convert the month no into year
const months =[
    "January",
    "Feburary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September","October","November","December",
];
//default events array
// const eventsArr = [
//     {
//         day:16, month: 11,year:2025,
//         events:[
//             {
//             title: "event 1 f;skf;fdlg'drldfl",
//             time: "10:00AM",
//         },
//         {
//             title: "event 2",
//             time: "11:00AM",
//         },
// ],
//     },
//         {
//         day:18, month: 11,year:2025,
//         events:[
//             {
//             title: "event 1 f;skf;fdlg'drldfl",
//             time: "10:00AM",
//         },
//         {
//             title: "event 2",
//             time: "11:00AM",
//         },
// ],
//     },
// ];
//function to add days
//set an empty array which will store all the events
let eventsArr =[];
//get events from local storage 
getEvents();
function initCalender(){
    //to get prev month and current month all days and rem next month days
const firstDay = new Date(year,month,1); //we wrote 1 because we want first day of month date() is built in function in js
const lastDay = new Date(year,month+1,0);//month+1 beacause we want last day of current month 0 means last day of prev month
const prevLastDay = new Date(year,month,0);//last day of prev month
const prevDays = prevLastDay.getDate();//get date is build in function in js it extracts date from the date object it will give 31 for oct 
const lastDate = lastDay.getDate();//it will give last date of current month
const day = firstDay.getDay();//it will give day of week sun=0 to sat=6
const nextDays = 7 - lastDay.getDay() - 1;//it will give how many days of next month we have to show on current month calender
//update date top of calender [month] will fetch month from months array
date.innerHTML = months[month]+ " "+year;

//adding days on dom we will add prev month days current month days and next month days
let days= "";
//pev month days day store kra hai hai kisi bhi month ka 1st day konsa hai sun mon
for(let x=day;x>0;x--){
    days +=`<div class="day prev-date">${prevDays - x + 1}</div>`;//if eg aug 31 is friday so day =5 loop runs for 5 times and add 31-5+1=27 so it will add 27,28,29,30,31
}
//current month days
for(let i=1;i<=lastDate;i++){
//check if event present on current day we assume that no event is present for a day
let event =false;
eventsArr.forEach((eventObj) => {//eventsArr is array of events we created
    if(eventObj.day===i && eventObj.month === month+1 && eventObj.year===year){//eventObj is object of events array ye  check krta hai ki us object ka day month year current day month year ke barabar hai ya nhi 
        //if event found
        event = true;
    }
});
    //is se ajj ki date highlight hogi ye loop check krta hai ki jo date ham show kr rhe hai wo ajj ki date hai ya nhi
    if (i === new Date().getDate() && year=== new Date().getFullYear() && month === new Date().getMonth()
    )
{
        activeDay= i;//set active day as today
        getActiveDay(i);//right side active day updte krne ke liye
        updateEvents(i);//right hand side events update krne ke liye
       if(event){//ye check krta hai koi event hai if hai then div bnadega jisme today active event class hogi
        days+=`<div class="day today active event"> ${i}</div>`;
       }
       else{ //agr event nhi hai to sirf highlight krdega 
         days+=`<div class="day today active"> ${i}</div>`;
       }
    }
    // ye normal days ke liye event check krega
    else{
         if(event){//agr event hai to event class add krdega
        days+=`<div class="day event"> ${i}</div>`;
       }
       else{//event nhi ha to normal day addd hoga
         days+=`<div class="day "> ${i}</div>`;
       }
    }
}
//ye loop last me next month days add krega
for(let j=1;j<=nextDays;j++){
      days+=`<div class="day next-date"> ${j}</div>`;//next-date mahine ke un din ka color gray krdega 
}
daysContainer.innerHTML = days; //ye pure days ko dayscontainer jo html me tha usme add krdega 
addListner();//ye function pure days pe listner add krdega taki click krne pe active ho jaye
}
initCalender();
function prevMonth(){// ye tab kam krega jab prev par click krege 
    month--;
    if(month < 0){//if jan se peech jayega to dec show krde
        month=11;
        year--;
    }
    initCalender();//dubara call krege taki claendar update ho jaye
}
function nextMonth(){
    month++;
    if(month>11){
        month=0;
        year++;
    }
    initCalender();
}
//adding eventlistners on prev and next
prev.addEventListener("click",prevMonth);
next.addEventListener("click",nextMonth);
//after this js we have our claender ready moving to nexxt and prev month 
todayBtn.addEventListener("click", () => {
    today=new Date();//update today date fetches todays date from computer
    month = today.getMonth();
    year= today.getFullYear();
    initCalender();
});
//JO DATE INPUT VALA BOX HA USME FUNCTIONALITY LAGA RHE HA
dateInput.addEventListener("input" , (e) => {
    dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");//remove everything except no and slash
    if(dateInput.value.length === 2){
        //add a slash if 2 no entered
        dateInput.value+= "/";
    }
    if(dateInput.value.length > 7){
        //dont allow more than 7 chracter
        dateInput.value = dateInput.value.slice(0,7);
    }
    //if backspace pressed
    if(e.inputType === "deleteContentBackward"){//e.inputType ye btata hai ki konsi key press hui hai
        //if user enter 3 char and then press backspace it will remove / also 
        if(dateInput.value.length === 3){
            dateInput.value = dateInput.value.slice(0,2);
        }
    }
});
gotoBtn.addEventListener("click", gotoDate);
function gotoDate() {
    const dateArr = dateInput.value.split("/"); // expecting MM/YYYY ye split kredega date and year ko slash se
    console.log(dateArr);
    if (dateArr.length === 2) {//if user enter both month and year
        let enteredMonth = parseInt(dateArr[0]);//array ke 0th index pe month hoga
        let enteredYear = parseInt(dateArr[1]);
        // validations
        if (enteredMonth > 0 && enteredMonth < 13 && enteredYear.toString().length === 4) {//month 1-12 and year 4 digit tostring se convert krke length ccheck kr rhe hai
            month = enteredMonth - 1; //in js month 0 se start kiye the yaha 1 se isliye -1 kiya
            year = enteredYear;
            initCalender();
            return;
        }
    }
    // if invalid date
    alert("Invalid date! Please enter in MM/YYYY format.");
}   
//after click + sign then only content visible ye code pop up ko control krega
const addEventBtn = document.querySelector(".add-event"),
addEventContainer =document.querySelector(".add-event-wrapper"),
addEventCloseBtn = document.querySelector(".close"),
addEventTitle = document.querySelector(".event-name"),
addEventFrom = document.querySelector(".event-time-from"),
addEventTo = document.querySelector(".event-time-to");

addEventBtn.addEventListener("click",() => {
    addEventContainer.classList.toggle("active");//jab page reload hoga to ye class nhi hogi jab click krenge to ye class add ho jayegi popup show hoga
});
addEventCloseBtn.addEventListener("click",() => {
    addEventContainer.classList.remove("active");//jab close btn pe click krege to remove krdega class ko
});
document.addEventListener("click",(e) => {
    //if clicked outside
    if(e.target !== addEventBtn && !addEventContainer.contains(e.target)){//ye check krta hai ki click kaha hua hai agr add event btn pe nhi hua aur e.target addEventContainer ke andar bhi nhi hai to iska matlab bahar click hua
        addEventContainer.classList.remove("active");
    }
});
//allows only 50 char in title
addEventTitle.addEventListener("input",(e) => {
    addEventTitle.value = addEventTitle.value.slice(0,50);
});
//time format in from and to time
addEventFrom.addEventListener("input", (e)=> {
    //remove anything else numbers
    addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g,"");
    //if 2 no entered auto add :
    if(addEventFrom.value.length === 2){
        addEventFrom.value+= ":";
    }
    //dont let user enter more than 5 char
    if(addEventFrom.value.length > 5){
        addEventFrom.value = addEventFrom.value.slice(0,5);
    }
});
//same with to time
addEventTitle.addEventListener("input",(e) => {
    addEventTitle.value = addEventTitle.value.slice(0,50);
});
//time format in from and to time
addEventTo.addEventListener("input", (e)=> {
    //remove anything else numbers
    addEventTo.value = addEventTo.value.replace(/[^0-9:]/g,"");
    //if 2 no entered auto add :
    if(addEventTo.value.length === 2){
        addEventTo.value+= ":";
    }
    //dont let user enter more than 5 char
    if(addEventTo.value.length > 5){
        addEventTo.value = addEventTo.value.slice(0,5);
    }
});
//lets create functions to add listner on days after adding days to dom 
 function addListner(){
    const days=document.querySelectorAll(".day");//ye line pure days ko select krke days me store kregi
    days.forEach((day) => {
    day.addEventListener("click",(e) =>{
        activeDay = Number(e.target.innerHTML);//e.target.innerHTML se hame wo date mil jayegi jo hamne click ki hai
getActiveDay(e.target.innerHTML);//right side active daya and date update krne ke liye
updateEvents(Number(e.target.innerHTML));//right side events update krne ke liye
        days.forEach((day) => {
            day.classList.remove("active");//yeh line pure days me se active class remove krdega taki sirf ek hi active ho
        });
if(e.target.classList.contains("prev-date")){//agr ham prev month ki date pe jate hai to it will shift to prev month calender ye line check krti hai ki jis date pe click kiya wo prv month ki date hai ya nhi
    prevMonth();
    setTimeout(() => {
        //select all days of that month
        const days = document.querySelectorAll(".day");
        days.forEach((day) =>{
            if(!day.classList.contains("prev-date") && day.innerHTML ===e.target.innerHTML){//ye check krta hai ki wo prev month ki date nhi hai aur jo date hamne click ki wo us date ke brabar hai to acitve jodh do
                day.classList.add("active");
            }
        });
    },100);
}
//same with next month days agr ham next month ki date pe jate hai to it will shift to nesxt month calender
else if(e.target.classList.contains("next-date")){
    nextMonth();
    setTimeout(() => {
        //select all days of that month
        const days = document.querySelectorAll(".day");
        //after going to prev month add active to clicked
        days.forEach((day) =>{
            if(!day.classList.contains("next-date") && day.innerHTML ===e.target.innerHTML){
                day.classList.add("active");
            }
        });
    },100);
}
else{
    e.target.classList.add("active");//agr current month ki date pe click kiya to sirf acive krdo add class mei
}
    });
});
 }
function getActiveDay(dayNumber){//right side pe heading and date update krne ke liye activeday = dayNmber
    const day = new Date(year, month, dayNumber);//yeh line hame pura date de degi jis din pe hamne click kiya hai
    const dayName = day.toString().split(" ")[0];//yeh line us date se day name nikal ke degi eg mon etc
    eventDay.innerHTML = dayName;//yeh line right side pe day name update krego
    eventDate.innerHTML = dayNumber + " " + months[month] + " " + year;
}
function updateEvents(date){
    let events = ""; //yeh variable hame events store krke dega
    eventsArr.forEach((event) =>{
        if(date === event.day && month+1 === event.month && year===event.year){//ye check krta hai clicked day month year events array ke day month year ke brabar hai ya nhi
            event.events.forEach((event) =>{//ye loop events array ke andr ke events pe chalega 
                events+=`
                <div class="event">
                <div class="title">
                <i class="fas fa-circle"></i>
                <h3 class="event-title">${event.title}</h3>
                </div>
                <div class="event-time">
                <span class="event-time">${event.time}</span>
                </div>
                </div>
                `;
            });
        }
    });
    //if nothing found
    if((events === "")){
        events = `<div class="no-event">
        <h3>No Events</h3>
        </div>`;
    }
    eventsContainer.innerHTML=events;//yeh line pure events ko eventscontainer me add krdega
    saveEvents();//store event in local storage
}
//lets create function to add events
addEventSubmit.addEventListener("click", () => {
    const eventTitle = addEventTitle.value;
    const eventTimeFrom = addEventFrom.value;
    const eventTimeTo = addEventTo.value;
    if (eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "") {
        alert("Please fill all the fields");
        return;
    }
        const timeFromArr = eventTimeFrom.split(":");//yeh line time ko : se split krke array me store krdegi
        const timeToArr = eventTimeTo.split(":");
        if(timeFromArr.length !==2 || timeToArr.length !==2 ||timeFromArr[0]>23 || timeFromArr[1]>59 || timeToArr[0]>23 || timeToArr[1]>59){
            alert("invalid time format"); 
            return;
        }
const timeFrom = convertTime(eventTimeFrom);//yeh time ko 12 hour format me convert krdega
const timeTo = convertTime(eventTimeTo);

   const newEvent ={//ye ek naya object bnayega jisme event ki details hogi
    title:eventTitle,
    time: timeFrom+ " - "+timeTo,
};
let eventAdded = false;//ye flag yad rkhega ki event add hua ya nhi
if(eventsArr.length>0){
    eventsArr.forEach((item) =>{
        if(item.day === activeDay && item.month === month+1 && item.year === year ){
            item.events.push(newEvent);
            eventAdded = true;
        }
    });
}
//if event array emoty or current day has no event create new
if(!eventAdded){
    eventsArr.push({
        day:activeDay,
        month: month+1,
        year:year,
        events: [newEvent],
    });
}
addEventContainer.classList.remove("active");//hide the popup
addEventTitle.value = "";//clear the input feilds because agr nhi kiya to dubara add event pe click krne se pichla data show hoga 
addEventFrom.value = "";
addEventTo.value = "";
updateEvents(activeDay);
const activeDayElem = document.querySelector(".day.active");// yeh line us active day ko select krke degi jisme hamne event add kiya hai
if(!activeDayElem.classList.contains("event")){//agr usme event class nhi hai to add krde taki dot show ho uske neeche
    activeDayElem.classList.add("event");
}
  });

function convertTime(time){
    let timeArr= time.split(":");
    let timeHour= timeArr[0];
    let timeMin = timeArr[1];
    let timeFormat = timeHour >=12 ? "PM":"AM";
    timeHour = timeHour % 12 || 12;
    time = timeHour + ":"+timeMin + " "+timeFormat;
    return time;
}
//lets create a function to remove events on click
eventsContainer.addEventListener("click", (e) => {
    // find the closest event element (even if clicking inside it)
    const eventElem = e.target.closest(".event");
    if (!eventElem) return;

    // get the title text of the clicked event
    const title = eventElem.querySelector(".event-title").innerText;

    // find and remove from eventsArr
    eventsArr.forEach((event) => {
        if (event.day === activeDay && event.month === month + 1 && event.year === year) {
            event.events.forEach((item, index) => {
                if (item.title === title) {
                    event.events.splice(index, 1);
                }
            });
            //if no event remaining on that dat remove complete day
            if(event.events.length ===0){
                eventsArr.splice(eventsArr.indexOf(event),1);
                //after removing complete dya also remove active class of that day
                const activeDayElem=document.querySelector(".day.active");
                if(activeDayElem.classList.contains("event")){
                    activeDayElem.classList.remove("event");
                }
            }
        }
    });

    //after removing from array update event
    updateEvents(activeDay);
});
//lets store events in local storage get from where
function saveEvents(){
    localStorage.setItem("events",JSON.stringify(eventsArr));
}
function getEvents() {
    const storedEvents = localStorage.getItem("events");
    if (storedEvents === null) {
        return;
    }
    eventsArr.push(...JSON.parse(storedEvents));
    //spread operataor used array ke har element ko eventsArr me alag add kar deta
}
