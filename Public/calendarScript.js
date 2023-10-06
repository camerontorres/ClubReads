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
function openEventModal(eventDetails, eventTitles) {
  const modal = document.getElementById('myModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalContent = document.getElementById('eventDetails');
  const eventList = document.getElementById('eventList');

  // Populate modal content with event details
  modalContent.innerHTML = eventDetails;

  // Clear any previous event titles in the eventList
  eventList.innerHTML = '';

  // If there are event titles, add them to the eventList
  if (eventTitles.length > 0) {
    eventTitles.forEach((title) => {
      const listItem = document.createElement('li');
      listItem.textContent = title;
      eventList.appendChild(listItem);
    });
  } else {
    // If there are no events, display a message
    const listItem = document.createElement('li');
    listItem.textContent = 'No events scheduled';
    eventList.appendChild(listItem);
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
      selectedDate.setHours(0, 0, 0, 0);
      console.log('Selected Date:', selectedDate);
      console.log('eventData Date:', eventData);

      // Filter events for the selected date
      const eventsForSelectedDate = eventData.filter(event => {
        const startDate = new Date(event.start);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(event.end);
        endDate.setHours(0, 0, 0, 0);
        console.log('Selected Date:', selectedDate);
        console.log('Event Start Date:', startDate);
        console.log('Event End Date:', endDate);
        //console.log('Comparison Result:', startDate <= selectedDate && selectedDate <= endDate);
        //return startDate <= selectedDate && selectedDate <= endDate;

        const isEventMatching = startDate <= selectedDate && selectedDate <= endDate;
        console.log('Comparison Result:', isEventMatching);
        
        return isEventMatching;
      });
      console.log('im console loggin here!', eventsForSelectedDate)

      if (eventsForSelectedDate.length > 0) {
        // Create event details content
        const eventDetails = `<h2>${selectedDate}</h2>`;
        
        // Extract event titles
        const eventTitles = eventsForSelectedDate.map(event => event.title);
    
        // Create a container for the events
        const eventsContainer = document.createElement('ul');
        eventsContainer.id = 'eventList';
    
        // Create list items for each event
        eventTitles.forEach(title => {
          const listItem = document.createElement('li');
          listItem.textContent = title;
          eventsContainer.appendChild(listItem);
        });
        
        // Append the events container to the modal
        document.getElementById('eventDetails').innerHTML = eventDetails;
        document.getElementById('eventDetails').appendChild(eventsContainer);
    
        // Open the modal with event details
        openEventModal(eventDetails, eventTitles);
      }  else {
        // If there are no events, display a message
        const eventDetails = `<h2>${selectedDate}</h2>`;
        const eventTitles = ['No events scheduled'];
        
        // Open the modal with event details
        openEventModal(eventDetails, eventTitles);
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
  


