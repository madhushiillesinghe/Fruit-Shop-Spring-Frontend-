import { saveItem } from '../model/ItemModel.js';
import { getAllItems } from '../model/ItemModel.js';
import { deleteItem } from '../model/ItemModel.js';
import { updateItem } from '../model/ItemModel.js';


export let itemarray;

$(document).ready(function(){
    refresh();
});

document.querySelector('#ItemManage #ItemForm').addEventListener('submit', function(event){
    event.preventDefault();
});

var code  ;
var description;
var quantity;
var price;

$('#ItemManage .saveBtn').click(function(){
    
        code = $('#ItemManage .itemId').val();
        description = $('#ItemManage .itemName').val();
        quantity     = $('#ItemManage .itemQty').val();
        price  = $('#ItemManage .itemPrice').val();
    
        let item = {
            code : code,
            description : description,
            quantity : quantity,
            price : price,
        };

        if(validate(item)){
            saveItem(item);
            alert('Item Saved');
            refresh();
        }

        const itemJSON = JSON.stringify(item);
        console.log(itemJSON);
      
        const http = new XMLHttpRequest();
        http.onreadystatechange = () => {
          if (http.readyState == 4) {
            if (http.status == 200) {
              var responseTextJSON = JSON.stringify(http.responseText);
              console.log(responseTextJSON);
            } else {
              console.error("Failed");
              console.error("Status" + http.status);
              console.error("Ready State" + http.readyState);
            }
          } else {
            console.error("Ready State" + http.readyState);
          }
        };
        http.open("POST", "http://localhost:8080/fruitShop/api/v1/items", true);
        http.setRequestHeader("Content-Type", "application/json");
        http.send(itemJSON);
});

function validate(item){
        
        let valid = true;
        
        if((/^I0[0-9]+$/).test(item.code)){
            $('#ItemManage .invalidCode').text('');
            valid = true;
        }
        else{
            $('#ItemManage .invalidCode').text('Invalid Item Id');
            valid = false;
        }
        
        if((/^(?:[A-Z][a-z]*)(?: [A-Z][a-z]*)*$/).test(item.description)){
            $('#ItemManage .invalidName').text('');
                
            if(valid){
                valid = true;
            }
        }
        
        else{
            $('#ItemManage .invalidName').text('Invalid Item Name');
            valid = false;
        }

        if(item.quantity != null && item.quantity > 0){
            $('#ItemManage .invalidQty').text('');
            if(valid){
                valid = true;
            }
        }
        else{
            $('#ItemManage .invalidQty').text('Invalid Item Quantity');
            valid = false;
        }

        if(item.price != null && item.price > 0){
            $('#ItemManage .invalidPrice').text('');
            if(valid){
                valid = true;
            }
        }

        else{
            $('#ItemManage .invalidPrice').text('Invalid Item Price');
            valid = false;
        }

        let items = getAllItems();

        for(let i = 0; i < items.length; i++){
            if(items[i].itemId === item.itemId){
                $('#ItemManage .invalidCode').text('Item Id already exists');
                valid = false;
                return valid;
            }
        }

        return valid;
        
}

function extractNumber(id){
    var match = id.match(/I0(\d+)/);
    if(match && match.length > 1){
        return match[1];
    }
    return null;
}


function refresh(){
    $('#ItemManage .itemId').val(generateId());
    $('#ItemManage .itemName').val('');
    $('#ItemManage .itemQty').val('');
    $('#ItemManage .itemPrice').val('');
    $("#ItemManage .invalidCode").text("");
    $("#ItemManage .invalidName").text("");
    $("#ItemManage .invalidQty").text("");

    reloadTable();
}

function generateId(){
    const http = new XMLHttpRequest();
  http.onreadystatechange = () => {
    if (http.readyState == 4) {
      if (http.status == 200) {
        const items = JSON.parse(http.responseText);
        console.log("Itemr Data Array:", items);
        itemarray = getAllItems();
        itemarray = items;
        if (!items || items.length === 0) {
          
          console.log("this")
         // return "C01";
         $('#ItemManage .itemId').val('I01');

        } else {
          let lastItem = items[items.length - 1];
          let id = lastItem && lastItem.code ? lastItem.code : "I00";
          let number = extractNumber(id);
          number++;
          console.log("that")
          $('#ItemManage .itemId').val('I0' + number);
        // return "C0" + number;

        }
        
      } else {
        console.error("Failed");
        console.error("Status" + http.status);
        console.error("Ready State" + http.readyState);
      }
    } else {
      console.error("Ready State" + http.readyState);
    }
  };
  http.open(
    "GET",
    "http://localhost:8080/fruitShop/api/v1/items/allitems",
    true
  );
  http.setRequestHeader("Content-Type", "application/json");

  // Send the GET request
  http.send();
}

function loadTable(item){
  //  let items = getAllItems();
        $('#ItemManage .tableRow').append(
            '<tr> ' +
                '<td>' + item.code + '</td>' +
                '<td>' + item.description + '</td>' +
                '<td>' + item.quantity + '</td>' +
                '<td>' + item.price + '</td>' +
            '</tr>' 
        );
    }

function reloadTable() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
      if (http.readyState == 4) {
        if (http.status == 200) {
          const items = JSON.parse(http.responseText);
          console.log("Item Data Array:", items);
          itemarray = getAllItems();
          itemarray = items;
          console.log("hii", itemarray);
          
          $('#ItemManage .tableRow').empty();
          items.forEach((c) => {
            loadTable(c);
          });
        } else {
          console.error("Failed");
          console.error("Status" + http.status);
          console.error("Ready State" + http.readyState);
        }
      } else {
        console.error("Ready State" + http.readyState);
      }
    };
    http.open(
      "GET",
      "http://localhost:8080/fruitShop/api/v1/items/allitems",
      true
    );
    http.setRequestHeader("Content-Type", "application/json");
  
    // Send the GET request
    http.send();
  }

$('#ItemManage .tableRow').on('click', 'tr', function(){
    let id = $(this).children('td:eq(0)').text();
    let name = $(this).children('td:eq(1)').text();
    let qty = $(this).children('td:eq(2)').text();
    let price = $(this).children('td:eq(3)').text();

    $('#ItemManage .itemId').val(id);
    $('#ItemManage .itemName').val(name);
    $('#ItemManage .itemQty').val(qty);
    $('#ItemManage .itemPrice').val(price);
});

$('#ItemManage .deleteBtn').click(function(){
    let id = $('#ItemManage .itemId').val();
   // let items = getAllItems();
    let item = itemarray.findIndex((item) => item.code === id);
    if(item >= 0){
        deleteItem(item);
        alert('Item Deleted');
        refresh();
    }
    else{
        $('#ItemManage .invalidCode').text('Item Id does not exist');
    }
    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
      if (http.readyState == 4) {
        if (http.status == 204) {
          var responseTextJSON = JSON.stringify(http.responseText);
          console.log(responseTextJSON);
        } else {
          console.error("Failed");
          console.error("Status" + http.status);
          console.error("Ready State" + http.readyState);
        }
      } else {
        console.error("Ready State" + http.readyState);
      }
    };
    http.open(
      "DELETE",
      `http://localhost:8080/fruitShop/api/v1/items/`+id,
      true
    );
    http.send();

});

$('#ItemManage .updateBtn').click(function(){
    let item = {
        code : 'I00',
        description : $('#ItemManage .itemName').val(),
        quantity : $('#ItemManage .itemQty').val(),
        price: $('#ItemManage .itemPrice').val(),
    };

    let valid = validate(item);

    item.code = $('#ItemManage .itemId').val();
    let code=item.code;

    if(valid){
       // let items = getAllItems();
        let index = itemarray.findIndex((i) => i.code === item.code);
        updateItem( item);
        alert('Item Updated');
        refresh();
    }

    const updateItemJSON = JSON.stringify(item);

  const http = new XMLHttpRequest();
  http.onreadystatechange = () => {
    if (http.readyState == 4) {
      if (http.status == 200) {
        var responseTextJSON = JSON.stringify(http.responseText);
        console.log(responseTextJSON);
      } else {
        console.error("Failed");
        console.error("Status" + http.status);
        console.error("Ready State" + http.readyState);
      }
    } else {
      console.error("Ready State" + http.readyState);
    }
  };
  http.open(
    "PUT",
    `http://localhost:8080/fruitShop/api/v1/items/`+code,
    true
  );
  http.setRequestHeader("Content-Type", "application/json");
  http.send(updateItemJSON);
});

$('#ItemManage .clearBtn').click(function(){
    refresh();
});

$('#ItemManage .searchBtn').click(function(){
    let id = $('#ItemManage .itemId').val();
    let items = getAllItems();
    let item = itemarray.find(item => item.code === id);
    if(item){
        $('#ItemManage .itemName').val(item.description);
        $('#ItemManage .itemQty').val(item.quantity);
        $('#ItemManage .itemPrice').val(item.price);
    }
    else{
        $('#ItemManage .invalidCode').text('Item Id does not exist');
    }
});

