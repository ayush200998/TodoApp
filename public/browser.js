// rendering from client side .
     
    let ourHTML = items.map(function(item){
        return itemTemplate(item)
    }).join('')

    document.getElementById("create-list").insertAdjacentHTML("beforeend" , ourHTML)



// Create list
    function itemTemplate(item){
        return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
        <span class="item-text">${item.text}</span>
        <div>
          <button data-id=${item._id} class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
          <button data-id=${item._id} class="delete-me btn btn-danger btn-sm">Delete</button>
        </div>
      </li>`
    }

    let form = document.getElementById("create-form")
    let inputField = document.getElementById("create-input")

    form.addEventListener("submit" , function(event){
        event.preventDefault()
        axios.post("/create-item" , {text : inputField.value}).then( function (response){
            // Crreating and passing it Node server .
            let list = document.getElementById("create-list")
            list.insertAdjacentHTML("beforeend" , itemTemplate(response.data))
            
        }).catch( function() {
            console.log("try again Later . ")
        })
    })


document.addEventListener("click" , function(event){

    //Deleting The Form
    if(event.target.classList.contains("delete-me")){
        if(confirm("Are You sure you wan tot delete this Item ?")){
            axios.post("/delete-item" , {id : event.target.getAttribute("data-id")}).then( function (){
                event.target.parentElement.parentElement.remove()
            }).catch( function() {
                console.log("try again Later . ")
            })
        }
    }


    // Updating The Form
    if(event.target.classList.contains("edit-me")){
        let input = prompt("Enter the new value" , event.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
        
            if(input){
            axios.post("/update-item" , {text : input, id : event.target.getAttribute("data-id")}).then( function (){
                event.target.parentElement.parentElement.querySelector(".item-text").innerHTML = input 
            }).catch( function() {
                console.log("try again Later . ")
            })
            }
        }
        


})