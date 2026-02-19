// ====================================================
// PUB/BAR/LOUNGE - Calculateur de consos
// Logo unique : Logo7.png, fonds aléatoires, 7 sons
// ====================================================

let persons = [];
let nextPersonId = 1;
let alertEnabled = true;
let selectedSound = 'alarm1.mp3';
let drinks = [];

const randomNames = [
    'Alcoolique 2', 'Puit sans fond 3', 'L\'inflammable 4', 'Jefff 5',
    'La Momie 6', 'Lara 7', 'pochtron 8', 'bois sans soif 9', 'Sifflard 10',
    'Barjo 11', 'Gargamel 12', 'Obelix 13', 'Nécessiteux 14'
];

// Références DOM
const personsContainer = document.getElementById('personsContainer');
const grandTotalSpan = document.getElementById('grandTotalDisplay');
const totalGlassesSpan = document.getElementById('totalGlassesCount');
const totalPersonsSpan = document.getElementById('totalPersonsCount');
const alertEnabledCheck = document.getElementById('alertEnabled');
const soundSelect = document.getElementById('soundSelect');
const stopSoundBtn = document.getElementById('stopSoundBtn');
const addPersonBtn = document.getElementById('addPersonBtn');
const addDrinkBtn = document.getElementById('addDrinkBtn');
const resetDrinksBtn = document.getElementById('resetDrinksBtn');
const drinkNameInput = document.getElementById('drinkName');
const drinkPriceInput = document.getElementById('drinkPrice');
const drinksListDiv = document.getElementById('drinksList');
const canvas = document.getElementById('logoCanvas');
const themeToggle = document.getElementById('themeToggle');
const globalAlertDisplay = document.getElementById('globalAlertDisplay');
const infoBtn = document.getElementById('infoBtn');
const infoPopup = document.getElementById('infoPopup');
const closePopup = document.querySelector('.close-popup');

window.alertTriggered = false;
window.audioElement = null;

// ---------- FOND D'ÉCRAN ALÉATOIRE ----------
function setRandomBackground() {
    const num = Math.floor(Math.random() * 7) + 1; // 1 à 7
    document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('assets/images/BGPub${num}.png')`;
}
setRandomBackground();

// ---------- PERSISTANCE ----------
function saveToLocalStorage() {
    const state = {
        persons,
        nextPersonId,
        alertEnabled,
        selectedSound,
        drinks
    };
    localStorage.setItem('pubConsoState', JSON.stringify(state));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('pubConsoState');
    if (saved) {
        try {
            const state = JSON.parse(saved);
            persons = state.persons || [];
            nextPersonId = state.nextPersonId || 1;
            alertEnabled = state.alertEnabled !== undefined ? state.alertEnabled : true;
            selectedSound = state.selectedSound || 'alarm1.mp3';
            drinks = state.drinks || [];

            alertEnabledCheck.checked = alertEnabled;
            soundSelect.value = selectedSound;
        } catch (e) {
            console.warn('Erreur de chargement', e);
            initDefaultState();
        }
    } else {
        initDefaultState();
    }
}

function initDefaultState() {
    persons = [createRandomPerson()];
    nextPersonId = 2;
    drinks = [];
}

function createRandomPerson() {
    const randomIndex = Math.floor(Math.random() * randomNames.length);
    const name = randomNames[randomIndex];
    return {
        id: nextPersonId++,
        name: name,
        threshold: 30.0,
        consumptions: [],
        muted: false
    };
}

// ---------- CALCULS ----------
function calculatePersonTotal(person) {
    return person.consumptions.reduce((sum, c) => sum + (parseFloat(c.price) || 0), 0);
}
function calculateGrandTotal() {
    return persons.reduce((sum, p) => sum + calculatePersonTotal(p), 0);
}
function calculateTotalGlasses() {
    return persons.reduce((sum, p) => sum + p.consumptions.length, 0);
}

// ---------- RENDU ----------
function render() {
    personsContainer.innerHTML = '';
    persons.forEach(p => personsContainer.appendChild(createPersonCard(p)));
    updateStats();
    checkThresholdAndAlert();
    saveToLocalStorage();
}

function updateStats() {
    grandTotalSpan.textContent = calculateGrandTotal().toFixed(2) + ' €';
    totalGlassesSpan.textContent = calculateTotalGlasses();
    totalPersonsSpan.textContent = persons.length;
    if (persons.length > 0) {
        const seuils = persons.map(p => p.threshold.toFixed(2)).join(' / ');
        globalAlertDisplay.textContent = `${seuils} € par personne`;
    } else {
        globalAlertDisplay.textContent = '30 € par personne';
    }
}

// ---------- CARTE PERSONNE ----------
function createPersonCard(person) {
    const card = document.createElement('div');
    card.className = 'person-card';
    card.dataset.personId = person.id;

    const header = document.createElement('div');
    header.className = 'person-header';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'person-name-input';
    nameInput.value = person.name;
    nameInput.addEventListener('input', () => {
        person.name = nameInput.value;
        saveToLocalStorage();
    });

    const thresholdInput = document.createElement('input');
    thresholdInput.type = 'number';
    thresholdInput.className = 'person-threshold';
    thresholdInput.value = person.threshold;
    thresholdInput.step = '0.5';
    thresholdInput.min = '0';
    thresholdInput.addEventListener('input', (e) => {
        person.threshold = parseFloat(e.target.value) || 0;
        updateStats();
        checkThresholdAndAlert();
        saveToLocalStorage();
    });

    // Bouton mute
    const muteBtn = document.createElement('button');
    muteBtn.className = 'mute-button';
    muteBtn.innerHTML = person.muted ? '🔇' : '🔊';
    muteBtn.title = person.muted ? 'Activer le son' : 'Couper le son';
    muteBtn.addEventListener('click', () => {
        person.muted = !person.muted;
        muteBtn.innerHTML = person.muted ? '🔇' : '🔊';
        muteBtn.title = person.muted ? 'Activer le son' : 'Couper le son';
        checkThresholdAndAlert();
        saveToLocalStorage();
    });

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-person';
    removeBtn.innerHTML = '🗑️';
    removeBtn.addEventListener('click', () => {
        persons = persons.filter(p => p.id !== person.id);
        render();
    });

    header.appendChild(nameInput);
    header.appendChild(thresholdInput);
    header.appendChild(muteBtn);
    header.appendChild(removeBtn);

    const stats = document.createElement('div');
    stats.className = 'person-stats';
    stats.innerHTML = `<span>🍺 ${person.consumptions.length} verres</span>`;

    // Regroupement des consommations
    const grouped = {};
    person.consumptions.forEach(c => {
        const key = `${c.name}|${c.price}`;
        if (!grouped[key]) grouped[key] = { name: c.name, price: c.price, count: 1 };
        else grouped[key].count++;
    });

    const consoGroupList = document.createElement('ul');
    consoGroupList.className = 'conso-group-list';
    Object.values(grouped).forEach(g => {
        const li = document.createElement('li');
        li.className = 'conso-group-item';
        li.innerHTML = `
            <div class="conso-info">
                <span class="conso-badge">${g.count}</span>
                <span class="conso-name">${escapeHTML(g.name)}</span>
                <span class="conso-price">${g.price.toFixed(2)} €</span>
            </div>
            <div class="conso-actions">
                <button class="minus" title="Retirer un">−</button>
                <button class="plus" title="Ajouter un">+</button>
            </div>
        `;
        li.querySelector('.plus').addEventListener('click', () => {
            addConsumption(person.id, g.name, g.price);
        });
        li.querySelector('.minus').addEventListener('click', () => {
            removeOneConsumption(person.id, g.name, g.price);
        });
        consoGroupList.appendChild(li);
    });

    // Boutons rapides (boissons de la carte)
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'person-actions';
    drinks.forEach(drink => {
        const btn = document.createElement('button');
        btn.className = 'btn-small';
        btn.textContent = `+ ${drink.name}`;
        btn.addEventListener('click', () => addConsumption(person.id, drink.name, drink.price));
        actionsDiv.appendChild(btn);
    });

    const undoBtn = document.createElement('button');
    undoBtn.className = 'btn-small';
    undoBtn.textContent = '↩ Annuler dernier';
    undoBtn.addEventListener('click', () => {
        if (person.consumptions.length > 0) {
            person.consumptions.pop();
            render();
        }
    });
    actionsDiv.appendChild(undoBtn);

    const totalDiv = document.createElement('div');
    totalDiv.className = 'person-total';
    totalDiv.textContent = `Total : ${calculatePersonTotal(person).toFixed(2)} €`;

    card.appendChild(header);
    card.appendChild(stats);
    card.appendChild(consoGroupList);
    card.appendChild(actionsDiv);
    card.appendChild(totalDiv);

    return card;
}

function escapeHTML(str) {
    return String(str).replace(/[&<>"]/g, m => {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        if (m === '"') return '&quot;';
        return m;
    });
}

// ---------- GESTION CONSOMMATIONS ----------
function addConsumption(personId, name, price) {
    const person = persons.find(p => p.id === personId);
    if (!person) return;
    person.consumptions.push({ name, price: parseFloat(price) });
    render();
}
function removeOneConsumption(personId, name, price) {
    const person = persons.find(p => p.id === personId);
    if (!person) return;
    const idx = person.consumptions.findIndex(c => c.name === name && c.price === price);
    if (idx !== -1) {
        person.consumptions.splice(idx, 1);
        render();
    }
}

// ---------- GESTION CARTE BOISSONS ----------
function renderDrinksList() {
    drinksListDiv.innerHTML = '';
    drinks.forEach((drink, index) => {
        const drinkDiv = document.createElement('div');
        drinkDiv.className = 'drink-item';
        drinkDiv.innerHTML = `
            <span>${drink.name} – ${drink.price.toFixed(2)} €</span>
            <button class="delete-drink" data-index="${index}">🗑️</button>
        `;
        drinkDiv.querySelector('.delete-drink').addEventListener('click', () => {
            drinks.splice(index, 1);
            renderDrinksList();
            saveToLocalStorage();
            render();
        });
        drinksListDiv.appendChild(drinkDiv);
    });
}

addDrinkBtn.addEventListener('click', () => {
    const name = drinkNameInput.value.trim();
    const price = parseFloat(drinkPriceInput.value);
    if (name && !isNaN(price) && price >= 0) {
        drinks.push({ name, price });
        drinkNameInput.value = '';
        drinkPriceInput.value = '';
        renderDrinksList();
        saveToLocalStorage();
        render();
    }
});

resetDrinksBtn.addEventListener('click', () => {
    drinks = [];
    renderDrinksList();
    saveToLocalStorage();
    render();
});

// ---------- ALERTE (avec mute) ----------
function checkThresholdAndAlert() {
    if (!alertEnabled) {
        window.alertTriggered = false;
        return;
    }
    let shouldAlert = false;
    for (let p of persons) {
        if (!p.muted && calculatePersonTotal(p) >= p.threshold) {
            shouldAlert = true;
            break;
        }
    }
    if (shouldAlert && !window.alertTriggered) {
        playSound(selectedSound);
        window.alertTriggered = true;
    } else if (!shouldAlert) {
        window.alertTriggered = false;
    }
}

function playSound(file) {
    if (window.audioElement) {
        window.audioElement.pause();
        window.audioElement.currentTime = 0;
    }
    const path = `assets/sound/${file}`;
    window.audioElement = new Audio(path);
    window.audioElement.play().catch(e => {
        console.error('Erreur lecture son:', e);
    });
}

// Bouton Stop : arrête le son et réarme l'alerte
stopSoundBtn.addEventListener('click', () => {
    if (window.audioElement) {
        window.audioElement.pause();
        window.audioElement.currentTime = 0;
    }
    window.alertTriggered = false;
});

alertEnabledCheck.addEventListener('change', (e) => {
    alertEnabled = e.target.checked;
    window.alertTriggered = false;
    checkThresholdAndAlert();
    saveToLocalStorage();
});

soundSelect.addEventListener('change', (e) => {
    selectedSound = e.target.value;
    saveToLocalStorage();
});

// ---------- LOGO (unique Logo7.png) avec amélioration qualité ----------
function drawLogo() {
    const ctx = canvas.getContext('2d');
    // Activer le lissage haute qualité
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const img = new Image();
    img.src = 'assets/images/Logo7.png';

    img.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Remplir le canvas en conservant le ratio
        const ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
        const w = img.width * ratio;
        const h = img.height * ratio;
        const x = (canvas.width - w) / 2;
        const y = (canvas.height - h) / 2;
        ctx.drawImage(img, x, y, w, h);
    };

    img.onerror = function() {
        console.error('Logo7.png introuvable. Vérifiez le chemin assets/images/Logo7.png');
        // Dessiner un logo de secours
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'var(--gold)';
        ctx.beginPath();
        ctx.arc(canvas.width/2, canvas.height/2, 50, 0, 2*Math.PI);
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Logo', canvas.width/2, canvas.height/2);
    };
}

// ---------- THÈME ----------
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    themeToggle.textContent = document.body.classList.contains('light-mode') ? '🌑' : '🌓';
});

// ---------- POPUP INFO ----------
infoBtn.addEventListener('click', () => {
    infoPopup.classList.add('show');
});

closePopup.addEventListener('click', () => {
    infoPopup.classList.remove('show');
});

window.addEventListener('click', (e) => {
    if (e.target === infoPopup) {
        infoPopup.classList.remove('show');
    }
});

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    renderDrinksList();
    render();
    drawLogo();

    addPersonBtn.addEventListener('click', () => {
        persons.push(createRandomPerson());
        render();
    });
});