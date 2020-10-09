var emailList_1 = ["a1@gmail.com", "a2@gmail.com", "a3@gmail.com", "a4@gmail.com", "a5@gmail.com","a6@gmail.com"];
var emailList_2 = ["b1@gmail.com", "a2@gmail.com", "b3@gmail.com", "b4@gmail.com", "a4@gmail.com", "a5@gmail.com", "a6@gmail.com"];

// --------------------------task 1.2-------------------------------- 

var common = [];
emailList_1.forEach(function(email) {
    if (emailList_2.includes(email)) {
        // console.log(email);
        common.push(email);
    }
});
console.log(common);

// -----------------------task 1.1------------------------------------
var c =[];
emailList_1.forEach(function(email) {
    if (! emailList_2.includes(email)) {
        c.push(email);
        // console.log(email);
    }
});
console.log(c);
// ------------------------task 1.3---------------------------
var notInL1 = [];
emailList_2.forEach(function(email) {
    if (! emailList_1.includes(email)) {
        // console.log(email);
        notInL1.push(email);
    }
});
console.log(notInL1);
// ----------------------- task 2.1 --------------------------------
var new_email_List1 = ["a1@gmail.com", "a3@gmail.com", "a6@gmail.com", "a7@gmail.com", "a8@gmail.com"];
var new_email_List2 = ["b1@gmail.com", "b2@gmail.com", "b3@gmail.com",  "b5@gmail.com",  "b6@gmail.com"];
var sameValue =[];
var deletedVal =[];
emailList_1.forEach(function(email){
    if( !new_email_List1.includes(email)){
        deletedVal.push(email);
    }
    // else{
    //     sameValue.push(email);
    // }
});
console.log("deleted from new array",deletedVal);

var addedVal =[];
new_email_List1.forEach(function(email){
    if( !emailList_1.includes(email)){
        addedVal.push(email);
    }
});

console.log("added value in both array", addedVal);