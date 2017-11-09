/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());

/* attendance data is stored in an object formatted:

var attendance = {
  'Adam the Anaconda': [
    true,
    false,
    false,
    false,
    true,
    ...
  ],
  'Gregory the Goat': [
    false,
    false,
    true,
    ...
  ]
  ...
};

*/

(function($) {

  // init a counter for loops
  var i;

  var model = {
    init: function() {

      var name;
      var students = this.get.students();
      // loop through the attendance records and calculate initial missed days
      for (name in students) {
        // calculate missed days for each student, push missed days to state
        this.state[name] = this.calculate_missed_days(students[name]);
      }

    },
    calculate_missed_days: function(attendance_array) {
      var missed_days = 0;
      // loop through the array of attendance data for a specific student name
      for (i = 0; i< attendance_array.length; i+=1) {
        // if the attendace for a day is false
        if (attendance_array[i] === false) {
          // increment the missed days count
          missed_days += 1;
        }
      }
      return missed_days;
    },
    state: {
      // store missed days per student name
    },
    get: {
      students: function() {
        /*
        Return the whole students table.
        */
        return JSON.parse(localStorage.attendance);
      },
      student: function(name) {
        /*
        Return a student attendance record array of booleans from localstorage.
        */
        var students = model.get.students();
        return students[name];
      },
      missed_days: function(name) {
        return model.state[name];
      }
    },
    set: {
      student: function(name, attendance_array) {
        /*
        Set a student's attendance array of booleans in localstorage
        */
        // get copy of the students data table
        var students = model.get.students();
        // reset a specific student's attendance = to the passed in array
        students[name] = attendance_array;
        // recodify the students table to string, update the localstorage
        localStorage.attendance = JSON.stringify(students);
        // recalculate missed days for updated student item
        model.state[name] = model.calculate_missed_days(attendance_array);
      }
    }
  };

  var controller = {
    init: function() {
      model.init();
      view.init();
      // attach event listeners to whatever needs it
      this.attach_listeners();
    },
    attach_listeners: function() {
      // attach listener to the body to listen for checkbox events bubbling up
      $(view.elements.$tbody).on('click', '.attend-col', function() {
        // array to update w/ new attendance properties in the interacted row
        var updated_attendance_array = [];
        // grab current row's student name
        var current_student = $(this).siblings('.name-col').text();
        // grab all checkbox inputs in the row that was clicked on
        var $current_row = $(this).parents('.student').find('input');

        // loop through the current row of checkbox inputs
        for (i=0; i < $current_row.length; i+=1) {
          // push the updated checkbox inputs to the attedance array
          updated_attendance_array.push($($current_row[i]).prop('checked'));
        }

        // update the student's data w/ the new attendance array
        model.set.student(current_student, updated_attendance_array);
        // rerender the missing days view
        view.render.missing(current_student, model.get.missed_days(current_student));

      });
    }
  };

  var view = {
    init: function() {
      // get the dom elements from the live dom
      this.grab_elements();

      // grab the full students table data
      var students = model.get.students();
      // loop through each student in the table
      var name;
      for (name in students) {
        // check checkboxes that should be checked based on initial data in each
        // student attendance array record
        this.render.checked(name, students[name]);
        // render the days missed for each student
        this.render.missing(name, model.get.missed_days(name));
      }

    },
    elements: {
      // will have values assigned w/ relevant dom elements
      $missed: undefined,
      $checkboxes: undefined,
      $tbody: undefined
    },
    grab_elements: function() {
      // cache ref to the col that lists missed days
      this.elements.$missed = $('tbody .missed-col');
      // gets all the checkbox elements in the dom
      this.elements.$checkboxes = $('tbody input');
      // get the tbody container elements
      this.elements.$tbody = $('tbody');
    },
    render: {
      missing: function(name, missing_days) {
        /*
        Render a certain student's missing days.
        */
        // grab the current student's name element
        var $current_student = $('tbody .name-col:contains("' + name + '")');
        // get the missing days container as a sibling of the name element
        var $current_missing = $($current_student).siblings('.missed-col')[0];

        // set the current missing days in view to new number of days missed
        $($current_missing).text(missing_days);

      },
      checked: function(name, attendance_array) {
        // grab the current student row's checkbox inputs
        var $current_checkboxes = $('tbody .name-col:contains("' + name + '")')
                                  .siblings()
                                  .children('input');

        // loop through the current row of checkbox inputs
        for (i=0; i < $current_checkboxes.length; i+=1) {
          // set each checkbox checked property equal to its
          // corresponding value in the attendance array
          $($current_checkboxes[i]).prop('checked', attendance_array[i]);
        }
      }
    }
  };

  // initiate the app
  controller.init();

}($));
