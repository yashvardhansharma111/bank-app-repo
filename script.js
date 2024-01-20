'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data
const account1 = {
  owner: 'Yashvardhan Sharma',
  movements: [800, 450, -600, 4000, -650, -530, 970, 11300],
  interestRate: 1.8, 
  pin: 1111,

};

const account2 = {
  owner: 'Devendra Maithil',
  movements: [5000, 3400, -150, -790, 3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Ashutosh Gothwal',
  movements: [400, -400, 340, -300, -20, 90, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Mahima Khatri',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
    owner: 'Aman Tiwari',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 5555,
  };
  
const accounts = [account1, account2, account3, account4,account5];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// practice of forEach
const currencies = new Map ([
  ['USD','United States dollar'],
  ['EUR','Euro'],
  ['INR','Indian Ruppees'],
]);
//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// Functions
const displayMovements = function(movements , sort = false){
containerMovements.innerHTML = '';

const movs = sort ? movements.slice().sort((a,b) => a - b) : movements;

 movs.forEach(function (mov , i ){
  const type = mov > 0 ? 'deposit' : 'withdrawal'

  const html = `
  <div class="movements">
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__value">${mov}</div>
        </div>
  `;

 containerMovements.insertAdjacentHTML('afterbegin',html);
 });
};

const calcDisplayBalance = function(acc){
   acc.balance = acc.movements.reduce((acc , mov) => acc
   + mov , 0);
  labelBalance.textContent = `${acc.balance} INR`;
};

const calcDisplaySummary = function(acc){
  const incomes = acc.movements
  .filter(mov => mov > 0)
  .reduce((acc , mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}INR`;

  const out = acc.movements
  .filter(mov => mov < 0)
  .reduce((acc,mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}INR`;

  const interest =  acc.movements.filter(mov => mov > 0).
  map(deposit => (deposit + 1.8) /  100)
  .filter((int , i , arr)=> {
    console.log(arr) ;
    return int >= 1 ;
  })
  .reduce((acc , int) => acc + int ,0);
  labelSumInterest.textContent = `${interest}INR`;

};
const createUsernames = function (accs){
accs.forEach(function(acc){

  acc.username = acc.owner
.toLowerCase()
.split(' ')
.map(name => name[0])
.join(' ');
});
};
createUsernames(accounts);

const updateUI = function(acc) {
   // display movemenets
   displayMovements(acc.movements);

   // display balance
   calcDisplayBalance(acc);

   //display summary
    calcDisplaySummary(acc);
}

//Event handler for login 
let currentAccount ; 
btnLogin.addEventListener('click', function (e) {
  // prevenet form from submitting
  e.preventDefault();

    currentAccount = accounts.find(acc => acc.username === 
    inputLoginUsername.value);
    console.log(currentAccount);

    if (currentAccount?.pin === Number(inputLoginPin.value))
    {//display UI and messasge
     labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
     containerApp.style.opacity = 100;

     //clear input fields
     inputLoginUsername.value = inputLoginPin.value = '';
     inputLoginPin.blur();

      updateUI(currentAccount);
    }
});

btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
   inputTransferAmount.value = inputTransferTo.value = '';

  if(amount > 0 && 
    recieverAcc && 
    currentAccount.balance >= amount &&
     recieverAcc?.username != currentAccount.username){
      // During the transfer
      currentAccount.movements.push(-amount);
      recieverAcc.movements.push(amount);

      updateUI(currentAccount);
     }
});

btnLoan.addEventListener('click',function(e){
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if(amount > 0 && currentAccount.movements.some(mov => mov
    >= amount * 0.1)){
      //add movement
      currentAccount.movements.push(amount);

      //update UI
      updateUI(currentAccount);
    }
    inputLoanAmount.value = '';
})

btnClose.addEventListener('click',function(e){
  e.preventDefault();
  
  if(inputCloseUsername.value === currentAccount.username && 
    Number(inputClosePin.value)=== currentAccount.pin){
      const index = accounts.findIndex(
        acc => acc.username === currentAccount.username
      );
      console.log(index);
      // Delete account
      accounts.splice(index , 1);
       //Hide ui
      containerApp.style.opacity = 0;
    }
    inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click',function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements , !sorted);
  sorted = !sorted;
});

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];


const deposits = movements.filter(function (mov , i , arr){
return mov > 0;
});
console.log(movements);
console.log(deposits);

const depositsFor = [];
for (const mov of movements) if (mov > 0) depositsFor.push(mov);
console.log(depositsFor);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);

console.log(movements);

// accumulator => SNOWBALL
const balance = movements.reduce((acc , cur ) => acc + cur , 0)
console.log(balance);

let balance2 = 0
for(const mov of movements) balance2 += mov;
console.log(balance2);

// Max value
const Max = movements.reduce((acc , mov) => {
  if(acc > mov) return acc;
else return mov;
},movements[0]);
console.log(Max);

const inrToUsd = 0.012;
console.log(movements);

//PIPELINE
const totalDepositsUSD = movements
.filter(mov => mov > 0)
.map((mov , i ,arr) => {
  return mov + inrToUsd;
})
.reduce((acc , mov) => acc + mov, 0);
console.log(totalDepositsUSD);

const firstWithdrawal = movements.find(mov => mov < 0);

console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Yashvardhan Sharma');
console.log(account);

movements.sort((a,b) => a-b);
console.log(movements);
