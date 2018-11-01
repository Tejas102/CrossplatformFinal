
// event listeners
//========================
document.addEventListener("deviceReady", connectToDatabase);
document.getElementById("insert").addEventListener("click", insertPressed);
document.getElementById("show").addEventListener("click", showPressed);

// global variables
var db = null;

/*
1. open a connection to your database
2.  create a table

3.  write sql to do stuff  (select / insert / delete)
*/
// database specific functions
// ============================

function connectToDatabase() {
  console.log("device is ready - connecting to database");

  // 2. open the database. The code is depends on your platform!
  if (window.cordova.platformId === 'browser') {
    console.log("browser detected...");
    // For browsers, use this syntax:
    //  (nameOfDb, version number, description, db size)
    // By default, set version to 1.0, and size to 5MB
    db = window.openDatabase("superdb", "1.0", "Database for rescuing Superheros", 5*1024*1024);
  }
  else {
    alert("mobile device detected");
    console.log("mobile device detected!");

    var databaseDetails = {"name":"superdb.db", "location":"default"}
    db = window.sqlitePlugin.openDatabase(databaseDetails);
    console.log("done opening db");
  }

  if (!db) {
    alert("databse not opened!");
    return false;
  }

  // 3. create relevant tables
  db.transaction(
    function(tx){
      // Execute the SQL via a usually anonymous function
      // tx.executeSql( SQL string, arrary of arguments, success callback function, failure callback function)
      // To keep it simple I've added to functions below called onSuccessExecuteSql() and onFailureExecuteSql()
      // to be used in the callbacks
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS heroes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, isAvailable INTEGER)",
        [],
        onSuccessExecuteSql,
        onError
      )
    },
    onError,
    onReadyTransaction
  );


}





// my functions go here
//========================
// function insertPressed() {
//   // debug:
//   console.log("insert button pressed!");
//   alert("insert button pressed!");
//
//   // 1. get data from USER interface
//   //var n = document.getElementById("insert").value;
//   //var d = document.getElementById("deptBox").value;
//   //var s = document.getElementById("show").value;
//
//   // DEBUG:
//   //console.log("Name: " + n);
//   //console.log("Dept: " + d);
//   //console.log("Availability: " + s);
//
//   // 2. INSERT INTO DATABASE
//
//   db.transaction(
//         function(tx){
//       //INSERT INTO heroes (name, isAvailable) VALUES ("pritesh", "madt");
//             tx.executeSql("INSERT INTO heroes(name, isAvailable) VALUES
//             ('Spiderman', 1),
//             ('Thor', 1),
//             ('Captain America', 0),
//             ('Wonder Woman', 0)";
//
//           //  [n, s],
//             onSuccessExecuteSql,
//             onError )
//           )
// }
// }

  // db.transaction(
  //       function(tx){
  //     //INSERT INTO heroes (name, isAvailable) VALUES ("pritesh", "madt");
  //     INSERT INTO heroes (name, isAvailable)
  //           VALUES
  //                 ('Spiderman', 1),
  //                 ('Thor', 1),
  //                 ('Captain America', 0),
  //                 ('Wonder Woman', 0);

           //[n, s]
            //onSuccessExecuteSql,
            //onError )
    //
    //     },
    //     onError,
    //     onReadyTransaction
    // )


function showPressed() {
  //debug:
  console.log("show button pressed!");
  alert("show button pressed!");

  // 1. RUN YOUR SQL QUERY
  db.transaction(
        function(tx){
            tx.executeSql( "SELECT * FROM heroes",
            [],
            displayResults,
            onError )
        },
        onError,
        onReadyTransaction
    )
}

function displayResults( tx, results ){

    if(results.rows.length == 0) {
            alert("No records found");
            return false;
        }

        var row = "";
        for(var i=0; i<results.rows.length; i++) {
      document.getElementById("resultsSection").innerHTML +=
          "<p> Name: "
        +   results.rows.item(i).name
        + "<br>"
        + "isAvailable: "
        +   results.rows.item(i).isAvailable
        + "</p>";
        }
    }

// common database functions
function onReadyTransaction( ){
  console.log( 'Transaction completed' )
}
function onSuccessExecuteSql( tx, results ){
  console.log( 'Execute SQL completed' )
}
function onError( err ){
  console.log( err )
}
