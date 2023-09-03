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

function openEventModal(selectedDate) {
  console.log(`Selected date: ${selectedDate}`);
  
  const createEvent = window.confirm(`No events on ${selectedDate}, would you like to create one?`);
  if (createEvent) {
    console.log('Creating new event');
    const eventTitle = prompt('Enter event title:');
    const eventStart = selectedDate;
    
    if (eventTitle && eventStart) {
      const eventData = {
        title: eventTitle,
        start: eventStart,
      };

      // Modify this line to pass the clubId parameter to createEvent
      createEvent(eventData, clubId);
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    selectable: true,
    events: [
      {
        title: 'The Title',
        start: '2018-09-01',
        end: '2018-09-02',
      },
    ],
    dateClick: function(info) {
      openEventModal(info.dateStr);
    },
  });
  calendar.render();
});


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


