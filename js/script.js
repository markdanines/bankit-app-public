/****************************
 * MARK DANIEL INES' BANK IT APPLICATION
 ***************************/

// CREATE USER DATA
let user1 = {
  name: "John",
  cardNumber: 12345678,
  pin: 1234,
  balance: 550.2,
  transactions: [
    {
      type: "Withdraw",
      amount: -100,
      date: "2021-01-01",
    },
    {
      type: "Deposit",
      amount: 250,
      date: "2021-01-07",
    },
    {
      type: "Transfer",
      amount: 100,
      date: "2021-01-10",
      sender: "Sarah",
      recipient: "John",
    },
  ],
};

let user2 = {
  name: "Sarah",
  cardNumber: 87654321,
  pin: 1234,
  balance: 1050.34,
  transactions: [
    {
      type: "Withdraw",
      amount: 100,
      date: "2021-01-08",
    },
    {
      type: "Deposit",
      amount: 250,
      date: "2021-01-14",
    },
    {
      type: "Transfer",
      amount: -100,
      date: "2021-01-18",
      sender: "Sarah",
      recipient: "John",
    },
  ],
};

let users = [user1, user2];

/*******************
 * DOM SELECTORS
 *******************/

//INPUTS
let cardNumberInput = document.querySelector("#cardNumber");
let pinInput = document.querySelector("#pin");
let depositInput = document.querySelector(".deposit-input");
let withdrawInput = document.querySelector(".withdraw-input");
let transferAmountInput = document.querySelector(".transfer-amount");
let transferRecipientInput = document.querySelector(".transfer-recipient");

//BUTTONS
let loginBtn = document.querySelector(".login-btn");
let depositBtn = document.querySelector(".deposit-btn");
let withdrawBtn = document.querySelector(".withdraw-btn");
let transferBtn = document.querySelector(".transfer-btn");

//SCREENS
let preLoginScreen = document.querySelector(".pre-login");
let postLoginScreen = document.querySelector(".post-login");
let transactionContentScreen = document.querySelector(".transaction-contents");
let depositContentScreen = document.querySelector(".deposit-contents");
let withdrawContentScreen = document.querySelector(".withdraw-contents");
let transferContentScreen = document.querySelector(".transfer-contents");

// SUBSCREENS
let transactionSubScreen = document.querySelector(".transactions");

//DASHBOARD VALUES
let usernameOutput = document.querySelector(".username");
let balanceOutput = document.querySelector(".balance");

//DASHBOARD LINKS
let homeLink = document.querySelector(".home-link");
let depositLink = document.querySelector(".deposit-link");
let withdrawLink = document.querySelector(".withdraw-link");
let transferLink = document.querySelector(".transfer-link");
let logoutLink = document.querySelector(".logout-link");

// MESSAGES
let invalidDepositMsg = document.querySelector(".invalid-deposit-msg");
let validDepositMsg = document.querySelector(".valid-deposit-msg");
let invalidWithdrawMsg = document.querySelector(".invalid-withdraw-msg");
let validWithdrawMsg = document.querySelector(".valid-withdraw-msg");
let invalidTransferAmountMsg = document.querySelector(
  ".invalid-transfer-amount-msg"
);
let invalidTransferRecipientMsg = document.querySelector(
  ".invalid-transfer-recipient-msg"
);
let successTransferMsg = document.querySelector(".success-transfer-msg");

/****************************************************************
 * ***********************APPLICATION LOGIC*********************
 ****************************************************************/
let currentUser = null;
let currentDisplayOnDash = null;
let currentNameOfDisplay = "";
/************************
 * INIT USERNAME AND PASSWORD VALUES
 *************************/
cardNumberInput.value = "12345678";
pinInput.value = "1234";

/******HELPER FUNCTIONS******* */

// TOGGLE SCREENS FUNCTION - toggles 2 screens d-flex & d-none class passed in as arguments
let screenFlexDisplayToggler = function (screen) {
  screen.classList.toggle("d-flex");
  screen.classList.toggle("d-none");
};

// UPDATE DASHBOARD VALUES FUNCTION - updates the values of the dashboard based on the currentuser passend into it as an argument
let updateDashValues = function () {
  if (currentUser) {
    usernameOutput.textContent = currentUser.name;
    balanceOutput.textContent = `$${(
      Math.round(currentUser.balance * 100) / 100
    ).toFixed(2)}`;

    // Update Transaction Section
  } else {
    usernameOutput.textContent = "";
    balanceOutput.textContent = "";
  }
};

// SCREEN INPUT RESET FUNCTION
let resetDefaults = function () {
  // Clear deposit page values to default
  depositInput.value = "";
  invalidDepositMsg.classList.add("d-none");
  validDepositMsg.classList.add("d-none");

  // Clear withdraw page to default
  withdrawInput.value = "";
  invalidWithdrawMsg.classList.add("d-none");
  validWithdrawMsg.classList.add("d-none");

  // Clear Transfer page to default
  transferAmountInput.value = "";
  transferRecipientInput.value = "";
  invalidTransferAmountMsg.classList.add("d-none");
  invalidTransferRecipientMsg.classList.add("d-none");
  successTransferMsg.classList.add("d-none");
};

// TRANSACTION OBJECT CREATOR FUNCTION
let transactionCreator = function (type, amount, date, sender, recipient) {
  if (!sender) {
    return {
      type,
      amount,
      date,
    };
  }

  return {
    type,
    amount,
    date,
    sender,
    recipient,
  };
};

/*
{
      type: "transfer-sent",
      amount: -100,
      date: "2021-01-07T08:30:00",
      sender: "Sarah",
      recipient: "John",
    },
*/
// DISPLAY TRANSACTIONS
let displayTransactions = function () {
  // Convert each transaction date to a date object and reassign to object
  currentUser.transactions.forEach(function (transaction) {
    transaction.date = new Date(transaction.date);
  });

  // Make a copy of the transactions
  let transactionCopy = [...currentUser.transactions];

  // sort array by date
  transactionCopy.sort(function (a, b) {
    return b.date - a.date;
  }); // transactionCopy array will have the most recent transactions at the top

  // Remove all child elements from transaction sub screen
  transactionSubScreen.innerHTML = "";

  // Declare empty html object
  let html = "";

  transactionCopy.forEach(function (transaction) {
    html += `<div class="card my-2">
                  <div class="card-body">
                    <h5 class="card-title ${
                      transaction.amount > 0 ? "text-success" : "text-danger"
                    }">${transaction.amount}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${
                      transaction.date
                    }</h6>
                    <p class="card-text">${
                      transaction.type === "Transfer"
                        ? `Transfer <p> Sender:${transaction.sender}</p><p>  Recipient: ${transaction.recipient}</p>`
                        : transaction.type
                    }</p>
                  </div>
                </div>`;
  });

  transactionSubScreen.insertAdjacentHTML("afterbegin", html);
};

let highlightLink = function (currentDisplay) {
  currentDisplay.style.borderBottom = `3px solid var(--color-1)`;
  currentDisplay.style.borderTop = `3px solid var(--color-1)`;
};

let unHighlightLink = function (currentDisplay) {
  currentDisplay.style.border = `3px solid transparent`;
};

/*********LOGIN FUNCTIONALITY *********/
/**Login screen has an event listener on login button which checks to see if either one of the users' card number and pin match the input. If there is a match then the prelogin and postlogin screen's d-flex and d-none class is toggled. The currentUser variable gets assigned the object to which the match corresponds*/
loginBtn.addEventListener("click", function (e) {
  // Prevent form refresh
  e.preventDefault();

  // Assign converted card number and pin values to variables
  cardNumberValue = Number(cardNumberInput.value);
  pinValue = Number(pinInput.value);

  // Loop through each element for match
  users.forEach(function (el) {
    if (el.cardNumber === cardNumberValue && el.pin === pinValue) {
      // Toggle prelogin screen d-flex and d-none classes
      screenFlexDisplayToggler(preLoginScreen);

      // Toggle postlogin screen d-flex and d-none classes
      screenFlexDisplayToggler(postLoginScreen);

      // Make sure transaction screen is first screen that pops up
      transactionContentScreen.classList.add("d-flex");
      transactionContentScreen.classList.remove("d-none");

      // Assign current element to current user and current displayed element to current display
      currentUser = el;
      currentNameOfDisplay = "home";
      currentDisplayOnDash = transactionContentScreen;

      // Highlight current displays menu link
      highlightLink(document.querySelector(`.${currentNameOfDisplay}-link`));

      // Display transactions
      displayTransactions();

      // Initialize Dashboard with name and balance
      updateDashValues();
    }
  });
});

/**********DASHBOARD CONTROLS*********** */
homeLink.addEventListener("click", function () {
  // Toggles the current display on dashboard and toggles the display of homescreen
  screenFlexDisplayToggler(currentDisplayOnDash);
  screenFlexDisplayToggler(transactionContentScreen);

  // Reset values
  resetDefaults();

  //Unhighlight current link
  unHighlightLink(document.querySelector(`.${currentNameOfDisplay}-link`));

  //Update currentDisplayOnDash variable to the home screen
  currentNameOfDisplay = "home";

  // Highlight current link
  highlightLink(document.querySelector(`.${currentNameOfDisplay}-link`));

  currentDisplayOnDash = transactionContentScreen;
});

depositLink.addEventListener("click", function () {
  screenFlexDisplayToggler(currentDisplayOnDash);
  screenFlexDisplayToggler(depositContentScreen);
  resetDefaults();
  unHighlightLink(document.querySelector(`.${currentNameOfDisplay}-link`));
  currentNameOfDisplay = "deposit";
  highlightLink(document.querySelector(`.${currentNameOfDisplay}-link`));
  currentDisplayOnDash = depositContentScreen;
});

withdrawLink.addEventListener("click", function () {
  screenFlexDisplayToggler(currentDisplayOnDash);
  screenFlexDisplayToggler(withdrawContentScreen);
  resetDefaults();
  unHighlightLink(document.querySelector(`.${currentNameOfDisplay}-link`));
  currentNameOfDisplay = "withdraw";
  highlightLink(document.querySelector(`.${currentNameOfDisplay}-link`));
  currentDisplayOnDash = withdrawContentScreen;
});

transferLink.addEventListener("click", function () {
  screenFlexDisplayToggler(currentDisplayOnDash);
  screenFlexDisplayToggler(transferContentScreen);
  resetDefaults();
  unHighlightLink(document.querySelector(`.${currentNameOfDisplay}-link`));
  currentNameOfDisplay = "transfer";
  highlightLink(document.querySelector(`.${currentNameOfDisplay}-link`));
  currentDisplayOnDash = transferContentScreen;
});

logoutLink.addEventListener("click", function () {
  unHighlightLink(document.querySelector(`.${currentNameOfDisplay}-link`));

  currentUser = null;
  currentNameOfDisplay = "";
  resetDefaults();
  screenFlexDisplayToggler(currentDisplayOnDash);
  currentDisplayOnDash = null;
  screenFlexDisplayToggler(postLoginScreen);
  screenFlexDisplayToggler(preLoginScreen);
});

/***********TRANSACTIONS, DEPOSIT, WITHDRAW, TRANSFER ********** */

//TRANSACTIONS LOGIC

// DEPOSIT LOGIC //
let invalidDeposit = false;
depositBtn.addEventListener("click", function (e) {
  // Prevent form refresh
  e.preventDefault();

  //

  // Convert value to Number and assign to variable
  let depositValue = Number(depositInput.value);

  // Check that deposit value is valid greater than 5 and must not be a falsy value
  if (depositValue < 5 || !depositValue) {
    if (!invalidDeposit) {
      invalidDepositMsg.classList.toggle("d-none");
      invalidDeposit = true;
    }
  } else {
    //Update current users balance
    currentUser.balance += depositValue;

    //Update user transaction information and display transactions
    currentUser.transactions.push(
      transactionCreator("Deposit", Math.abs(depositValue), Date.now())
    );

    displayTransactions();

    //Update dashboard values and reset input to empty string
    updateDashValues();
    depositInput.value = "";

    // Add classlist d-none show success message
    invalidDepositMsg.classList.add("d-none");
    validDepositMsg.classList.remove("d-none");

    // Update invalidDeposit variable to false
    invalidDeposit = false;
  }
});

// WITHDRAW LOGIC //
let invalidWithdraw = false;
withdrawBtn.addEventListener("click", function (e) {
  // Prevent form refresh
  e.preventDefault();

  // Convert value to Number and assign to variable
  let withdrawValue = Number(withdrawInput.value);

  // Check that withdraw value is valid - must be lower than current balance and must not be a falsy value
  if (withdrawValue > currentUser.balance || !withdrawValue) {
    if (!invalidWithdraw) {
      validWithdrawMsg.classList.add("d-none");
      invalidWithdrawMsg.classList.remove("d-none");
      invalidWithdraw = true;
    }
  } else {
    //Update current users balance
    currentUser.balance -= withdrawValue;

    //Update user transaction information
    currentUser.transactions.push(
      transactionCreator("Withdraw", -Math.abs(withdrawValue), Date.now())
    );

    displayTransactions();

    //Update dashboard values and reset input to empty string
    updateDashValues();
    withdrawInput.value = "";

    // Add classlist d-none show success message
    invalidWithdrawMsg.classList.add("d-none");
    validWithdrawMsg.classList.remove("d-none");

    // Update invalidDeposit variable to false
    invalidWithdraw = false;
  }
});

// TRANSFER LOGIC //
let validAmount = false;
let match = false;
transferBtn.addEventListener("click", function (e) {
  // Prevent form refresh
  e.preventDefault();

  // Convert amount to number and assign amount and recipient names to new variables
  let transferAmount = Number(transferAmountInput.value);
  let transferRecipient = transferRecipientInput.value;

  // Validate amount
  if (transferAmount > currentUser.balance || !transferAmount) {
    validAmount = false;

    // Display message
    invalidTransferAmountMsg.classList.remove("d-none");
  } else {
    //Remove message from before
    invalidTransferAmountMsg.classList.add("d-none");

    validAmount = true;
  }

  // Validate recipient name loop through each user to check if there are any matches
  let recipient = null;

  users.forEach(function (el) {
    if (el.name === transferRecipient) {
      // If there is a match, then set match to true and assign the current element to the recipient variable
      match = true;
      recipient = el;
    }
  });

  if (!match) {
    invalidTransferRecipientMsg.classList.remove("d-none");
  } else {
    invalidTransferRecipientMsg.classList.add("d-none");
  }

  if (validAmount && match) {
    // Transfer to recipient
    // Update recipient and current user balance
    recipient.balance += transferAmount;
    currentUser.balance -= transferAmount;

    // Display success message and remove input form values
    successTransferMsg.classList.remove("d-none");
    transferAmountInput.value = "";
    transferRecipientInput.value = "";

    // Update transactions on both sender and receiver account
    currentUser.transactions.push(
      transactionCreator(
        "Transfer",
        -Math.abs(transferAmount),
        Date.now(),
        currentUser.name,
        recipient.name
      )
    );

    recipient.transactions.push(
      transactionCreator(
        "Transfer",
        Math.abs(transferAmount),
        Date.now(),
        recipient.name,
        currentUser.name
      )
    );

    displayTransactions();

    // Reset recipient
    recipient = null;

    // Update dashboard values
    updateDashValues();
  }
});

/******************************
 * FRONT END MANIPULATION
 *****************************/
let exitMenuBtn = document.querySelector(".fa-times");
let menuBtn = document.getElementById("menu-btn");

// Screen Elements
let sideBarMenu = document.querySelector("#menu");
let blurOverlay = document.querySelector(".blur-overlay");

// Side bar variable to track
let sideBarOpen = false;
// When menu btn is pressed
menuBtn.addEventListener("click", function () {
  let initValue = -250;

  let timer = setInterval(function () {
    if (initValue < 0) {
      sideBarMenu.style.left = `${(initValue += 4)}px`;
    } else {
      clearInterval(timer);
    }
  }, 1);

  //Update sidebar open variable
  sideBarOpen = true;

  // Blur the background of current page
  // blurOverlay.style.filter = `blur(3px)`;

  // Change display of menu button to none
  menuBtn.style.display = "none";
});

let exitMenu = function () {
  //Retract sidebar
  sideBarMenu.style.left = "-250px";

  // Display menu button again
  menuBtn.style.display = "block";

  //Update sidebaropen variable
  sideBarOpen = false;

  // Unblur background
  // blurOverlay.style.filter = `none`;
};

// When exit menu btn is pressed
exitMenuBtn.addEventListener("click", exitMenu);

// When Sidebar is open but the user clicks outside of the sidebar
blurOverlay.addEventListener("click", function (e) {
  if (window.innerWidth < 481 && sideBarOpen && e.x > 250) {
    sideBarMenu.style.left = "-250px";
    menuBtn.style.display = "block";
    sideBarOpen = false;
  }
});

/****************************
 * MARK DANIEL INES' BANK IT APPLICATION
 * Copyright 2021, Mark Daniel Ines. All Rights Reserved.
 ***************************/
