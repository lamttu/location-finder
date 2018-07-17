// Listen to the form's submit event
let zipForm  = document.querySelector("#zip-form");
zipForm.addEventListener("submit", getLocationInfo);

// Listen to delete event
document.querySelector("body").addEventListener("click", deleteLocationInfo);

function getLocationInfo(event){
    event.preventDefault();
    // Get the zipcode 
    let zipCode = document.querySelector("input[type=text]").value;
    // Fetch information from API
    fetch(`http://api.zippopotam.us/au/${zipCode}`)
    .then(response => {
        if(!response.ok){   // User enter invalid zipcode
            throw new Error("This zipcode is invalid");
        }
        showIcon("check");
        changeInputStyle("success");
        return response.json();
    })
    .then(data =>{
        let output = "";
        data.places.forEach(place =>{
            output +=
            `
            <article class="message is-primary">
                <div class="message-header">
                    <p>Location Information</p>
                    <button class="delete" aria-label="delete"></button>
                </div>
                <div class="message-body">
                    <ul>
                        <li><strong>Area: </strong>${place[`place name`]}</li>
                        <li><strong>State: </strong>${place[`state`]}</li>
                        <li><strong>Longitude: </strong>${place[`longitude`]}</li>
                        <li><strong>Latitude: </strong>${place[`latitude`]}</li>
                    </ul>
                </div>
            </article>
            `
        })

        document.querySelector("#output").innerHTML = output;
    })
    .catch((error) =>{
        showIcon("remove");
        changeInputStyle("danger");
        document.querySelector("#output").innerHTML = 
        `
        <article class="message is-danger">
            <div class="message-body">
                ${error}
            </div>
        </article>
        `
     }) ;
}

function showIcon(icon){
    // Hide both icons
    document.querySelector(".icon-check").style.display = "none";
    document.querySelector(".icon-remove").style.display = "none";
    // Display the passed in icon
    document.querySelector(`.icon-${icon}`).style.display = "inline-flex";
}
function changeInputStyle(result){
    document.querySelector("input[type=text]").classList.remove("is-success");
    document.querySelector("input[type=text]").classList.remove("is-danger");

    document.querySelector("input[type=text]").classList.add(`is-${result}`);
}

function deleteLocationInfo(event){
    let counter = document.querySelectorAll(".is-primary").length;
    if(event.target.className === "delete"){
        // event.target.parentNode.parentNode.remove();
        fadeOutAndRemove(event.target.parentNode.parentNode);
        counter--;
    }
    if(counter == 0){  //once user has closed all results, clear the input field and other styles
        document.querySelector("input[type=text]").value = "";
        document.querySelector(".icon-check").style.display = "none";
        document.querySelector("input[type=text]").classList.remove("is-success");
        document.querySelector("input[type=text]").focus();
    }
}

function fadeOutAndRemove(element){
	let opacity = 1;
	let timer = setInterval(function(){
		if(opacity < 0){
			clearInterval(timer);
            element.remove(); 
		}
		element.style.opacity = opacity;
		opacity -=  0.1;
    }, 50);
}