
let selectedCategory = 'Other';

let expenses = {
    Delivery: [],
    GoingOut: [],
    Groceries: [],
    Other: []
};


function setCategory(event, category) {
    if (category != null) {
        selectedCategory = category;
    }
    document.querySelectorAll(".buttons > button, .buttonsSC > button").forEach(btn => {
        btn.classList.remove("Delivery", "GoingOut", "Groceries", "Other");
    });
    event.target.classList.add(`${category}`);
    setBGCategory(event, category);
}


function setInputType(){
    const plusButton = document.querySelector('.plus-button');
    const amountInput = document.getElementById("amountInput");
    // focuses user input on amountInput
    // when plus button is pressed
    amountInput.focus();
    

    // if button was already pressed and current input is treated as money received
    if (amountInput.classList.contains("plus-button-pressed")){
        amountInput.classList.remove("plus-button-pressed");

        // create new minus icon and add it
        const plusIcon = document.createElement('i');
        plusIcon.classList.add('fa-solid', 'fa-plus');
        plusButton.append(plusIcon);

        // locate and delete old icon
        const minusIcon = plusButton.querySelector('.fa-minus');
        minusIcon.remove();

        // changes placeholder to let user know what state we are now in
        amountInput.placeholder = "- €";
        
    // button was not pressed and input is treated as money spent
    } else {
        amountInput.classList.add("plus-button-pressed");

        const minusIcon = document.createElement('i');
        minusIcon.classList.add('fa-solid', 'fa-minus');
        plusButton.append(minusIcon);

        const plusIcon = plusButton.querySelector('.fa-plus');
        plusIcon.remove();

        // change placeholder to let user know what state we are now in
        amountInput.placeholder = "+ €";
    }


}

function showNotification(message, state) {
    const notification = document.getElementById("notification");
    const notificationMessage = document.getElementById("notificationMessage");

    if (state == false) {
        notification.classList.add("error-notif");
    } else {
        if (notification.classList.contains("error-notif")) {
            notification.classList.remove("error-notif");
        }
    }

    // Set the notification message
    notificationMessage.textContent = message;

    // Show the notification
    notification.classList.add("show");

    // Hide the notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove("show");
    }, 3000);
}

function handleEnter(event) {
    if (event.key === "Enter") {
        const amountInput = document.getElementById("amountInput");
        const descriptionInput = document.getElementById("descriptionInput");

        let amount = parseFloat(amountInput.value.trim());
        const description = descriptionInput.value.trim();

        // if user is inputing money they received 
        if (amountInput.classList.contains("plus-button-pressed")){
            amount = amount * -1;
        }

        if (!isNaN(amount)) {
            if ("expenses" in localStorage) {
                expenses = JSON.parse(localStorage.getItem("expenses"));
                expenses[selectedCategory].push({ amount, description });
                localStorage.clear;
                localStorage.setItem("expenses", JSON.stringify(expenses));
            } else {
                expenses[selectedCategory].push({ amount, description });
                localStorage.setItem("expenses", JSON.stringify(expenses));
            }

            UpdateItems();

            // Show success notification
            showNotification("Item added successfully!", true);

            // Clear inputs
            amountInput.value = "";
            descriptionInput.value = "";
        } else {
            // Show error notification if amount is invalid
            showNotification("Price needed dummy", false);
        }
    }
}

function calculateTotalOverall() {
    let currentExpenses = JSON.parse(localStorage.getItem("expenses"));
    let totalOverall = 0;

    for (const category in currentExpenses) {
        totalOverall += currentExpenses[category].reduce((sum, item) => sum + item.amount, 0);
    }

    return totalOverall;
}

function UpdateItems() {
    const itemsContainer = document.getElementById("itemsContainer");
    itemsContainer.innerHTML = ""; // Clear previous items

    const topElement = document.createElement("div");
    topElement.classList.add("top-element");
    itemsContainer.append(topElement);

    // Add Clear All Button
    const clearAllButton = document.createElement("button");
    clearAllButton.textContent = "Clear All";
    clearAllButton.classList.add("clear-all-button");
    clearAllButton.addEventListener("click", clearAllItems);


    // Add Total Overall Money Spent
    const totalOverall = calculateTotalOverall();
    const totalOverallHeading = document.createElement("p");
    totalOverallHeading.classList.add("total-overall");


    if(parseFloat(totalOverall) < 0){

        let displayAmount = -1 * parseFloat(totalOverall);
        totalOverallHeading.textContent = `€${displayAmount} gained in total`;
        totalOverallHeading.classList.add("minus");
    } else {

        totalOverallHeading.textContent = `€${totalOverall} spent in total`;
        totalOverallHeading.classList.remove("minus");
    }


    

    topElement.appendChild(totalOverallHeading);
    topElement.appendChild(clearAllButton);


    // Loop through each category and display its items
    let currentExpenses = JSON.parse(localStorage.getItem("expenses"));
    for (const category in currentExpenses) {
        if (currentExpenses[category].length > 0) {
            // Create a heading for the category

            const categoryWrapper = document.createElement("div");
            categoryWrapper.classList.add("category-wrapper");

            const categoryHeading = document.createElement("h2");
            categoryHeading.classList.add("item-header");
            categoryHeading.textContent = category;

            if (categoryHeading.textContent == "GoingOut") {
                categoryHeading.textContent = "Going Out";
            }

            // Calculate total sum for the category
            const totalSum = currentExpenses[category].reduce((sum, item) => sum + item.amount, 0);
            const totalSumSpan = document.createElement("span");
            totalSumSpan.classList.add("total-sum");

            if(parseFloat(totalSum) < 0){

                let displayAmount = -1 * parseFloat(totalSum);
                totalSumSpan.textContent = `+ €${displayAmount}`;
            } else {

                totalSumSpan.textContent = `€${totalSum}`;
            }

            

            categoryHeading.appendChild(totalSumSpan);
            categoryWrapper.appendChild(categoryHeading);
            itemsContainer.appendChild(categoryWrapper);

            // Loop through items in the category
            currentExpenses[category].forEach((item, index) => {
                const itemDiv = document.createElement("div");
                itemDiv.classList.add("item");

                // Display amount and description
                const amountSpan = document.createElement("span");
                amountSpan.classList.add("amount");

                // if number is negative(aka it represents money received and not spent)
                // display it as "+ €" and color it blue
                if(parseFloat(item.amount) < 0){

                    let displayAmount = -1 * parseFloat(item.amount);
                    amountSpan.textContent = `+ €${displayAmount}`;
                    amountSpan.style.color = "rgba(0, 140, 255)";
                } else {

                    amountSpan.textContent = `€${item.amount}`;

                }

                itemDiv.appendChild(amountSpan);

                const descriptionSpan = document.createElement("span");
                descriptionSpan.classList.add("description");
                descriptionSpan.textContent = item.description;
                itemDiv.appendChild(descriptionSpan);

                // Add delete button for each item
                const deleteButton = document.createElement("button");
                deleteButton.innerHTML = '<i class="fa-solid fa-delete-left"></i>'; // Use innerHTML instead of textContent
                deleteButton.classList.add("delete-button");
                deleteButton.addEventListener("click", () => deleteItem(category, index));
                itemDiv.appendChild(deleteButton);


                categoryWrapper.appendChild(itemDiv);
            });
        }
    }
    toggleTotalOverallVisibility();
}

function clearAllItems() {
    localStorage.removeItem("expenses");
    expenses = {
        Delivery: [],
        GoingOut: [],
        Groceries: [],
        Other: []
    };
    UpdateItems();
    showNotification("All items cleared!", true);
    toggleTotalOverallVisibility();
}

function deleteItem(category, index) {
    let currentExpenses = JSON.parse(localStorage.getItem("expenses"));
    currentExpenses[category].splice(index, 1); // Remove the item
    localStorage.setItem("expenses", JSON.stringify(currentExpenses));
    UpdateItems();
    showNotification("Item deleted!", true);
    toggleTotalOverallVisibility();
}

document.addEventListener("DOMContentLoaded", function () {
    const amountInput = document.getElementById("amountInput");
    const descriptionInput = document.getElementById("descriptionInput");

    // Restrict amount input to numbers only
    amountInput.addEventListener("input", function () {
        this.value = this.value.replace(/[^0-9.]/g, ""); // Allow numbers and decimal point
    });

    // Handle Enter key for both inputs
    amountInput.addEventListener("keydown", handleEnter);
    descriptionInput.addEventListener("keydown", handleEnter);

    // Initialize expenses from localStorage
    if ("expenses" in localStorage) {
        expenses = JSON.parse(localStorage.getItem("expenses"));
    }

    // Initialize expenses from localStorage
    if ("notes" in localStorage) {
        notes = JSON.parse(localStorage.getItem("notes"));
    }

    // Display items on page load
    UpdateItems();
    UpdateNotes();
    toggleTotalOverallVisibility();
});


function toggleTotalOverallVisibility() {
    const totalOverallElement = document.querySelector(".total-overall");
    const deleteAll = document.querySelector(".clear-all-button");
    const itemsContainer = document.querySelector(".items-container");
    const noteContainer = document.getElementById("noteContainer");
    let currentExpenses = JSON.parse(localStorage.getItem("expenses")) || {};
    let currentNotes = JSON.parse(localStorage.getItem("notes")) || {};

    // Check if there are any expenses
    const hasExpenses = Object.values(currentExpenses).some(category => category.length > 0);
    const hasNotes = JSON.parse(localStorage.getItem("notes"))?.length > 0;

    if (totalOverallElement) {
        if (hasExpenses) {
            totalOverallElement.classList.remove("hidden");
            deleteAll.classList.remove("hidden");
            itemsContainer.classList.remove("hidden");
        } else {
            totalOverallElement.classList.add("hidden");
            deleteAll.classList.add("hidden");
            itemsContainer.classList.add("hidden");
        }

        if (hasNotes) {
            noteContainer.classList.remove("hidden");
        } else {
            noteContainer.classList.add("hidden");
        }
    }
}


function setBGCategory(event, category) {
    const backgrounds = {
        'Delivery': 'url("delivery.jpg")',
        'GoingOut': 'url("goingout.jpg")',
        'Groceries': 'url("groceries.jpg")',
        'Other': 'url("other.jpg")'
    };

    // Get the background container div
    const bgContainer = document.getElementById('bgContainer');
    
    // Update the background-image property
    bgContainer.style.backgroundImage = backgrounds[category];
}


// -----------------------------------------------------------


var notes = [];

document.getElementById("noteInput").addEventListener("keydown", function (event) {
    if (event.shiftKey && event.key === "Enter") {
        event.preventDefault(); // Prevent default behavior

        let currentHeight = parseInt(window.getComputedStyle(this).height);
        if (currentHeight < 200) {
            this.style.height = (currentHeight + 30) + "px"; // Expand by 30px
        }

        // Insert a new line at cursor position
        let start = this.selectionStart;
        let end = this.selectionEnd;
        this.value = this.value.substring(0, start) + "\n" + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 1; // Move cursor to new line
    }

    // Decrease height when Backspace is pressed at an empty line
    if (event.key === "Backspace") {
        let currentHeight = parseInt(window.getComputedStyle(this).height);
        let minHeight = 30; // Default height

        let start = this.selectionStart; // Get cursor position
        let textBeforeCursor = this.value.substring(0, start); // Text before the cursor
        let textAfterCursor = this.value.substring(start); // Text after the cursor
        let lines = textBeforeCursor.split("\n"); // Get all lines before cursor
        let currentLine = lines[lines.length - 1]; // Get the current line where cursor is

        if (currentLine === "" && start > 0 && currentHeight > minHeight) {
            event.preventDefault(); // Prevent default backspace behavior
            
            // Remove only the last newline before cursor
            let newText = textBeforeCursor.slice(0, -1) + textAfterCursor;
            this.value = newText;

            this.selectionStart = this.selectionEnd = start - 1; // Move cursor up correctly
            this.style.height = Math.max(minHeight, currentHeight - 30) + "px"; // Reduce height by 30px
        }
    }
});



function handleEnterNotes(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        const noteInput = document.getElementById("noteInput");

        let text = noteInput.value;

        if (text.length > 0) {
            let notes = localStorage.getItem("notes") ? JSON.parse(localStorage.getItem("notes")) : [];
            notes.push({ text }); // Preserve line breaks

            localStorage.setItem("notes", JSON.stringify(notes));

            UpdateNotes();

            // Show success notification
            showNotification("Note stored!", true);

            // Clear input and reset height
            noteInput.value = "";
            noteInput.style.height = "30px";
        } else {
            showNotification("Type something in dummy :3", false);
        }
    }
}


document.getElementById("noteInput").addEventListener("keydown", function(event) {
    if (document.activeElement === this) { // Check if noteInput is focused
        handleEnterNotes(event);
    }
});


function UpdateNotes() {
    const noteContainer = document.getElementById("noteContainer");
    const date = new Date();

    noteContainer.innerHTML = ""; // Clear previous items

    // Loop through each category and display its items
    let currentNotes = JSON.parse(localStorage.getItem("notes"));

    for (let i = (currentNotes.length - 1); i >= 0; i--) {
        const noteDiv = document.createElement("div");
        noteDiv.classList.add("note");
    
        const noteDate = document.createElement("p");
        noteDate.classList.add("note-date");
        noteDate.innerHTML = date.getDate() + " " + (date.getMonth() + 1) + " " + date.getFullYear();
    
        const ContentSpan = document.createElement("span");
        ContentSpan.classList.add("note-content");
    
        const notesInnerHTML = currentNotes[i].text.replace(/\n/g, "<br>");
        const matches = notesInnerHTML.match(/<br>/g);
    
        if (matches && matches.length > 2) {
            ContentSpan.innerHTML = "<br>" + notesInnerHTML;
        } else {
            ContentSpan.innerHTML = notesInnerHTML;
        }
    
        noteDiv.appendChild(ContentSpan);
        noteDiv.appendChild(noteDate);
    
        // Correcting the index when adding delete button
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="fa-solid fa-eraser"></i>';
        deleteButton.classList.add("delete-note");
    
        // Reverse the index to match the original array order
        const originalIndex = i;
        deleteButton.addEventListener("click", () => deleteNote(originalIndex));
    
        noteDiv.appendChild(deleteButton);
        noteContainer.appendChild(noteDiv);
    }
    
}

function deleteNote(index) {
    let currentNotes = JSON.parse(localStorage.getItem("notes"));



    currentNotes.splice(index, 1); // Remove the item
    localStorage.setItem("notes", JSON.stringify(currentNotes));
    UpdateNotes();
    showNotification("Note deleted!", true);

    toggleTotalOverallVisibility();

}





function noteDropdown(){
    const noteContainer = document.getElementById("noteContainer");
    let currentNotes = JSON.parse(localStorage.getItem("notes"));
    if (noteContainer.classList.contains("hidden")){
        if(currentNotes.length>0){
            noteContainer.classList.remove("hidden");
        } else {
            showNotification("Add a note!", false);
        }

    } else {
        noteContainer.classList.add("hidden")
    }
}
