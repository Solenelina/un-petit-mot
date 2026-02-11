const ACTS = {
    NORMAL: 0,
    DENIAL: 1,
    DRUNK: 2,
    CLINGY: 3,
    CHAOS: 4,
    REVEAL: 5,
    REJECTION_SILENCE: 6,
    REJECTION_DOUBT: 7,
    REJECTION_CHAOS: 8,
    REJECTION_META: 9,
    REJECTION_ACCEPTANCE: 10
};

const STATE = {
    current: ACTS.NORMAL,
    interactions: 0,
    refusalCount: 0
};

// DOM Elements
const mainText = document.getElementById('main-text');
const subText = document.getElementById('sub-text');
const actionBtn = document.getElementById('action-btn');
const app = document.getElementById('app');
const overlayLayer = document.getElementById('overlay-layer');

// Texts
const TEXTS = {
    denial: [
        "C'est peut-être trop tôt...",
        "J'ai peur de tout gâcher.",
        "Et si on restait comme avant ?",
        "Je ne suis pas très douée pour ça.",
        "C'est plus dur que je pensais.",
        "J'ai le cœur qui bat trop vite.",
        "Et si je me taisais ?"
    ],
    clingy: [
        "Attends, s'il te plaît...",
        "Hansi, reste avec moi...",
        "C'est trop, j'y arrive pas.",
        "J'ai besoin de te le dire.",
        "Ne pars pas maintenant.",
        "Écoute-moi...",
        "C'est important.",
        "Juste une seconde.",
        "Promis, j'arrête de trembler."
    ],
    chaos: [
        "J'essAAie de tOuteS mes fOrces...",
        "Pardon c'est le strEss...",
        "Je vEux juste être hOnnête...",
        "Ne fais pas aTTention au bOrdel...",
        "ERROR 404: CALM NOT FOUND"
    ]
};

// State Machine logic
function nextState() {
    STATE.current++;
    updateView();
}

function handleInteraction() {
    STATE.interactions++;

    if (STATE.current === ACTS.NORMAL) {
        nextState();
    } else if (STATE.current === ACTS.DENIAL) {
        moveButton();
        triggerChaos();
        if (STATE.interactions > 5) {
            nextState();
            STATE.interactions = 0;
        }
    } else if (STATE.current === ACTS.DRUNK) {
        if (STATE.interactions > 8) {
            nextState();
            STATE.interactions = 0;
        } else {
            triggerChaos();
        }
    } else if (STATE.current === ACTS.CLINGY) {
        createPopup();
        if (STATE.interactions > 10) {
            nextState();
            STATE.interactions = 0;
        }
    } else if (STATE.current === ACTS.CHAOS) {
        triggerChaos();
        if (STATE.interactions > 15) {
            nextState();
        }
    } else if (STATE.current === ACTS.REVEAL) {
        // Already revealed, buttons handled locally
    }
}

function updateView() {
    switch (STATE.current) {
        case ACTS.NORMAL:
            break;
        case ACTS.DENIAL:
            mainText.innerText = "Hum... 😖";
            subText.innerText = "J'avais préparé un discours, mais je panique un peu.";
            actionBtn.innerText = "Dis le";
            break;
        case ACTS.DRUNK:
            mainText.innerText = "Je gère.";
            subText.innerText = "Enfin... je crois ? Non, en fait j'ai peur.";
            actionBtn.innerText = "Courage...";
            document.body.classList.add('drunk-1');
            mainText.classList.add('drunk-2');
            break;
        case ACTS.CLINGY:
            mainText.innerText = "Attends !";
            subText.innerText = "C'est juste que... tu comptes beaucoup pour moi.";
            actionBtn.innerText = "Je t'écoute";
            document.body.classList.remove('drunk-1');
            document.body.classList.add('drunk-2');
            break;
        case ACTS.CHAOS:
            mainText.innerText = "Pardon.";
            subText.innerText = "Je voulais faire un truc parfait, mais je suis juste maladroite.";
            actionBtn.innerText = "Ça va aller";
            document.body.classList.add('chaos-mode');
            mainText.classList.add('glitch-text');
            break;
        case ACTS.REVEAL:
            // RESET & CRASH SIMULATION
            document.body.className = ''; // Remove all chaos classes
            document.body.style.filter = ''; // Remove chaos filters
            overlayLayer.innerHTML = ''; // Kill popups

            // Hide content to simulate crash/reboot
            const contentDiv = document.querySelector('.content');
            contentDiv.style.visibility = 'hidden';

            // REBOOT ANIMATION
            const rebootOverlay = document.createElement('div');
            rebootOverlay.className = 'reboot-overlay';
            rebootOverlay.innerHTML = `
                <div>> SYSTEM_CRITICAL_ERROR</div>
                <div>> RESTORING EMOTIONAL CORE...</div>
                <div class="loading-bar"><div class="loading-fill"></div></div>
            `;
            document.body.appendChild(rebootOverlay);

            setTimeout(() => {
                rebootOverlay.remove();

                // REBOOT / REVEAL
                contentDiv.style.visibility = 'visible';
                mainText.className = '';

                // Final Content
                mainText.innerHTML = "Désolée pour tout ce stress.<br>Veux-tu être mon Valentin ?";
                subText.innerText = "J'avais juste très envie que tu dises oui 🥰";

                actionBtn.innerText = "OUI !";
                actionBtn.style.transform = 'none';

                // Create No Button
                const noBtn = document.createElement('button');
                noBtn.innerText = "Non";
                noBtn.className = "btn btn-secondary";
                noBtn.style.marginLeft = "10px";

                // Replace Action Btn to clear listeners
                const newBtn = actionBtn.cloneNode(true);
                actionBtn.parentNode.replaceChild(newBtn, actionBtn);

                // Add No Button locally
                newBtn.parentNode.insertBefore(noBtn, newBtn.nextSibling);

                newBtn.addEventListener('click', () => {
                    enableConfettiMode(newBtn);
                });

                noBtn.addEventListener('click', () => {
                    newBtn.remove();
                    noBtn.remove();
                    startRejectionSequence();
                });
            }, 2000);
            break;

        // Rejection States (Handled by sequence mostly, but defined here for consistency)
        case ACTS.REJECTION_SILENCE:
            mainText.innerHTML = "Ah.";
            subText.innerText = "";
            mainText.style.fontSize = "1.5rem";
            setTimeout(() => {
                subText.innerText = "D'accord.";
                setTimeout(nextState, 3000);
            }, 3000);
            break;

        case ACTS.REJECTION_DOUBT:
            mainText.innerText = '';
            subText.innerText = '';

            // Trigger asynchronous thoughts
            const thoughts = [
                "J'ai mal formulé.",
                "C'était trop ?",
                "Je pensais pourtant...",
                "Peut-être que c'est moi le problème.",
                "Pourquoi je force ?"
            ];

            let delay = 0;
            thoughts.forEach((thought, index) => {
                setTimeout(() => {
                    const el = document.createElement('div');
                    el.className = 'thought';
                    el.innerText = thought;
                    // Fixed positions on sides (no random)
                    const positions = [
                        { left: '10%', top: '20%' },  // Top Left
                        { left: '60%', top: '30%' },  // Top Right
                        { left: '15%', top: '50%' },  // Mid Left
                        { left: '65%', top: '60%' },  // Mid Right
                        { left: '10%', top: '80%' }   // Bot Left
                    ];

                    const pos = positions[index % positions.length];
                    el.style.left = pos.left;
                    el.style.top = pos.top;
                    el.style.fontSize = '1.2rem';
                    overlayLayer.appendChild(el);
                }, delay);
                delay += 1500;
            });

            // Move to Chaos after thoughts
            setTimeout(nextState, delay + 1000);
            break;

        case ACTS.REJECTION_CHAOS:
            document.body.classList.add('body-twist');
            mainText.style.fontSize = ''; // Reset font size

            mainText.innerText = "Pourquoi je voulais absolument avoir ta réponse ?";
            subText.innerText = "Et si aimer, c'était accepter le non ?";

            // Chaos overlay text
            setInterval(() => {
                if (STATE.current !== ACTS.REJECTION_CHAOS) return;
                const chaos = document.createElement('div');
                chaos.innerText = Math.random() > 0.5 ? "Je croyais avoir compris." : "Tout est faux.";
                chaos.style.position = 'fixed';
                chaos.style.left = Math.random() * 100 + 'vw';
                chaos.style.top = Math.random() * 100 + 'vh';
                chaos.style.opacity = 0.3;
                chaos.style.transform = `rotate(${Math.random() * 360}deg)`;
                document.body.appendChild(chaos);
                setTimeout(() => chaos.remove(), 2000);
            }, 200);

            setTimeout(nextState, 6000);
            break;

        case ACTS.REJECTION_META:
            document.body.className = ''; // Stop twist
            document.body.style.backgroundColor = 'black';

            // Remove thoughts immediately when Fatal Error appears
            document.querySelectorAll('.thought').forEach(el => el.remove());

            mainText.className = 'meta-text';
            mainText.innerText = "> FATAL ERROR: SCRIPT_BROKEN";
            subText.className = 'meta-text';
            subText.innerText = "> USER_CHOICE_UNEXPECTED";

            setTimeout(() => {
                mainText.innerText = "Ce site n'était pas supposé faire ça.";
                subText.innerText = "Toi non plus.";
                setTimeout(nextState, 4000);
            }, 2000);
            break;

        case ACTS.REJECTION_ACCEPTANCE:
            // Cleanup thoughts logic
            document.querySelectorAll('.thought').forEach(el => el.remove());

            document.body.style.transition = "all 2s ease";
            document.body.style.backgroundColor = "#f8f9fa";
            mainText.className = '';
            subText.className = '';

            // Step 1: Stabilization / Confirmation
            mainText.innerText = "Merci d'avoir répondu sincèrement.";
            subText.innerHTML = "Es-tu sûr(e) de ton choix ?";

            // Container for buttons
            const btnContainer = document.createElement('div');
            btnContainer.style.display = 'flex';
            btnContainer.style.justifyContent = 'center';
            btnContainer.style.gap = '10px';

            // YES Button (Confirm Rejection)
            // User says "Yes" to "Are you sure?" -> Close/Void
            const sureYesBtn = document.createElement('button');
            sureYesBtn.className = 'btn btn-secondary';
            sureYesBtn.innerText = "Oui.";
            sureYesBtn.addEventListener('click', closeOrVoid);

            // NO Button (Hesitation) -> Leads to N5B
            // User says "No" to "Are you sure?" -> Rebound
            const sureNoBtn = document.createElement('button');
            sureNoBtn.className = 'btn';
            sureNoBtn.innerText = "Non...";
            sureNoBtn.addEventListener('click', () => {
                // STATE N5B: The Bounce
                mainText.innerText = "Attends... peut-être pas...";
                subText.innerText = "Veux-tu être mon Valentin ?";

                btnContainer.innerHTML = ''; // Clear previous buttons

                // Final YES (Confetti Mode)
                const valentinYesBtn = document.createElement('button');
                valentinYesBtn.className = 'btn';
                valentinYesBtn.innerText = "OUI !";
                valentinYesBtn.addEventListener('click', () => {
                    enableConfettiMode(valentinYesBtn);
                });

                // Final NO (Confirm Rejection again)
                const valentinNoBtn = document.createElement('button');
                valentinNoBtn.className = 'btn btn-secondary';
                valentinNoBtn.innerText = "Non, toujours pas.";
                valentinNoBtn.addEventListener('click', closeOrVoid);

                btnContainer.appendChild(valentinYesBtn);
                btnContainer.appendChild(valentinNoBtn);
            });

            btnContainer.appendChild(sureYesBtn);
            btnContainer.appendChild(sureNoBtn);
            app.querySelector('.content').appendChild(btnContainer);
            break;
    }
}

function closeOrVoid() {
    try {
        window.close();
    } catch (e) { console.log(e); }

    // Fallback: The Void
    document.body.innerHTML = '';
    document.body.style.backgroundColor = 'black';
    document.body.style.cursor = 'none';

    const voidText = document.createElement('div');
    voidText.innerText = "Tu peux fermer cette fenêtre maintenant.";
    voidText.style.color = '#333';
    voidText.style.fontFamily = 'monospace';
    voidText.style.marginTop = '20vh';
    voidText.style.textAlign = 'center';
    document.body.appendChild(voidText);
}

function enableConfettiMode(btnElement) {
    // Initial explosion
    launchConfetti();

    // UI Updates
    mainText.innerText = "YOUPI !";
    subText.innerText = "❤️";
    btnElement.innerText = "Encore des confettis !";

    // Remove "No" button if present
    const sibling = btnElement.nextElementSibling;
    if (sibling) sibling.remove();

    // Interaction Logic
    btnElement.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent document click
        launchConfetti();
    });

    document.addEventListener('click', (e) => {
        // Create confetti at click position
        launchConfetti(e.clientX, e.clientY);
    });
}

function startRejectionSequence() {
    STATE.current = ACTS.REJECTION_SILENCE;
    updateView();

    // Sequence Logic for Doubt & Chaos which are timed
    // N2: Doubt (Starts after Silence, triggers N3 automatically)
    // Note: Silence state calls nextState() automatically after timeout
}

// Logic injection for Doubt/Chaos in updateView
// We need to modify updateView to handle the automatic progression for Rejection


function moveButton() {
    const intensity = (STATE.current === ACTS.DENIAL) ? 150 :
        (STATE.current === ACTS.CHAOS) ? 30 : 50;
    const x = (Math.random() - 0.5) * intensity;
    const y = (Math.random() - 0.5) * intensity;
    actionBtn.style.transform = `translate(${x}px, ${y}px)`;
}

function corruptText(text) {
    const chars = text.split('');
    return chars.map(char => {
        if (Math.random() > 0.6) {
            if (char === 'e') return 'ee';
            if (char === 's') return 'z';
            if (char === 'i') return 'ii';
            if (char === '.') return '...';
            if (char === ' ') return '  ';
            if (char === 'a') return '@';
        }
        return char;
    }).join('');
}

function createPopup() {
    const popup = document.createElement('div');
    popup.classList.add('popup');

    // Random position
    const x = Math.random() * (window.innerWidth - 300);
    const y = Math.random() * (window.innerHeight - 200);
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;

    const text = TEXTS.clingy[Math.floor(Math.random() * TEXTS.clingy.length)];

    popup.innerHTML = `
        <h3>Message du système <span style="cursor:pointer" onclick="this.parentElement.parentElement.remove()">x</span></h3>
        <p>${text}</p>
        <button onclick="this.parentElement.remove()">D'accord</button>
        <button onclick="this.parentElement.remove()">Annuler</button>
    `;

    overlayLayer.appendChild(popup);

    setTimeout(() => {
        if (popup.parentElement) popup.remove();
    }, 4000 + Math.random() * 2000);
}

function triggerChaos() {
    if (STATE.current === ACTS.DENIAL) {
        const randomText = TEXTS.denial[Math.floor(Math.random() * TEXTS.denial.length)];
        subText.innerText = randomText;
    } else if (STATE.current === ACTS.DRUNK || STATE.current === ACTS.CHAOS) {
        if (Math.random() > 0.4) {
            mainText.innerText = corruptText(mainText.innerText);
            subText.innerText = corruptText(subText.innerText);
        }

        if (STATE.current === ACTS.CHAOS && Math.random() > 0.7) {
            const chaosText = TEXTS.chaos[Math.floor(Math.random() * TEXTS.chaos.length)];
            subText.innerText = chaosText;
        }

        actionBtn.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
        if (STATE.current === ACTS.CHAOS) {
            document.body.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
        }
    }
}

function launchConfetti(x, y) {
    // Colors: Valentine's Day Palette
    const colors = ['#ff0000', '#ff4d6d', '#ff8fa3', '#fff0f3', '#ffd700', '#ffffff'];

    if (x !== undefined && y !== undefined) {
        // BURST EXPLOSION (Click)
        const particleCount = 30;
        for (let i = 0; i < particleCount; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti', 'burst');
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            confetti.style.left = x + 'px';
            confetti.style.top = y + 'px';

            // Random direction
            const angle = Math.random() * Math.PI * 2;
            const velocity = 50 + Math.random() * 150; // Distance
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            confetti.style.setProperty('--tx', `${tx}px`);
            confetti.style.setProperty('--ty', `${ty}px`);

            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 1000); // Remove after animation
        }
    } else {
        // GLOBAL RAIN (Button)
        const particleCount = 100;
        for (let i = 0; i < particleCount; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti', 'rain');
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            confetti.style.left = Math.random() * 100 + 'vw';
            // Randomize delay and duration for rain
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confetti.style.animationDelay = (Math.random() * 2) + 's'; // Stagger start

            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 6000);
        }
    }
}

// Event Listeners
actionBtn.addEventListener('click', handleInteraction);
actionBtn.addEventListener('mouseover', () => {
    if (STATE.current === ACTS.DENIAL) {
        moveButton();
        STATE.interactions++;
    }
});

// Act 4: Anti-close
document.addEventListener('mouseleave', () => {
    if (STATE.current === ACTS.CLINGY) {
        createPopup();
        createPopup();
        STATE.interactions += 2;
        if (STATE.interactions > 20) {
            nextState();
        }
    }
});


