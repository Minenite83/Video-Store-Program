//id of webpage being shown currently
let pageI = "main-menu";
//all info
window.info = {
  //customer info
  cus:[],
  //video info
  vid:[],
  //all table headers
  head:{
    //customer table headers
    cus:["ID","First Name","Last Name","Telephone Number","Address","State","Zip Code"],
    //video table headers
    vid:["ID","Title","Genre","Cost","Quantity","Image"]
  }
};
//example placeholder info
for(let i = 1; i <= 30; i++){
  info.cus.push({id:(i+"").padStart(2,"0"),fname:"John",lname:"Doe",tel:"111-111-1111",adrs:"Blank",st:"XX",zc:"11111",disabled:false});
  info.vid.push({id:(i+"").padStart(2,"0"),til:"Blank",gnr:"Blank",cost:"0.5",qnty:"0",img:"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/DVD-Video_bottom-side.jpg/1200px-DVD-Video_bottom-side.jpg",disabled:false});
}
//all buttons that change pages
const pageBtns = document.getElementsByClassName("pbtn");
//all forms
const forms = document.forms;
//all id select buttons
const idSelBtns = document.getElementsByClassName("id-sel-btn")
//all id inputs
const idInps = document.querySelectorAll("input[name=id]")
//all image inputs
const imgInps = document.querySelectorAll("input[type=file]");
//send info to tables
const sendI = function(){
  //which info
  const wInfo = this.classList[0].replace(/-list/,"");
  //new code set to the starting of the headers
  let nCode = "<thead>";
  //creates table headers
  for(const head of info.head[wInfo]){
    nCode+=`<th>${head}</th>`;
  }
  //ends headers and starts body
  nCode+="</thead><tbody>";
  //loops through each customer's info or video's info to give that to nCode
  for(const cInfo of info[wInfo]){
    //if the customer or video is disabled skip it
    if(cInfo.disabled){
      continue;
    }
    //starting new row and adding the id
    nCode+=`<tr id="${pageI+cInfo.id}">`;
    //loops through each value type for customers or videos
    for(const type in cInfo){
      //the current value
      let val = cInfo[type];
      //checks the value type
      switch(type){
        //if it's cost
        case "cost":
          //makes val in USD format
          val = Number(val).toLocaleString("en-US", {style:"currency", currency:"USD"});
          break;
        //if it's quantity
        case "qnty":
          //puts commas in val
          val = Number(val).toLocaleString();
          break;
        //if it's image
        case "img":
          //makes val get displayed as an image
          val = `<img src="${val}">`;
          break;
      }
      //if the type isn't disabled
      if(type !== "disabled"){
        //adds val to nCode 
        nCode+=`<td>${val}</td>`;
      }
    }
    //ends that row
    nCode+="</tr>";
  }
  //ends the body of the table
  nCode+="</tbody>";
  //gives nCode to the table
  this.innerHTML = nCode;
}
//function that changes the page with parameters (unused event object, new page's id)
const pageChg = function(e,nPageI = this.classList[1].replace(/-btn/,"")){
  //hides the current page
  document.getElementById(pageI).classList.remove("show");
  //creates a variable for the new page and then shows it
  const nPage = document.getElementById(nPageI);
  nPage.classList.add("show");
  //sets the current page's id to the new page's id
  pageI = nPageI;
  //checks if there is a table in the new page
  switch(nPage.innerHTML.includes("</table>")){
    //if so
    case true:
      //the table
      const table = nPage.getElementsByTagName("table")[0];
      //sends customer or video info to it
      sendI.apply(table);
      break;
  }
};
//makes all page buttons call pageChg when clicked
for(const pBtn of pageBtns){
  pBtn.addEventListener("click",pageChg);
}
//function that changes the info with parameters (event object)
const infoChg = function(e){
  //prevents the form from submitting normally
  e.preventDefault();
  //the types the form falls under
  const types = this.name.split("-");
  //checks what the change type is
  switch(types[1]){
    //if it's add
    case "add":
      //creates a new customer or video
      info[types[0]].push({i:info[types[0]].length+1,disabled:false});
      //loops through the inputs in the form
      for(const inp of this.getElementsByTagName("input")){
        //gets info from the inputs to set values for the new customer or video
        info[types[0]][info[types[0]].length-1][inp.name] = (inp.name === "img" ? inp.cValue : inp.value);
      }
      break;
    //if it's edit
    case "edit":
      //loops through the inputs in the form
      for(const inp of this.getElementsByTagName("input")){
        //checks the name of the current input
        switch(inp.name){
          case "id":break;
          //if it isn't id
          default:
            //gets info from the inputs to set values for the selected customer or video
            info[types[0]][this.id.cValue-1][inp.name] = (inp.name === "img" ? inp.cValue : inp.value);
            //disables the inputs
            inp.disabled = true;
            break;
        }
      }
      break;
    //if it's delete
    case "del":
      //disables the selected customer or video
      info[types[0]][Number(this.id.sValue)-1].disabled = true;
      break;
  }
  //resets the form
  this.reset()
  //checks if the form has an image
  switch(this.getElementsByTagName("img").length){
    //if so
    case 1:
      //clears the image
      this.getElementsByTagName("img")[0].src = "";
      //clears the display for the file name
      this.getElementsByTagName("span")[0].textContent = "none";
      break;
  }
  //changes the page to the main menu
  pageChg(0,"main-menu");
};
//makes all forms call infoChg when submitted
for(const form of forms){
  form.addEventListener("submit",infoChg);
}





//function that makes sure that the id is selected before any changes are made
const idInpChg = function(e){
  //checks the id input's value
  switch(this.value){
    //if it matches the selected value
    case this.sValue:
      //removes all errors
      this.setCustomValidity("");
      break;
    //if it doesn't
    default:
      //sends the error that it is not selected
      this.setCustomValidity("Not Selected");
      break;
  }
}
//makes all id input's call idInpChg when a change is made to the input's value
for(const idInp of idInps){
  idInp.addEventListener("input",idInpChg);
}
//function that selects the id
const idSelect = function(){
  //th id input
  const idInp = this.previousElementSibling.children[0];
  //if the input's value is valid
  let valid = false;
  for(const cusInfo of info.cus){
    if(cusInfo.id === idInp.value){
      valid = !cusInfo.disabled;
      break;
    }
  }
  //checks if the value is valid
  switch(valid){
    //if it isn't
    case false:
      //gives the error that the id doesn't exist
      idInp.setCustomValidity("ID doesn't exist.");
      //shows that error
      idInp.form.requestSubmit();
      break;
    //if it is
    case true:
      //
      idInp.sValue = idInp.value;
      idInp.setCustomValidity("");
      //the types the form of the id input falls under
      const types = idInp.form.name.split("-");
      //the selected customer's or video's row
      const sRow = document.getElementById(types[1]+"-"+types[0]+idInp.value);
      //puts the selected row in view
      sRow.scrollIntoView();
      //background color for the selected row
      let rowC = "";
      //checks what the change type is
      switch(types[1]){
        //if it's edit
        case "edit":
          //changes the other inputs in that form
          for(const cInp of this.form.getElementsByTagName("input")){
            //checks the name of the current input
            switch(cInp.name){
              case "id":break;
              //if it isn't id
              default:
                //sets the other inputs' values to the current values for the selected customer or video
                cInp[cInp.name === "img" ? "cValue" : "value"] = info[types[0]][this.value-1][cInp.name];
                //enables those inputs
                cInp.removeAttribute("disabled");
                break;
            }
          }
          //checks what the info type is
          switch(types[0]){
            //if it's vid
            case "vid":
              //sets the source of the image to the image input's value
              this.form.getElementsByTagName("img")[0].src = this.form.img.cValue;
              break;
          }
          //sets rowC to light blue
          rowC = "#61dfff";
          break;
        //if it's delete
        case "del":
          //sets rowC to light red
          rowC = "#ff6060";
          break;
      }
      //clears the background of all the rows in the table
      for(const row of document.getElementById(pageI).querySelectorAll("tr:has(td)")){
        row.style.backgroundColor = "transparent";
      }
      //makes the selected row have a background based on rowC
      sRow.style.backgroundColor = rowC;
      break;
  }
};
//makes all id select buttons call idSelect when they are clicked
for(const idSelBtn of idSelBtns){
  idSelBtn.addEventListener("click",idSelect);
}












//function that displays the image the selected image
const imgDisp = function(){
  //sets the text of the display for file name to the file's name
  this.form.getElementsByTagName("span")[0].textContent = this.files[0].name;
  //the image used to display the file
  const img = this.form.getElementsByTagName("img")[0];
  //checks if the file is an image
  switch(this.files[0].type.startsWith("image")){
    //if not
    case false:
      //gives an error saying "Not an Image"
      this.setCustomValidity("Not an Image");
      //clears the image
      img.src = "";
      break;
    //if so
    case true:
      //removes the error (if it's there)
      this.setCustomValidity("");
      //finds the base64 for the image
      const reader = new FileReader();
      reader.addEventListener("load",function(){
          const base64 = reader.result;
          //new variable for the input's value set to the base64
          this.cValue = base64;
          //sets the source of the image to the base64
          img.src = base64;
      }.bind(this));
      reader.readAsDataURL(this.files[0]);
      break;
  }
}
//makes all image inputs call imgDisp when their value is changed
for(const imgInp of imgInps){
  imgInp.addEventListener("change",imgDisp);
}















//pageChg(0,"del-cus");
