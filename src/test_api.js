// var postAPI = 'https://jsonplaceholder.typicode.com/posts'

// fetch(postAPI)
//     .then(function(response) {
//         return response.json()
//     })
//     .then(function(posts) {
//         console.log(posts)
//     });


// const users = [
//     { id: 1, name: "Alice", email: "alice@example.com" },
//     { id: 2, name: "Bob", email: "bob@example.com" },
//     { id: 3, name: "Charlie", email: "charlie@example.com" }
//   ];
  
//   const comments = [
//     { id: 1, userId: 2, text: "This is Alice's first comment." },
//     { id: 2, userId: 1, text: "Bob here, leaving a comment!" },
//     { id: 3, userId: 1, text: "Alice again with another comment." },
//     { id: 4, userId: 3, text: "Charlie joining the conversation." },
//     { id: 5, userId: 2, text: "Bob has something more to say." }
//   ];

// function getComments(){
//     return new Promise(function(resolve){
//         setTimeout(function(){
//             resolve(comments);
//         },1000);
//     });
// }

// getComments().then(function(comments){
//     console.log(comments);
// });


var promise = new Promise(function(resolve, reject) {
        //Logic
        //Thành công : resolve
        //Thất bại : reject
        resolve(); 
});

promise.then(function() {
    console.log('Success');
    })
    .catch(function() {
        console.log('Fail');
    })
    .finally(function() {
        console.log('Done');
    });

// promise.then(function() {
//         return 1;
//     })
//     .then(function(data){
//         console.log(data);
//         return 2;
//     })
//     .then(function(data){
//         console.log(data);
//         return 3;
//     })
//     .then(function(data){
//         console.log(data);
//     })
//     .catch(function() {
//         console.log('Fail');
//     })
//     .finally(function() {
//         console.log('Done');
//     });

promise.then(function() {
    return new Promise(function(resolve){
        setTimeout(resolve,3000);
    })
    .then(function(data){
        console.log(data);
        return data;
    })
    .catch(function() {
        console.log('Fail');
    })
    .finally(function() {
        console.log('Done');
    })});
