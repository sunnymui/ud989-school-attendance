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
        // get copy of the students data
        var students = model.get.students();
        // reset a specific student's attendance = to the passed in array
        students[name] = attendance_array;
        // recodify the students table into string and push back to localstorage
        localStorage.attendance = JSON.stringify(students);
        // recalculate missed days for updated student item
        model.state[name] = calculate_missed_days(attendance_array);
      }
    }
  };

  var controller = {
    init: function() {
      model.init();
      view.init();
    },
    attach_listeners: function() {
      // event listener, When a checkbox is clicked, update localStorage
      view.elements.$checkboxes.on('click', function() {
          // get each of the  student table rows
          var studentRows = $('tbody .student'),
          // init an object for the new attendance records
              newAttendance = {};

          // loop through each student's row in the table
          studentRows.each(function() {
              // grab the name text of the current student row in the loop
              var name = $(this).children('.name-col').text(),
              // grab all the checkbox inputs for this row
                  $allCheckboxes = $(this).children('td').children('input');

              // push an array named w/ student name to the newAttendance object
              // array will store the new boolean values for each input checkbox
              newAttendance[name] = [];

              // loop through all the checkbox inputs
              $allCheckboxes.each(function() {
                  // push boolean value of checked property to the array for a student
                  newAttendance[name].push($(this).prop('checked'));
              });
          });

          // count missing days now that its been updated and display it
          //countMissing();
          // update the data with the new attendance data
          localStorage.attendance = JSON.stringify(newAttendance);
      });
    }
  };

  var view = {
    init: function() {
      // get the dom elements from the live dom
      this.grab_elements();

      var name;
      // grab the full students table data
      var students = model.get.students();
      // loop through each student in the table
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
    },
    grab_elements: function() {
      // cache ref to the col that lists missed days
      this.elements.$missed = $('tbody .missed-col');
      // gets all the checkbox elements in the dom
      this.elements.$checkboxes = $('tbody input');
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

  controller.init();

}($));

/* STUDENT APPLICATION */
// $(function() {
//     // grabs the attendance data from local storage
//     var attendance = JSON.parse(localStorage.attendance),
//         // cache ref to the col that lists missed days
//         $allMissed = $('tbody .missed-col'),
//         // gets all the checkbox elements in the dom
//         $allCheckboxes = $('tbody input');
//
//     // Count a student's missed days
//     function countMissing() {
//         // loops through each missed days row
//         $allMissed.each(function() {
//             // get the current table row element
//             var studentRow = $(this).parent('tr'),
//             // get all the checkbox input elements in the current row
//                 dayChecks = $(studentRow).children('td').children('input'),
//             // start days missed at 0
//                 numMissed = 0;
//
//             // loop through all the checkboxes in the current row
//             dayChecks.each(function() {
//                 // check if current checkbox is not checked
//                 if (!$(this).prop('checked')) {
//                     // if not checked, increment the number missed counter
//                     numMissed++;
//                 }
//             });
//
//             // show the number of days missed in the current missed-col td
//             $(this).text(numMissed);
//         });
//     }
//
//     // Add checked property to Check boxes, based on attendance records
//     $.each(attendance, function(name, days) {
//         // grab the row by the student name set in the name-col
//         var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
//         // grab all the checkboxes for the current student row
//             dayChecks = $(studentRow).children('.attend-col').children('input');
//
//         // loop through all the check boxes in the current row
//         dayChecks.each(function(i) {
//             // set the checked property based on index of that checkbox vs the
//             // corresponding item in the days array being true or false
//            $(this).prop('checked', days[i]);
//         });
//     });
//
//     // event listener, When a checkbox is clicked, update localStorage
//     $allCheckboxes.on('click', function() {
//         // get each of the  student table rows
//         var studentRows = $('tbody .student'),
//         // init an object for the new attendance records
//             newAttendance = {};
//
//         // loop through each student's row in the table
//         studentRows.each(function() {
//             // grab the name text of the current student row in the loop
//             var name = $(this).children('.name-col').text(),
//             // grab all the checkbox inputs for this row
//                 $allCheckboxes = $(this).children('td').children('input');
//
//             // push an array named w/ student name to the newAttendance object
//             // array will store the new boolean values for each input checkbox
//             newAttendance[name] = [];
//
//             // loop through all the checkbox inputs
//             $allCheckboxes.each(function() {
//                 // push boolean value of checked property to the array for a student
//                 newAttendance[name].push($(this).prop('checked'));
//             });
//         });
//
//         // count missing days now that its been updated and display it
//         countMissing();
//         // update the data with the new attendance data
//         localStorage.attendance = JSON.stringify(newAttendance);
//     });
//
//     // display the starting number of missing days for each student
//     countMissing();
// }());
