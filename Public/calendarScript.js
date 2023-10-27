function createEvent(eventData, clubId) {
  // Make an AJAX POST request to your server
  fetch(`/bookclubPage/${clubId}/createEvent`, {
    method: 'POST',
    value: '_method',
    type: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Event created successfully, update the UI or calendar as needed
        // You might want to reload the page or update the calendar to show the new event
        console.log('Event created successfully');
      } else {
        console.log('Error:', data.message);
      }
    })
    .catch((error) => {
      console.error('Error creating event:', error);
    });
}
//********************************** */

// Function to open the modal
function openEventModal(eventDetails, eventTitles, startDate) {
  const modal = document.getElementById('myModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalContent = document.getElementById('eventDetails');
  const eventList = document.getElementById('eventList');
  
 
  
  // Populate modal content with event details
  modalContent.innerHTML = eventDetails;
  console.log('eventtitle', eventTitles)

  // Clear any previous event titles in the eventList
  if (eventList) {
    eventList.innerHTML = '';
  } else {
    console.error('eventList element not found');
  }

  // If there are event titles, add them to the eventList
  if (eventTitles.length > 0) {
    eventTitles.forEach((title) => {
      //console.log('title', title) TESTLOG
      const listItem = document.createElement('li');
      const myList = document.createElement('ul');
      modalContent.appendChild(myList)
      
      if (startDate instanceof Date) {
        const startOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
        const formattedStart = startDate.toLocaleTimeString(undefined, startOptions);
        listItem.innerHTML = `<h2>${title} at ${formattedStart}</h2>`;
      } else {
        console.error('Invalid eventStart:', startDate);
        listItem.innerHTML = `<h2>${title}!</h2>`;
      }

      myList.appendChild(listItem);
    });
  } else {
    // If there are no events, display a message
    const listItem = document.createElement('li');
    listItem.textContent = 'No events scheduled';
    modalContent.appendChild(listItem);
  }

  // Display the modal
  modal.style.display = 'block';

  // Close modal when the close button is clicked
  closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Close modal when clicking outside of it
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
}

//***** Example: Trigger openEventModal on date click (modify this to fit your calendar library)
document.addEventListener('DOMContentLoaded', function() {
  // Find the calendar element by its ID
  var calendarEl = document.getElementById('calendar');
  
  // Get the event data from the data-events attribute
  var eventData = JSON.parse(calendarEl.getAttribute('data-events'));

  // Create a FullCalendar instance
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    selectable: true,
    events: eventData,
    
    
    dateClick: function(info) {
      // Check if there are events for the selected date
      
      const selectedDate = new Date(info.date);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = selectedDate.toLocaleDateString(undefined, options);

      selectedDate.setHours(0, 0, 0, 0);
      //console.log('Selected Date:', selectedDate);
      //console.log('eventData Date:', eventData);
      const eventDetailDiv = document.getElementById('eventDetails');

      // Filter events for the selected date
      const eventsForSelectedDate = eventData.filter(event => {
        const startDate = new Date(event.start);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(event.end);
        endDate.setHours(0, 0, 0, 0);
        //TESTS
        //console.log('Selected Date:', selectedDate);
        //console.log('Event Start Date:', startDate);
        //console.log('Event End Date:', endDate);
        //console.log('Comparison Result:', startDate <= selectedDate && selectedDate <= endDate);
        //return startDate <= selectedDate && selectedDate <= endDate;

        const isEventMatching = startDate <= selectedDate && selectedDate <= endDate;
       // console.log('Comparison Result:', isEventMatching); TEST LOG
        
        return isEventMatching;
      });
      //console.log('im console loggin here!', eventsForSelectedDate) TESTLOG

      if (eventsForSelectedDate.length > 0) {
        // Create event details content
        const eventDetails = `<h4>${formattedDate}</h4>`;
    
        // Extract event titles
        const eventTitles = eventsForSelectedDate.map(event => event.title);
        //console.log(eventTitles); TESTLOG
        const eventStart = eventsForSelectedDate.map(event => event.start);
        const startDate = new Date(eventStart)
        
    
        // Create a container for the events
        const eventsContainer = document.createElement('ul');
        eventsContainer.id = 'eventList';
    
        // Clear previous entries and append the events container
        
        eventDetailDiv.innerHTML = '';
        eventDetailDiv.appendChild(eventsContainer);
    
        // Create list items for each event
        eventTitles.forEach(title => {
            //console.log(title);
            const listItem = document.createElement('li');
            listItem.textContent = `${title} at ${startDate}`;
            eventsContainer.appendChild(listItem);
        });
    
        // Open the modal with event details
        openEventModal(eventDetails, eventTitles, startDate);
    }  else {
        // If there are no events, display a message
        const eventDetails = `<h4>${formattedDate}</h4>`;
        const eventTitles = ['No events scheduled'];
        
        // Create a container for the message
        const messageContainer = document.createElement('div');
        messageContainer.innerHTML = eventDetails;
    
        // Append the message container to the modal
        const eventDetailsContainer = document.getElementById('eventDetails');
        eventDetailsContainer.innerHTML = ''; // Clear previous entries
        
    
        // Open the modal with the message
        openEventModal(eventDetails, eventTitles, formattedDate);
      }
    },
  });
  
  // Render the calendar
  calendar.render();
});

/*  NOT SURE WHAT THIS DOES BUT CODE WORKS WITHOUT IT LOL

document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');
  var eventData = JSON.parse(calendarEl.getAttribute('data-events'));
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    selectable: true,
    events: eventData,
    dateClick: function(info) {
      // Check if there are events for the selected date
      const selectedDate = info.dateStr;
      const eventTitles = eventData.filter(event => event.date === selectedDate).map(event => event.title);
      
      // Create event details content
      const eventDetails = `<h2>${selectedDate}</h2>`;
      
      // Open the modal with event details
      openEventModal(eventDetails, eventTitles);
    },
  });
  
  calendar.render();
}); */



  // Function to initialize date picker
  function initializeDatePicker() {
    var datePickers = document.querySelectorAll('.datepicker');
    datePickers.forEach(function(datePicker) {
      new Datepicker(datePicker, {
        format: 'yyyy-mm-dd',
        todayHighlight: true,
        autoclose: true
      });
    });
  }

  // Function to initialize time picker
  function initializeTimePicker() {
    var timePickers = document.querySelectorAll('.timepicker');
    timePickers.forEach(function(timePicker) {
      new Timepicker(timePicker, {
        showMeridian: false,
        minuteStep: 1,
        defaultTime: false
      });
    });
  }

  // Initialize date and time pickers when the DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    initializeDatePicker();
    initializeTimePicker();
  });
  


