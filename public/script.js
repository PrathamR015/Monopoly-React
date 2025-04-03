class Player {
    constructor(name) {
        this.name = name;
        this.balance = 1500;
        this.id = Date.now().toString();
        this.properties = [];
    }
}

class Property {
    constructor(name, price, group,rent, color) {
        this.name = name;
        this.price = price;
        this.group = group;
        this.rent = rent;
        this.color = color;
        this.owner = null;
    }
}

let players = [];
let properties = [];
let currentTransaction = null;


function loadData() {
    const storedPlayers = localStorage.getItem('monopolyPlayers');
    const storedProperties = localStorage.getItem('monopolyProperties');

    if (storedPlayers) {
        players = JSON.parse(storedPlayers);
    }
    updatePlayersDisplay();
    updatePropertyDisplay();
}


function saveData() {
    localStorage.setItem('monopolyPlayers', JSON.stringify(players));
    localStorage.setItem('monopolyProperties', JSON.stringify(properties));
}

function addPlayer() {
    const nameInput = document.getElementById('newPlayerName');
    const name = nameInput.value.trim();
    
    if (name) {
        const player = new Player(name);
        players.push(player);
        nameInput.value = '';
        updatePlayersDisplay();
        updatePropertyDisplay();
        saveData();
    }
}

function updatePlayersDisplay() {
    const container = document.getElementById('playersContainer');
    container.innerHTML = '';

    players.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.style.cssText = 'background-color: #fff; border: 2px solid rgb(122, 26, 26); border-radius: 8px; padding: 15px;';
        
        let propertiesHtml = `<div style="margin-top: 10px; padding: 10px; background-color: #f8f9fa; border-radius: 5px;">
            <h3>Properties:</h3><ul style="list-style: none; padding: 0;">`;
        
        player.properties.forEach(prop => {
            propertiesHtml += `
                <li style="padding: 8px; margin: 5px 0; background-color: #fff; border: 1px solid #ddd; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
                    <span>
                        <span style="width: 20px; height: 20px; border-radius: 50%; display: inline-block; margin-right: 10px; background-color: ${prop.color};"></span>
                        ${prop.name}
                    </span>
                    <button onclick="sellProperty('${player.id}', '${prop.name}')" style="background-color:rgb(122, 26, 26); color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">Sell</button>
                </li>
            `;
        });
        propertiesHtml += '</ul></div>';

        playerCard.innerHTML = `
            <div style="font-size: 1.2em; font-weight: bold; color:rgb(0, 0, 0); margin-bottom: 10px;">${player.name}</div>
            <div style="font-size: 1.5em; color:rgb(21, 255, 0); margin-bottom: 15px;"> &#8377;${player.balance}</div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button onclick="showTransactionModal('receive', '${player.id}')" style="background-color:rgb(122, 26, 26); color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">Receive Money</button>
                <button onclick="showTransactionModal('pay', '${player.id}')" style="background-color:rgb(122, 26, 26); color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">Pay Money</button>
                <button onclick="removePlayer('${player.id}')" style="background-color:rgb(122, 26, 26); color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">Remove Player</button>
            </div>
            ${propertiesHtml}
        `;
        container.appendChild(playerCard);
    });
}

function updatePropertyDisplay() {
    const container = document.getElementById('propertiesContainer');
    container.innerHTML = '';

    const groupedProperties = properties.reduce((acc, prop) => {
        if (!acc[prop.group]) {
            acc[prop.group] = [];
        }
        acc[prop.group].push(prop);
        return acc;
    }, {});

    Object.entries(groupedProperties).forEach(([group, props]) => {
        const groupDiv = document.createElement('div');
        groupDiv.style.marginBottom = '20px';
        
        let groupHtml = `<div style="font-weight: bold; color:rgb(122, 26, 26); margin-bottom: 10px;">${group}</div>`;
        props.forEach(prop => {
            groupHtml += `
                <div style="background-color: white; border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 10px;">
                    <span style="width: 20px; height: 20px; border-radius: 50%; display: inline-block; margin-right: 10px; background-color: ${prop.color};"></span>
                    <strong>${prop.name}</strong><br>
                    Price: &#8377; ${prop.price}<br>
                    Rent: &#8377; ${prop.rent}<br>
                    Owner: ${prop.owner ? prop.owner : 'Bank'}
                </div>
            `;
        });

        groupDiv.innerHTML = groupHtml;
        container.appendChild(groupDiv);
    });
}


function showPropertyModal() {
    const modal = document.getElementById('propertyModal');
    modal.style.display = 'flex';

}

function cancelPropertyPurchase() {
    const modal = document.getElementById('propertyModal');
    modal.style.display = 'none';
}


function showTransactionModal(type, playerId) {
    const modal = document.getElementById('transactionModal');
    modal.style.display = 'flex';
    currentTransaction = { type, playerId };
}

function cancelTransaction() {
    const modal = document.getElementById('transactionModal');
    modal.style.display = 'none';
}


function confirmPropertyPurchase() {
    const propertyName = document.getElementById('propertySelect').value;
    const playerId = document.getElementById('playerSelect').value;
    const property = properties.find(p => p.name === propertyName);
    const player = players.find(p => p.id === playerId);

    if (!property || !player) {
        alert('Please select a valid property and player');
        return;
    }

    if (player.balance < property.price) {
        alert('Insufficient funds to purchase this property!');
        return;
    }

    player.balance -= property.price;
    property.owner = player.name;
    player.properties.push(property);

    updatePlayersDisplay();
    updatePropertyDisplay();
    cancelPropertyPurchase();
    saveData(); // Save data to LocalStorage
}

function sellProperty(playerId, propertyName) {
    const player = players.find(p => p.id === playerId);
    const property = properties.find(p => p.name === propertyName);

    if (!player || !property) {
        alert('Invalid player or property');
        return;
    }

    const sellPrice = Math.floor(property.price / 2);
    player.balance += sellPrice;
    property.owner = null;
    player.properties = player.properties.filter(p => p.name !== propertyName);

    updatePlayersDisplay();
    updatePropertyDisplay();
    saveData(); // Save data to LocalStorage
}

function showPropertyModal() {
const modal = document.getElementById('propertyModal');
const propertySelect = document.getElementById('propertySelect');
const playerSelect = document.getElementById('playerSelect');

propertySelect.innerHTML = '';
playerSelect.innerHTML = '';

const availableProperties = properties.filter(p => !p.owner);
if (availableProperties.length === 0) {
alert('No properties available for purchase!');
return;
}

availableProperties.forEach(prop => {
const option = document.createElement('option');
option.value = prop.name;
option.textContent = `${prop.name} - Rs. ${prop.price}`;
propertySelect.appendChild(option);
});

if (players.length === 0) {
alert('Add players before buying properties!');
return;
}

players.forEach(player => {
const option = document.createElement('option');
option.value = player.id;
option.textContent = `${player.name} - Rs. ${player.balance}`;
playerSelect.appendChild(option);
});

modal.style.display = 'flex';
}

function initializeProperties() {
// Brown properties
properties.push(new Property("Bhubaneshwar", 60, "Brown", 4, "#955436"));
properties.push(new Property("Guwahati", 60, "Brown", 2, "#955436"));

// Light Blue properties
properties.push(new Property("Goa", 100, "Dark Blue", 6, "#0072bb"));
properties.push(new Property("Agra", 100, "Dark Blue", 6, "#0072bb"));
properties.push(new Property("Vadodara", 120, "Dark Blue", 8, "#0072bb"));

// Pink properties
properties.push(new Property("Ludhiana", 140, "Pink", 10, "#d93a96"));
properties.push(new Property("Patna", 140, "Pink", 10, "#d93a96"));
properties.push(new Property("Bhopal", 160, "Pink", 12, "#d93a96"));

// Orange properties
properties.push(new Property("Indore", 180, "Orange", 14, "#f7921c"));
properties.push(new Property("Nagpur", 180, "Orange", 14, "#f7921c"));
properties.push(new Property("Kochi", 200, "Orange", 16, "#f7921c"));

// Red properties
properties.push(new Property("Lucknow", 220, "Red", 18, "#ed1b24"));
properties.push(new Property("Chandigarh", 220, "Red", 18, "#ed1b24"));
properties.push(new Property("Jaipur", 240, "Red", 20, "#ed1b24"));

// Yellow properties
properties.push(new Property("Pune", 260, "Yellow", 22, "#fef200"));
properties.push(new Property("Hyderabad", 260, "Yellow", 22, "#fef200"));
properties.push(new Property("Ahmedbad", 280, "Yellow", 24, "#fef200"));

// Green properties
properties.push(new Property("Chennai", 300, "Green", 26, "#1fb25a"));
properties.push(new Property("Kolkata", 300, "Green", 26, "#1fb25a"));
properties.push(new Property("Bengaluru", 320, "Green", 28, "#1fb25a"));

// Dark Blue properties
properties.push(new Property("Delhi", 350, "Light Blue", 35, "#aae0fa"));
properties.push(new Property("Mumbai", 400, "Light Blue", 50, "#aae0fa"));

// Railroads
properties.push(new Property("Chennai Central Railway Station", 200, "Railroad", 25, "#000000"));
properties.push(new Property("New Delhi Railway Station", 200, "Railroad", 25, "#000000"));
properties.push(new Property("Howrah Railway Station", 200, "Railroad", 25, "#000000"));
properties.push(new Property("Chhatrapati Shivaji Terminus", 200, "Railroad", 25, "#000000"));

// Utilities
properties.push(new Property("Electric Company", 150, "Utility", "0" , "#999999"));
properties.push(new Property("Water Works", 150, "Utility", "0", "#999999"));
}

// Add transaction confirmation functions
function confirmTransaction() {
const amount = parseInt(document.getElementById('transactionAmount').value);
if (!amount || isNaN(amount)) {
alert('Please enter a valid amount');
return;
}

const player = players.find(p => p.id === currentTransaction.playerId);
if (!player) {
alert('Invalid player');
return;
}

if (currentTransaction.type === 'receive') {
player.balance += amount;
} else {
if (player.balance < amount) {
    alert('Insufficient funds!');
    return;
}
player.balance -= amount;
}

updatePlayersDisplay();
cancelTransaction();
}


function payAllPlayers() {
const amount = parseInt(prompt('Enter amount to pay to each player:'));
if (!amount || isNaN(amount)) return;

const playerName = prompt('Enter paying player name:');
const payingPlayer = players.find(p => p.name.toLowerCase() === playerName.toLowerCase());

if (payingPlayer) {
const totalAmount = amount * (players.length - 1);
if (payingPlayer.balance >= totalAmount) {
    players.forEach(player => {
        if (player !== payingPlayer) {
            player.balance += amount;
        }
    });
    payingPlayer.balance -= totalAmount;
    updatePlayersDisplay();
    alert(`${payingPlayer.name} paid Rs;${amount} to each player`);
} else {
    alert('Insufficient funds!');
}
} else {
alert('Player not found!');
}
}

function showPlayerTransactionModal() {
    const modal = document.createElement('div');
    modal.id = 'playerTransactionModal';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;';
   
    const modalContent = document.createElement('div');
    modalContent.className = 'transaction-modal';
    modalContent.style.cssText = 'background-color: white; padding: 25px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); width: 400px; max-width: 90%;';

    modalContent.innerHTML = `
        <h2 class="modal-title" style="text-align: center; margin-bottom: 20px; color:rgb(255, 2, 2);">Player Transaction</h2>
        
        <div class="modal-input" style="margin-bottom: 20px;">
            <label for="fromPlayerSelect" style="display: block; margin-bottom: 8px; font-weight: 500;">From Player:</label>
            <select id="fromPlayerSelect" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #ddd;">
                ${players.map(player => `<option value="${player.id}">${player.name} - Rs. ${player.balance}</option>`).join('')}
            </select>
        </div>
        
        <div class="modal-input" style="margin-bottom: 20px;">
            <label for="toPlayerSelect" style="display: block; margin-bottom: 8px; font-weight: 500;">To Player:</label>
            <select id="toPlayerSelect" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #ddd;">
                ${players.map(player => `<option value="${player.id}">${player.name} - Rs. ${player.balance}</option>`).join('')}
            </select>
        </div>
        
        <div class="modal-input" style="margin-bottom: 20px;">
            <label for="playerTransactionAmount" style="display: block; margin-bottom: 8px; font-weight: 500;">Amount:</label>
            <input type="number" id="playerTransactionAmount" min="1" placeholder="Enter amount" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #ddd;">
        </div>
        
        <div class="modal-input" style="margin-bottom: 20px;">
            <label for="transactionReason" style="display: block; margin-bottom: 8px; font-weight: 500;">Reason (optional):</label>
            <input type="text" id="transactionReason" placeholder="Rent, Trade, etc." style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #ddd;">
        </div>
        
        <div class="modal-actions" style="display: flex; justify-content: flex-end; gap: 15px;">
            <button onclick="cancelPlayerTransaction()" style="padding: 10px 15px;"><i class="fas fa-times"></i> Cancel</button>
            <button onclick="confirmPlayerTransaction()" style="padding: 10px 15px;"><i class="fas fa-check"></i> Transfer</button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    if (players.length > 1) {
        document.getElementById('toPlayerSelect').selectedIndex = 1;
    }
}

function cancelPlayerTransaction() {
    const modal = document.getElementById('playerTransactionModal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

function confirmPlayerTransaction() {
    const fromPlayerId = document.getElementById('fromPlayerSelect').value;
    const toPlayerId = document.getElementById('toPlayerSelect').value;
    const amount = parseInt(document.getElementById('playerTransactionAmount').value);
    const reason = document.getElementById('transactionReason').value;
    
    if (fromPlayerId === toPlayerId) {
        alert('Cannot transfer money to the same player');
        return;
    }
    
    if (!amount || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    const fromPlayer = players.find(p => p.id === fromPlayerId);
    const toPlayer = players.find(p => p.id === toPlayerId);
    
    if (!fromPlayer || !toPlayer) {
        alert('Invalid player selection');
        return;
    }
    
    if (fromPlayer.balance < amount) {
        alert(`${fromPlayer.name} does not have enough money for this transaction`);
        return;
    }
    
    fromPlayer.balance -= amount;
    toPlayer.balance += amount;
    
    const reasonText = reason ? ` for ${reason}` : '';
    alert(`${fromPlayer.name} paid Rs. ${amount} to ${toPlayer.name}${reasonText}`);
    
    updatePlayersDisplay();
    cancelPlayerTransaction();
}

// Add function to pay bank 
function payBank() {
    const modal = document.createElement('div');
    modal.id = 'payBankModal';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'transaction-modal';
    modalContent.style.cssText = 'background-color: white; padding: 25px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); width: 400px; max-width: 90%;';
    
    modalContent.innerHTML = `
        <h2 class="modal-title" style="text-align: center; margin-bottom: 20px; color:rgb(255, 0, 0);">Pay to Bank</h2>
        
        <div class="modal-input" style="margin-bottom: 20px;">
            <label for="playerSelectBank" style="display: block; margin-bottom: 8px; font-weight: 500;">Player:</label>
            <select id="playerSelectBank" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #ddd;">
                ${players.map(player => `<option value="${player.id}">${player.name} - &#8377;${player.balance}</option>`).join('')}
            </select>
        </div>
        
        <div class="modal-input" style="margin-bottom: 20px;">
            <label for="bankPaymentAmount" style="display: block; margin-bottom: 8px; font-weight: 500;">Amount:</label>
            <input type="number" id="bankPaymentAmount" min="1" placeholder="Enter amount" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #ddd;">
        </div>
        
        <div class="modal-input" style="margin-bottom: 20px;">
            <label for="bankPaymentReason" style="display: block; margin-bottom: 8px; font-weight: 500;">Reason:</label>
            <select id="bankPaymentReason" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #ddd;">
                <option value="Tax">Income Tax</option>
                <option value="Chance">Chance Card</option>
                <option value="Community">Community Chest</option>
                <option value="Repairs">Property Repairs</option>
                <option value="Luxury">Luxury Tax</option>
                <option value="Other">Other</option>
            </select>
        </div>
        
        <div class="modal-actions" style="display: flex; justify-content: flex-end; gap: 15px;">
            <button onclick="cancelBankPayment()" style="padding: 10px 15px;"><i class="fas fa-times"></i> Cancel</button>
            <button onclick="confirmBankPayment()" style="padding: 10px 15px;"><i class="fas fa-check"></i> Pay</button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

// Function to cancel bank payment
function cancelBankPayment() {
    const modal = document.getElementById('payBankModal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

// Function to confirm bank payment
function confirmBankPayment() {
    const playerId = document.getElementById('playerSelectBank').value;
    const amount = parseInt(document.getElementById('bankPaymentAmount').value);
    const reason = document.getElementById('bankPaymentReason').value;
    
    if (!amount || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    const player = players.find(p => p.id === playerId);
    
    if (!player) {
        alert('Invalid player selection');
        return;
    }
    
    // Check if player has enough funds
    if (player.balance < amount) {
        alert(`${player.name} does not have enough money`);
        return;
    }
    player.balance -= amount;
    
    alert(`${player.name} paid Rs. ${amount} to the bank for ${reason}`);
    
    updatePlayersDisplay();
    cancelBankPayment();
}

// Function to handle property rent payments
function payRent(propertyName) {
    const property = properties.find(p => p.name === propertyName);
    
    if (!property || !property.owner) {
        alert('This property is not owned by any player');
        return;
    }
    
    const owner = players.find(p => p.name === property.owner);
    
    if (!owner) {
        alert('Property owner not found in the game');
        return;
    }
    const modal = document.createElement('div');
    modal.id = 'rentPaymentModal';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'transaction-modal';
    modalContent.style.cssText = 'background-color: white; padding: 25px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); width: 400px; max-width: 90%;';
    
    const potentialPayers = players.filter(p => p.name !== owner.name);
    
    modalContent.innerHTML = `
        <h2 class="modal-title" style="text-align: center; margin-bottom: 20px; color:rgb(255, 0, 0);">Pay Rent for ${property.name}</h2>
        
        <div style="margin-bottom: 15px; padding: 10px; background-color: ${property.color}; color: white; border-radius: 8px; text-align: center;">
            <p style="margin: 0;">Property Owner: ${owner.name}</p>
            <p style="margin: 5px 0 0 0; font-size: 1.2em; font-weight: bold;">Rent: &#8377;${property.rent}</p>
        </div>
        
        <div class="modal-input" style="margin-bottom: 20px;">
            <label for="rentPayerSelect" style="display: block; margin-bottom: 8px; font-weight: 500;">Paying Player:</label>
            <select id="rentPayerSelect" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #ddd;">
                ${potentialPayers.map(player => `<option value="${player.id}">${player.name} - &#8377;${player.balance}</option>`).join('')}
            </select>
        </div>
        
        <div class="modal-actions" style="display: flex; justify-content: flex-end; gap: 15px;">
            <button onclick="cancelRentPayment()" style="padding: 10px 15px;"><i class="fas fa-times"></i> Cancel</button>
            <button onclick="confirmRentPayment('${propertyName}')" style="padding: 10px 15px;"><i class="fas fa-check"></i> Pay Rent</button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

// Function to cancel rent payment
function cancelRentPayment() {
    const modal = document.getElementById('rentPaymentModal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

// Function to confirm rent payment
function confirmRentPayment(propertyName) {
    const property = properties.find(p => p.name === propertyName);
    const payerId = document.getElementById('rentPayerSelect').value;
    const payer = players.find(p => p.id === payerId);
    const owner = players.find(p => p.name === property.owner);
    
    if (!payer || !owner || !property) {
        alert('Invalid transaction details');
        return;
    }
    if (payer.balance < property.rent) {
        alert(`${payer.name} does not have enough money to pay rent`);
        return;
    }
    
    payer.balance -= property.rent;
    owner.balance += property.rent;
    
    alert(`${payer.name} paid Rs. ${property.rent} rent to ${owner.name} for ${property.name}`);
    
    updatePlayersDisplay();
    cancelRentPayment();
}

// Update the property display to include a "Pay Rent" button
function updatePropertyDisplay() {
    const container = document.getElementById('propertiesContainer');
    container.innerHTML = '';

    const groupedProperties = properties.reduce((acc, prop) => {
        if (!acc[prop.group]) {
            acc[prop.group] = [];
        }
        acc[prop.group].push(prop);
        return acc;
    }, {});

    Object.entries(groupedProperties).forEach(([group, props]) => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'property-group';
        groupDiv.style.cssText = 'border-radius: 10px; padding: 15px; box-shadow: 0 4px 8px rgba(0,0,0,0.05); background-color: white; margin-bottom: 20px;';
        
        const groupColor = props[0].color;
        
        let groupHtml = `
            <div class="property-group-header" style="padding: 8px; border-radius: 8px; margin-bottom: 15px; text-align: center; font-weight: bold; color: white; background-color: ${groupColor};">
                ${group}
            </div>
        `;
        
        props.forEach(prop => {
            let ownerInfo = 'Bank';
            let rentButton = '';
            
            if (prop.owner) {
                ownerInfo = prop.owner;
                rentButton = `<button onclick="payRent('${prop.name}')" style="padding: 5px 10px; font-size: 0.9rem; margin-top: 5px;"><i class="fas fa-hand-holding-usd"></i> Pay Rent</button>`;
            }
            
            groupHtml += `
                <div class="property-item" style="padding: 10px; margin: 8px 0; border-radius: 8px; background-color: #f9f9f9; border-left: 3px solid ${prop.color};">
                    <div style="margin-bottom: 5px;">
                        <strong>${prop.name}</strong>
                        <div style="display: flex; justify-content: space-between; margin-top: 5px;">
                            <span>Price: &#8377;${prop.price}</span>
                            <span>Rent: &#8377;${prop.rent}</span>
                        </div>
                        <div style="margin-top: 8px;">
                            <span>Owner: <strong>${ownerInfo}</strong></span>
                        </div>
                    </div>
                    ${rentButton}
                </div>
            `;
        });

        groupDiv.innerHTML = groupHtml;
        container.appendChild(groupDiv);
    });
}

// Update the action buttons in the HTML to include the new transaction button
function updateActionButtons() {
    const actionButtons = document.querySelector('.action-buttons');
    
    // Check if action buttons exist and the transaction button doesn't already exist
    if (actionButtons && !document.getElementById('playerTransactionBtn')) {
        const transactionButton = document.createElement('div');
        transactionButton.className = 'action-button';
        transactionButton.id = 'playerTransactionBtn';
        transactionButton.onclick = showPlayerTransactionModal;
        transactionButton.innerHTML = `
            <i class="fas fa-exchange-alt"></i>
            <span>Player Transaction</span>
        `;
        
        actionButtons.appendChild(transactionButton);
    }
}

// Update existing function to include our new button
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initializeProperties();
    updatePropertyDisplay();
    updateActionButtons();
});

// Modify existing functions to maintain compatibility
function removePlayer(playerId) {
    players = players.filter(p => p.id !== playerId);
    updatePlayersDisplay();
    saveData(); // Save data to LocalStorage
}

// Add this function to reset local data
const PRESET_PASSKEY = "0000";

// Function to show the passkey modal
function showPasskeyModal() {
    const modal = document.createElement('div');
    modal.id = 'passkeyModal';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;';

    const modalContent = document.createElement('div');
    modalContent.className = 'passkey-modal';
    modalContent.style.cssText = 'background-color: white; padding: 25px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); width: 400px; max-width: 90%;';

    modalContent.innerHTML = `
        <h2 class="modal-title" style="text-align: center; margin-bottom: 20px; color:rgb(255, 0, 0);">Reset Data</h2>
        <div class="modal-input" style="margin-bottom: 20px;">
            <label for="passkeyInput" style="display: block; margin-bottom: 8px; font-weight: 500;">Enter Passkey:</label>
            <input type="password" id="passkeyInput" placeholder="Enter passkey" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #ddd;">
        </div>
        <div class="modal-actions" style="display: flex; justify-content: flex-end; gap: 15px;">
            <button onclick="cancelPasskeyModal()" style="padding: 10px 15px;"><i class="fas fa-times"></i> Cancel</button>
            <button onclick="confirmPasskey()" style="padding: 10px 15px;"><i class="fas fa-check"></i> Confirm</button>
        </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

// Function to cancel the passkey modal
function cancelPasskeyModal() {
    const modal = document.getElementById('passkeyModal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

// Function to confirm the passkey and reset data
function confirmPasskey() {
    const passkeyInput = document.getElementById('passkeyInput').value;

    if (passkeyInput === PRESET_PASSKEY) {
        resetLocalData();
        cancelPasskeyModal(); 
    } else {
        alert('Incorrect passkey! Data was not reset.');
    }
}

// Function to reset local data
function resetLocalData() {

    localStorage.removeItem('monopolyPlayers');
    localStorage.removeItem('monopolyProperties');

    players = [];
    properties = [];

    initializeProperties();

    updatePlayersDisplay();
    updatePropertyDisplay();

    alert('Local data has been reset successfully!');
}

function resetDataWithPasskey() {
    showPasskeyModal();
}
