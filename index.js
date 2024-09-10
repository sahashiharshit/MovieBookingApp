const apiUrl =
  "https://crudcrud.com/api/c16cbaded1f748ea981fdfe4c30a7a0e/bookingData";

async function handleFormSubmit(event) {
  event.preventDefault();
  const userDetails = {
    username: event.target.username.value,
    seatnumber: event.target.seatnumber.value,
  };
  const data = await addPostData(userDetails, apiUrl);
  if(data === null){
    window.alert('Seat is already booked');
  }else{
    addDatatoScreen(data);
  }
  
}
function checkSeat(data,userDetails){
    for (let value of data) {
        console.log(userDetails.seatnumber,value.seatnumber)
        if (value.seatnumber === userDetails.seatnumber) {
          return true;
         
        } 
        return false;
      }
}


async function addPostData(userDetails, apiUrl) {
  const data = await getData();
  const checkSeatvalue = checkSeat(data,userDetails);
 
  if (checkSeatvalue) {
   
    return null;
  } else {
    return axios
      .post(apiUrl, userDetails)
      .then((result) => {
        return result.data;
      })
      .catch((error) => {
        return null;
      });
  }
}

async function addDatatoScreen(booking) {
  const bookingList = document.querySelector("#bookingList");

  const listItem = document.createElement("li");
  listItem.className = "list-group-item";
  listItem.setAttribute("data-id", booking._id);
  listItem.innerHTML = `${booking.username} : ${booking.seatnumber} 
    <button type="button" class="btn btn-secondary btn-lg">Edit</button>
    <button type="button" class="btn btn-danger btn-lg">Delete</button>`;
  bookingList.appendChild(listItem);

  document.getElementById("username").value = "";
  document.getElementById("seatnumber").value = "";
  const counter = await bookingCounter();
  const counterElemet = document.querySelector("#counter");
  counterElemet.innerHTML = `${counter.length}`;
}
function bookingCounter() {
  return axios
    .get(apiUrl)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return null;
    });
}

function deleteData(id) {
  axios
    .delete(`${apiUrl}/${id}`)
    .then(async (res) => {
      console.log("Data Deleted");
      const counter = await bookingCounter();
      const counterElemet = document.querySelector("#counter");
      counterElemet.innerHTML = `${counter.length}`;
    })
    .catch((error) => {
      console.log(error);
    });
}
function getData() {
  return axios
    .get(apiUrl)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return null;
    });
}
function getDataByID(id) {
  return axios
    .get(`${apiUrl}/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return null;
    });
}
async function updateDataList() {
  const bookingData = await getData();
  const bookingList = document.querySelector("#bookingList");

  bookingData.forEach((data) => {
    const listItem = document.createElement("li");
    listItem.className = "list-group-item";
    listItem.setAttribute("data-id", data._id);
    listItem.innerHTML = `${data.username} : ${data.seatnumber} 
    <button type="button" class="btn btn-secondary btn-lg">Edit</button>
    <button type="button" class="btn btn-danger btn-lg">Delete</button>`;
    bookingList.appendChild(listItem);
  });

  bookingList.addEventListener("click", async (event) => {
    if (event.target.classList.contains("btn-secondary")) {
      const bookingtoEdit = event.target.parentElement;
      const id = bookingtoEdit.getAttribute("data-id");
      bookingList.removeChild(bookingtoEdit);
      const bookingDetails = await getDataByID(id);
      document.getElementById("username").value = bookingDetails.username;
      document.getElementById("seatnumber").value = bookingDetails.seatnumber;
      deleteData(id);
    } else if (event.target.classList.contains("btn-danger")) {
      const bookingToDelete = event.target.parentElement;
      const id = bookingToDelete.getAttribute("data-id");
      bookingList.removeChild(bookingToDelete);
      deleteData(id);
    }
  });

  const counter = await bookingCounter();
  const counterElemet = document.querySelector("#counter");
  counterElemet.innerHTML = `${counter.length}`;

  const filter = document.querySelector("#findSlot");
  filter.addEventListener("keyup", (event) => {
    const bookingList = document.querySelectorAll(".list-group-item");
    console.log(bookingList);
    const filterText = filter.value.toString();
    bookingList.forEach((booking) => {
      const bookingText = booking.textContent;
      console.log(bookingText);
      if (bookingText.includes(filterText)) {
        booking.style.display = "";
      } else {
        booking.style.display = "none";
      }
    });
  });
}

window.onload = updateDataList;
