
// var tourApi = "http://localhost:3000/tour"

// function start(){
//     getTour(function(tours){
//         return tours;
//     }
//     );
// }

// start();

// function getTour(callback){
//     fetch(tourApi).then(function(response){
//         return response.json();
//     }).then(callback)
// }
var tourApi = "http://localhost:3000/tour";

function getdata() {
    return fetch(tourApi)
        .then(response => response.json())
        .catch(error => {
            console.error("Lỗi khi lấy dữ liệu tour:", error);
        });
}

export default getdata; // Xuất hàm để dùng trong `Tourlist`
