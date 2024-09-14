//server base domain url 
const domainUrl = "http://localhost:3000";  // if local test, pls use this 

//==================================index.html==================================//

var debug = true;
var authenticated = false;


$(document).ready(function () {
	
/**
	----------------------Event handler to process login request----------------------
**/
   
	$('#loginButton').click(function () {

		localStorage.removeItem("inputData");

		$("#loginForm").submit();

		if (localStorage.inputData != null) {

			var inputData = JSON.parse(localStorage.getItem("inputData"));

			$.post(domainUrl + "/verifyUser", inputData,  function(data, status){
					if (debug) alert("Data received: " + JSON.stringify(data));
					if (debug) alert("\nStatus: " + status);
				
				if (data.length > 0) {
					alert("Login success");
					authenticated = true;
					localStorage.setItem("userInfo", JSON.stringify(data[0]));	
					$.mobile.changePage("#homePage");
				} 
				else {
					alert("Login failed");
				}

				$("#loginForm").trigger('reset');	
			})
		}
		
	})


	$("#loginForm").validate({ // JQuery validation plugin
		focusInvalid: false,  
		onkeyup: false,
		submitHandler: function (form) {   
			authenticated = false;
			
			var formData =$(form).serializeArray();
			var inputData = {};
			formData.forEach(function(data){
				inputData[data.name] = data.value;
			})

			localStorage.setItem("inputData", JSON.stringify(inputData));		

		},
		/* Validation rules */
		rules: {
			email: {
				required: true,
				email: true
			},
			password: {
				required: true,
				rangelength: [3, 10]
			}
		},
		/* Validation message */
		messages: {
			email: {
				required: "please enter your email",
				email: "The email format is incorrect  "
			},
			password: {
				required: "It cannot be empty",
				rangelength: $.validator.format("Minimum Password Length:{0}, Maximum Password Length:{1}。")

			}
		},
	});
	/**
	--------------------------end--------------------------
	**/	
	/** 
	-------------------------Event handler to process Sign up request-------------------------
	**/	
	

		$('#submitButton').click(function(event) {
			
			event.preventDefault();
	
			// Validate the form
			if ($("#signupForm").valid()) {
				// Capture form data
				var userData = {
					email: $("#userEmail").val(),
					password: $("#userPass").val(),
					firstName: $("#firstName").val(),
					lastName: $("#lastName").val(),
					state: $("#state").val(),
					phone: $("#phone").val(),
					address: $("#address").val(),
					postcode: $("#postcode").val()
				};
	
				// Send user data to server via POST request
				$.post(domainUrl+"/signup", userData, function(data, status){
					if (status === "success") {
						alert("User registered successfully");
						 // Store user info in localStorage (as we do after login)
						 localStorage.setItem("userInfo", JSON.stringify({
							email: userData.email,
							firstName: userData.firstName,
							lastName: userData.lastName
						}));
						// Redirect to home page after successful signup
						$.mobile.changePage("#homePage");
					} else {
						alert("Error occurred during signup. Please try again.");
					}
					$("#signupForm").trigger('reset');	
				});
			}
		});
	
		$('#clearButton').click(function(event) {
			event.preventDefault(); 
	
			// Clear the form fields
			$("#signupForm")[0].reset();
		});
	
		// Validation rules and messages for signup form
		$("#signupForm").validate({
			focusInvalid: false, 
			onkeyup: false,
			submitHandler: function (form) {   
				var formData = $(form).serializeArray();
				var inputData = {};
	
				formData.forEach(function(data){
					inputData[data.name] = data.value;
				});
	
				localStorage.setItem("inputData", JSON.stringify(inputData));                
			},
			rules: {
				firstName: {
					required: true,
					rangelength: [1, 15],
					validateName: true
				},
				lastName: {
					required: true,
					rangelength: [1, 15],
					validateName: true
				},
				phone: {
					required: true,
					mobiletxt: true
				},
				address: {
					required: true,
					rangelength: [1, 25]
				},
				postcode: {
					required: true,
					posttxt: true
				}
			},
			messages: {
				firstName: {
					required: "Please enter your firstname",
					rangelength: $.validator.format("Contains a maximum of {1} characters")
				},
				lastName: {
					required: "Please enter your lastname",
					rangelength: $.validator.format("Contains a maximum of {1} characters")
				},
				phone: {
					required: "Phone number required"
				},
				address: {
					required: "Delivery address required",
					rangelength: $.validator.format("Contains a maximum of {1} characters")
				},
				postcode: {
					required: "Postcode required"
				}
			}
		});
	
	
	
	

/**
	------------------------------End-------------------
	**/
	
	/**
	--------------------Event handler to process order submission----------------------
	**/

	$('#confirmOrderButton').on('click', function () {
		
		localStorage.removeItem("inputData");

		$("#orderForm").submit();

		if (localStorage.orderInfo != null) {
		
			var orderInfo = JSON.parse(localStorage.getItem("inputData"));

			orderInfo.itemName = localStorage.getItem("itemName");
			orderInfo.itemPrice = localStorage.getItem("itemPrice");
			orderInfo.itemImage = localStorage.getItem("itemImage");
			
			var userInfo = JSON.parse(localStorage.getItem("userInfo"));
			
			if (debug) alert("Customer: " + JSON.stringify(userInfo));

			orderInfo.customerEmail = userInfo.email;

			orderInfo.orderNo = Math.trunc(Math.random()*900000 + 100000);

			localStorage.setItem("orderInfo", JSON.stringify(orderInfo));
			

			$.post(domainUrl + "/postOrderData", orderInfo, function(data, status){
				if (debug) alert("Data sent: " + JSON.stringify(data));
				if (debug) alert("\nStatus: " + status);
			
				//clear form data 
				$("#orderForm").trigger('reset');
				
				$.mobile.changePage("#orderConfirmationPage");
	
			});		
		}

	})
/**
	--------------------Event handler to perform initialisation before the Login page is displayed--------------------
	**/


	$(document).on("pagebeforeshow", "#loginPage", function() {
	
		localStorage.removeItem("userInfo");
	
		authenticated = false;
	});  
	
	/**
	--------------------------end--------------------------
	**/	
/**
	------------Event handler to respond to selection of gift category-------------------
	**/
	$('#itemList li').click(function () {
		
		var itemName = $(this).find('#itemName').html();
		var itemPrice = $(this).find('#itemPrice').html();
		var itemImage = $(this).find('#itemImage').attr('src');
		
		localStorage.setItem("itemName", itemName);
		localStorage.setItem("itemPrice", itemPrice);
		localStorage.setItem("itemImage", itemImage);

	}) 

	/**
	--------------------------end--------------------------
	**/	
	$("#orderForm").validate({  // JQuery validation plugin
		focusInvalid: false, 
		onkeyup: false,
		submitHandler: function (form) {   
			
			var formData =$(form).serializeArray();
			var inputData = {};

			formData.forEach(function(data){
				inputData[data.name] = data.value;
			});
			
			if (debug) alert(JSON.stringify(inputData));

			localStorage.setItem("inputData", JSON.stringify(inputData));
					
		},
		
		/* validation rules */
		
		rules: {
			firstName: {
				required: true,
				rangelength: [1, 15],
				validateName: true
			},
			lastName: {
				required: true,
				rangelength: [1, 15],
				validateName: true
			},
			phoneNumber: {
				required: true,
				mobiletxt: true
			},
			address: {
				required: true,
				rangelength: [1, 25]
			},
			postcode: {
				required: true,
				posttxt: true
			},/*
			oDate: {
				required: true,
				datetime: true
			},*/
		},
		/* Validation Message */

		messages: {
			firstName: {
				required: "Please enter your firstname",
				rangelength: $.validator.format("Contains a maximum of{1}characters"),

			},
			lastName: {
				required: "Please enter your lastname",
				rangelength: $.validator.format("Contains a maximum of{1}characters"),
			},
			phoneNumber: {
				required: "Phone number required",
			},
			address: {
				required: "Delivery address required",
				rangelength: $.validator.format("Contains a maximum of{1}characters"),
			},
			postcode: {
				required: "Postcode required",

			},/*
			date2: {
				required: "required",
			},*/
		}
	});

	/**
	--------------------------end--------------------------
	**/


	/**
	--------------------Event handler to perform initialisation before the Login page is displayed--------------------
	**/

	$(document).on("pagebeforeshow", "#loginPage", function() {
	
		localStorage.removeItem("userInfo");
		
		authenticated = false;
	
	});  
	
	/**
	--------------------------end--------------------------
	**/	


	/**
	--------------------Event handler to populate the Fill Order page before it is displayed---------------------
	**/

	
	$(document).on("pagecreate", "#fillOrderPage", function() {
		
		$("#itemSelected").html(localStorage.getItem("itemName"));
		$("#priceSelected").html(localStorage.getItem("itemPrice"));
		$("#imageSelected").attr('src', localStorage.getItem("itemImage"));
	
	});  
	
	/**
	--------------------------end--------------------------
	**/	

	/**
	--------------------Event handler to populate the Order Confirmation page before it is displayed---------------------
	**/
	 
	$(document).on("pagebeforeshow", "#orderConfirmationPage", function() {
		
		$('#orderInfo').html("");

		if (localStorage.orderInfo != null) {
	
			var orderInfo = JSON.parse(localStorage.getItem("orderInfo"));
	
			$('#orderInfo').append(`<br><table><tbody>`);
			$('#orderInfo').append(`<tr><td>Order no: </td><td><span class=\"fcolor\"> ${orderInfo.orderNo} </span></td></tr>`);	
			$('#orderInfo').append(`<tr><td>Customer: </td><td><span class=\"fcolor\"> ${orderInfo.customerEmail} </span></td></tr>`);	
			$('#orderInfo').append(`<tr><td>Item: </td><td><span class=\"fcolor\"> ${orderInfo.itemName}  </span></td></tr>`);	
			$('#orderInfo').append(`<tr><td>Price: </td><td><span class=\"fcolor\"> ${orderInfo.itemPrice} </span></td></tr>`);
			$('#orderInfo').append(`<tr><td>Recipient: </td><td><span class=\"fcolor\"> ${orderInfo.firstName} ${orderInfo.lastName}</span></td></tr>`);
			$('#orderInfo').append(`<tr><td>Phone number: </td><td><span class=\"fcolor\"> ${orderInfo.phoneNumber} </span></td></tr>`);
			$('#orderInfo').append(`<tr><td>Address: </td><td><span class=\"fcolor\"> ${orderInfo.address} ${orderInfo.postcode} </span></td></tr>`);
			$('#orderInfo').append(`<tr><td>Dispatch date: </td><td><span class=\"fcolor\"> ${orderInfo.date} </span></td></tr>`);
			$('#orderInfo').append(`</tbody></table><br>`);
		}
		else {
			$('#orderInfo').append('<h3>There is no order to display<h3>');
		}
	});  

	/**
	--------------------------end--------------------------
	**/	
	/**
--------------------Event handler to populate the Order List page before it is displayed---------------------
**/

$(document).on("pagebeforeshow", "#orderListPage", function() {
    $('#orderList').html("");

    var userInfo = JSON.parse(localStorage.getItem("userInfo"));

    // Check if user info exists (user is logged in)
    if (userInfo && userInfo.email) {
        // Send a POST request to the server to get past orders for the logged-in user
        $.ajax({
            url: "http://localhost:3000/getUserOrders", // Server endpoint for orders
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ email: userInfo.email }),
            success: function(orders) {
                if (orders.length > 0) {
                    $('#orderList').append('<br><table><tbody>');
                    orders.forEach(function(order) {
                        $('#orderList').append('<tr><td>Order no: </td><td><span class="fcolor">' + order.orderNo + '</span></td></tr>');   
						$('#orderList').append('<tr><td>Customer: </td><td><span class="fcolor">' + order.customerEmail + '</span></td></tr>');
                        $('#orderList').append('<tr><td>Item: </td><td><span class="fcolor">' + order.itemName + '</span></td></tr>');    
                        $('#orderList').append('<tr><td>Price: </td><td><span class="fcolor">' + order.itemPrice + '</span></td></tr>');
                        $('#orderList').append('<tr><td>Recipient: </td><td><span class="fcolor">' + order.firstName + ' ' + order.lastName + '</span></td></tr>');
                        $('#orderList').append('<tr><td>Phone number: </td><td><span class="fcolor">' + order.phoneNumber + '</span></td></tr>');
                        $('#orderList').append('<tr><td>Address: </td><td><span class="fcolor">' + order.address + ' ' + order.postcode + '</span></td></tr>');
                        $('#orderList').append('<tr><td>Dispatch date: </td><td><span class="fcolor">' + order.date + '</span></td></tr>');
                        
                        // Add space after each order
                        $('#orderList').append('<tr><td colspan="2" style="padding-bottom: 30px;"></td></tr>');
                    });
                    $('#orderList').append('</tbody></table><br>');
                } else {
                    $('#orderList').append('<h3>No orders found<h3>');
                }
            },
            error: function(err) {
                console.log("Error retrieving orders: ", err);
                $('#orderList').append('<h3>No orders found<h3>');
            }
        });
    } else {
        $('#orderList').append('<h3>No user logged in<h3>');
    }
});

/**
--------------------------end--------------------------
**/
$(document).on("pagebeforeshow", "#deleteOrdersPage", function() {
    $('#deleteOrderList').html("");

    var userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo && userInfo.email) {
        // Fetch user's orders to display on the Delete Orders page
        $.ajax({
            url: "http://localhost:3000/getUserOrders", // Existing endpoint for fetching user orders
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ email: userInfo.email }),
            success: function(orders) {
                if (orders.length > 0) {
                    $('#deleteOrderList').append('<br><table><tbody>');
                    orders.forEach(function(order, index) {
                        // Display the same details as the order list page with a checkbox below each order
                        $('#deleteOrderList').append(`
                            <tr><td>Order no: </td><td><span class="fcolor">${order.orderNo}</span></td></tr>
                            <tr><td>Customer: </td><td><span class="fcolor">${order.customerEmail}</span></td></tr>
                            <tr><td>Item: </td><td><span class="fcolor">${order.itemName}</span></td></tr>
                            <tr><td>Price: </td><td><span class="fcolor">${order.itemPrice}</span></td></tr>
                            <tr><td>Recipient: </td><td><span class="fcolor">${order.firstName} ${order.lastName}</span></td></tr>
                            <tr><td>Phone number: </td><td><span class="fcolor">${order.phoneNumber}</span></td></tr>
                            <tr><td>Address: </td><td><span class="fcolor">${order.address} ${order.postcode}</span></td></tr>
                            <tr><td>Dispatch date: </td><td><span class="fcolor">${order.date}</span></td></tr>
                            <tr><td colspan="2" style="padding-bottom: 10px;"></td></tr>
                            <!-- Checkbox for selecting orders to delete -->
                            <tr>
								<td><span>Tick this box to delete</span></td>
                                <td><input type="checkbox" class="orderCheckbox" data-order-id="${order._id}"></td>
                                
                            </tr>
                            <tr><td colspan="2" style="padding-bottom: 30px;"></td></tr>
                        `);
                    });
                    $('#deleteOrderList').append('</tbody></table><br>');
                } else {
                    $('#deleteOrderList').append('<h3>No orders found<h3>');
                }
            },
            error: function(err) {
                console.log("Error retrieving orders: ", err);
                $('#deleteOrderList').append('<h3>No orders found<h3>');
            }
        });
    } else {
        $('#deleteOrderList').append('<h3>No user logged in<h3>');
    }
});

// Handle Delete Button click
$('#deleteButton').click(function() {
    var selectedOrderIds = [];
    
    // Collect selected order IDs
    $('.orderCheckbox:checked').each(function() {
        selectedOrderIds.push($(this).data('order-id'));
    });

    if (selectedOrderIds.length > 0) {
        // Send a DELETE request to the server with the selected order IDs
        $.ajax({
            url: domainUrl+"/deleteOrders", // Server endpoint for deleting orders
            method: "DELETE",
            contentType: "application/json",
            data: JSON.stringify({ orderIds: selectedOrderIds }),
            success: function(response) {
                alert(`${response.deletedCount} orders have been deleted.`);
                localStorage.setItem('deletedCount', response.deletedCount); // Store the deleted count in localStorage
                // Redirect to confirmation page
                $.mobile.changePage("#deleteConfirmationPage");
			//	location.reload(); // Refresh the page after deletion
            },
            error: function(err) {
                console.log("Error deleting orders: ", err);
                alert("Unable to delete orders");
            }
        });
    } else {
        alert("No orders selected for deletion.");
    }
});

	/**
--------------------Event handler to populate the Delete  page before it is displayed---------------------
**/

/**
--------------------Event handler to populate the Delete Confirmation page before it is displayed---------------------
**/
$(document).on("pagebeforeshow", "#deleteConfirmationPage", function() {
    // Retrieve the number of deleted orders from localStorage
    var deletedOrdersCount = localStorage.getItem("deletedCount") || 0;

    // Display the number of deleted orders
    $("#deleteInfo").html('<label for="numDeleteItems">' + deletedOrdersCount + ' Orders deleted:</label>');
});

// Redirect to home page when "Done" button is clicked
$(document).on("click", "#doneButton", function() {
    // Redirect to the home page
    $.mobile.changePage("#homePage");
});



});




