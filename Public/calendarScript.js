function openEventModal(selectedDate) {
    console.log(`Selected date: ${selectedDate}`);
    
    const createEvent = window.confirm(`No events on ${selectedDate}, would you like to create one?`);
    if (createEvent) {
      console.log('Creating new event');
      const eventTitle = prompt('Enter event title:');
      const eventStart = selectedDate;
      const eventEnd = prompt('Enter event end date (YYYY-MM-DD HH:mm):');

      if (eventTitle && eventEnd) {
        const eventData = {
          title: eventTitle,
          start: new Date(eventStart),
          end: new Date(eventEnd),
        };

        // Make an AJAX POST request to your server
        const bookclub = Club.findById(req.params._id)
        fetch(`/bookclubPage/${bookclub}/createEvent`, {
          method: 'POST',
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
            } else {
             console.log(error)
            }
          })
          .catch((error) => {
            console.error('Error creating event:', error);
          });
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