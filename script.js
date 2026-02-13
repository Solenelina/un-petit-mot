const poem = [
    [
        "Même si je te le dis tout le temps,",
        "je préfère me répéter,",
        "je t'aime Hansi."
    ],
    [
        "Passionnément.",
        "A la folie.",
        "Je ne sais pas…"
    ],
    [
        "Mais quand je te vois,",
        "mon coeur s'emballe,",
        "mes yeux pétillent,",
        "et tout me paraît plus léger, plus simple."
    ],
    [
        "Il n'y a qu'avec toi que j'aime me poser,",
        "ne rien faire,",
        "collée contre ton corps,",
        "accrochée à ton bras."
    ],
    [
        "Avec toi, je suis posée.",
        "Comme si plus rien d'autre n'existait."
    ],
    [
        "Et en même temps,",
        "j'ai encore tellement de choses à découvrir avec toi.",
        "Tellement de premières fois à vivre."
    ],
    [
        "Quand je repense à cette première fois où on s'est vus,",
        "des patatas bravas devant un coucher de soleil…",
        "Je trouve que ça nous ressemble."
    ],
    [
        "Simple.",
        "Chaleureux.",
        "Un peu inattendu."
    ],
    [
        "Je t'aime, Hansi.",
        "Je t'aime, je t'admire, je te désire."
    ],
    [
        "Je suis fière de toi.",
        "Fière de nous.",
        "Fière de ce qu'on construit."
    ],
    [
        "Et peu importe la distance,",
        "peu importe le temps,",
        "je te choisis."
    ],
    [
        "Aujourd'hui, et pour toutes les fois à venir."
    ]
];

let currentStanza = 0;
let currentLine = 0;
const poemContainer = document.getElementById('poem-container');
const instruction = document.getElementById('instruction');

function displayNextLine() {
    if (currentStanza >= poem.length) return;

    const stanza = poem[currentStanza];

    if (currentLine < stanza.length) {
        // Create and show the new line
        const lineElement = document.createElement('p');
        lineElement.innerText = stanza[currentLine];
        lineElement.classList.add('poem-line');
        poemContainer.appendChild(lineElement);

        // Trigger reflow for animation
        void lineElement.offsetWidth;
        lineElement.classList.add('visible');

        currentLine++;
    } else {
        // End of stanza, wait for one more click to clear and start next
        // Or we could auto-clear? Let's clear on next click.
        // Actually, let's detect if we are just finishing a stanza.
        // If we are at the end, the NEXT click should clear.

        // Wait, the user clicks to see lines.
        // When all lines are shown:
        // Click -> Clear screen -> Show first line of next stanza.

        currentStanza++;
        currentLine = 0;

        if (currentStanza < poem.length) {
            poemContainer.innerHTML = ''; // Clear previous stanza
            displayNextLine(); // Immediately show first line of next stanza
        } else {
            // End of poem
            const endElement = document.createElement('p');
            endElement.innerText = "Joyeuse Saint Valentin Hansi ! ❤️";
            endElement.style.fontSize = "3rem";
            endElement.style.marginTop = "2rem";
            endElement.classList.add('poem-line', 'visible');
            poemContainer.appendChild(endElement);
            instruction.style.display = 'none';
            document.removeEventListener('click', displayNextLine);
            document.removeEventListener('keydown', handleKey);
        }
    }
}

function handleKey(e) {
    if (e.code === 'Space' || e.code === 'Enter') {
        displayNextLine();
    }
}

document.addEventListener('click', displayNextLine);
document.addEventListener('keydown', handleKey);

// Initial start logic - maybe wait for first click?
// Or start with first line?
// "on efface tout, et on affiche" -> Start with blank, then click to start?
// Let's show the first line immediately or wait?
// "Instruction: cliquer pour continuer" suggests wait.
// Let's wait for first click.
