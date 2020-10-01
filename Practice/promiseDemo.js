
/* // ---------------------------------------------- FOR NORMAL FUNCTION------------------------------
var a = 0;
var b = 1;
var c = 5;

function ADD() {
 
  var state = a;
    console.log(state);
  
  var value = b +c  ;
    console.log(value);
  
  var handlers = [];
}
setTimeout(ADD,1000);

 */


// -------------------------------------------- Function In CoreJS -------------------------------------------------------------
// var promise = new Promise((resolve,reject)=>{
//     resolve('good');
//     // reject('bad');
// })
// .then(function ADD () {
//     sum = 2+3
//     console.log(sum);
// })

// .catch(err=>{
//     console.log(err);
// });


/* var p = new Promise((resolve,reject)=>{

  var a = 2+1;
  
  if (a==3){
    
    resolve('Sucessful If Condition')
  }
  else{
    reject('failed')
  }
})
p.then((message)=>{
  console.log("into then "+message);
  console.log("into then ", message);
}).catch((msg)=>{
  console.log("into Catch",msg);
})
 */

// ------------------------------------------------------ READ FILE USING USING PROMISIFY-------------------------------------------
/* const util =require ('util');
const fs =require ('fs');
const { reject } = require('q');
const { resolve } = require('path');
var read = util.promisify(fs.readFile)
Promise.all([
    read('a.txt'),
    read('b.txt'),
    
])
.then(data=>{
    const[a,b,c] =data;
 
    console.log(a.toString());
    console.log(b.toString());
    sum = a + b;
    console.log(sum);

}) */

// ------------------------------------------- Async Await Using Interval---------------------------------------------

/* let myFirstPromise = new Promise((resolve, reject) => {
    setTimeout( function() {
        resolve("Success!")  
      }, 250) 
    }) 
    
    myFirstPromise.then((successMessage) => {
        console.log("Yay! " + successMessage) 
});

async function timeTest() {
    const timeoutPromise1 = timeoutPromise(3000);
    const timeoutPromise2 = timeoutPromise(3000);
    const timeoutPromise3 = timeoutPromise(3000);
  
    await timeoutPromise1;
    await timeoutPromise2;
    await timeoutPromise3;
  }
  function timeoutPromise(interval) {
    return new Promise((resolve, reject) => {
      setTimeout(function(){
        resolve("done");
      }, interval);
    });
  };
  let startTime = Date.now();
    timeTest().then(() => {
     let finishTime = Date.now();
    let timeTaken = finishTime - startTime;
    console.log("Time taken in milliseconds: " + timeTaken);
    })
 */

//-------------------------------------- Using of Js method Map, reduce, and filter--------------------------------------------

/* function asyncThing (value) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), 100);
  });
}

async function main () {
  return [1,2,3,4].reduce(async (acc, value) => {
    // console.log(acc);
    return await acc + await asyncThing(value);
  }, Promise.resolve(0));
}

main()
  .then(v => console.log(v))
  .catch(err => console.error(err)); */

// ----------------------------------------------Async AND Await-----------------------------------------------------------------

function makeReq(location){
  return new Promise((resolve,reject)=>{
    console.log('making request to '+location)
    if(location === 'Google'){
      resolve('Hiiiiii Its Google')
    }else{
      reject('Try Again')
    }
  })
}

function processReq(response){
  return new Promise((resolve,reject)=>{
    console.log('Response processing');
    
      resolve('extra Info   ' +response);
   
  })
}
//  this is using for response with help of Promise 
/* makeReq('Google').then(response=>{
  console.log('response received')
  return processReq(response)
}).then(processRes =>{
  console.log(processRes)
}).catch(err=>{
  console.log(err);
}) */

async function processAsync(){
  try {
    const response = await makeReq('Google')
    console.log('response received')
    const processRes = await processReq(response)
    console.log(processRes)
  }catch(err){
    console.log('Enter valid location')
  }
}
processAsync();