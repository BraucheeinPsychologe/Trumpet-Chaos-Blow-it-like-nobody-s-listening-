const skinsMenu = document.getElementById("lobby_UI_skins");
const skinsMenuDiv = document.getElementById("lobby_UI_skins_div");
const DragBarHandle = document.getElementById("DragBarHandle");
const DragBar = document.getElementById("DragBar");
const GameField = document.getElementById("game_UI");

let startY = 0;
let startTop = 0;
let inputType = null;
let TickSpeed = localStorage.getItem("numb_gametickspeed");

const skins = [
    { name: "Brass", image: "skins/brass.png", desc: "The Default Trumpet." },
    { name: "Copper", image: "skins/copper.png", desc: "Like the Default one but better." },
    { name: "Gold", image: "skins/gold.png", desc: "You have done well." },
    { name: "Cardboard", image: "skins/cardboard.png", desc: "I hope it dosn't rain today." },
    { name: "Wood", image: "skins/wood.png", desc: "How? just How." },
    { name: "Whistle", image: "skins/whistle.png", desc: "Tight Budget, huh?" }
];

const characters = [
    { name: "Normal Guy", image: "char/normguy.png", desc: "Just a normal guy with a trumpet." },
    { name: "Sad Guy", image: "char/unhappy.png", desc: "He plays jazz... badly." },
    { name: "Another Guy", image: "char/another.png", desc: "He know what he is doing." },
    {
        name: "Invisible Guy",
        image: "char/invis.png",
        desc: "Nobody knows why he is invisible. Wait, why is his glasses not invisble?"
    }
];

const songs = [
    {
        title: "Song of Chaos",
        duration: "1:20",
        difficulty: "Hard",
        file: "songs/braucheeinpsychologe/sogofchaos.json"
    },
    {
        title: "Silent Blow",
        duration: "0:45",
        difficulty: "Easy",
        file: "songs/braucheeinpsychologe/silentblow.json"
    },
    {
        title: "Trumpet Hell",
        duration: "2:00",
        difficulty: "Impossible",
        file: "songs/braucheeinpsychologe/trumpethell.json"
    }
];

document.querySelectorAll("[tooltip]").forEach((el) => {
    const text = el.getAttribute("tooltip");
    el.removeAttribute("tooltip"); // optional, damit kein nativer title erscheint

    const wrapper = document.createElement("span");
    wrapper.classList.add("tooltip-wrapper");

    const tooltip = document.createElement("span");
    tooltip.classList.add("custom-tooltip", "fa-bounce");
    tooltip.textContent = text;

    // Computed Styles des Ursprungs-Elements holen
    const style = window.getComputedStyle(el);
    // Text- und Hintergrundfarbe übernehmen
    tooltip.style.color = style.color;
    tooltip.style.backgroundColor = style.backgroundColor;

    // In den Wrapper einfügen
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
    wrapper.appendChild(tooltip);
});

DragBarHandle.addEventListener("touchstart", function (e) {
    startY = e.touches[0].clientY;
    startTop = parseInt(getComputedStyle(DragBarHandle).top);
});

DragBarHandle.addEventListener("touchmove", function (e) {
    e.preventDefault(); // Scroll verhindern

    const deltaY = e.touches[0].clientY - startY;
    let newTop = startTop + deltaY;

    // Grenzen der Leiste berechnen
    const DragBarHeight = DragBar.clientHeight;
    const DragBarHandleHeight = DragBarHandle.clientHeight;
    const maxTop = DragBarHeight - DragBarHandleHeight;
    newTop = Math.max(0, Math.min(newTop, maxTop)); // Begrenzen

    DragBarHandle.style.top = `${newTop}px`;

    // Optional: Ausgabe der Position (z. B. zur Steuerung)
    const prozent = Math.round((newTop / maxTop) * 100);
     
});

// Funktion um zwischen Maus und Touch zu unterscheiden
function detectInputMethod() {
    window.addEventListener("touchstart", () => {
        inputType = "touch";
         
        // DragBar sichtbar machen
        DragBar.classList.remove("hidden");
            }, { once: true });

    window.addEventListener("mousemove", () => {
        if (inputType === null) {
            inputType = "mouse";
             

            // DragBar ausblenden
            DragBar.classList.add("hidden");

            // Maussteuerung aktivieren
            document.addEventListener("mousemove", (e) => {
                DragBarHandle.style.top = `${e.clientY}px`;
            });

            document.addEventListener("contextmenu", e => e.preventDefault());
            document.addEventListener("dragstart", e => e.preventDefault());
        }
    }, { once: true });
}

function displayUI(idToShow) {
    const sections = document.querySelectorAll(".ui-section");
    const isGameUI = (idToShow === "game_UI");

    // GameUI-Mode
    const footer = document.getElementById("footer");
    const navbar = document.getElementById("header");

    if (isGameUI) {
        footer?.classList.add("hidden");
        navbar?.classList.add("hidden");
        (async()=>{while(isGameUI){gameLogic();await new Promise(r=>setTimeout(r,TickSpeed));}})();
    } else {
        footer?.classList.remove("hidden");
        navbar?.classList.remove("hidden");
    }

    // UI-Wechsel
    sections.forEach((sec) => sec.classList.remove("active"));
    const el = document.getElementById(idToShow);
    if (el) el.classList.add("active");
}

function ChangeSkinMenu(OpenClose) {
    if (OpenClose === "open") {
        skinsMenu.classList.remove("hidden");
        skinsMenu.classList.add("active");
        DisplaySkins();
    } else if (OpenClose === "close") {
        skinsMenu.classList.remove("active");
        skinsMenu.classList.add("hidden");
    }
}

function ToggleSkinMenu() {
    if (skinsMenu.classList.contains("active")) {
        ChangeSkinMenu("close");
    } else {
        ChangeSkinMenu("open");
    }
}

function DisplaySkins() {
    const skinsMenuDiv = document.getElementById("lobby_UI_skins_div");
    skinsMenuDiv.innerHTML = "";

    skins.forEach((skin) => {
        const skinContainer = document.createElement("div");
        skinContainer.classList.add("locker-item");

        const img = document.createElement("img");
        img.src = skin.image;
        img.alt = skin.name;

        const nameLabel = document.createElement("h3");
        nameLabel.textContent = skin.name;

        const descPargh = document.createElement("p");
        descPargh.textContent = skin.desc;

        skinContainer.appendChild(img);
        skinContainer.appendChild(nameLabel);
        skinContainer.appendChild(descPargh);

        skinContainer.addEventListener("click", () => {
             
            localStorage.setItem("locker_picked_skin", skin.name);

            // Alle anderen Skins deselektieren
            document.querySelectorAll("#lobby_UI_skins_div .locker-item").forEach((item) => {
                item.classList.remove("selected");
            });

            // Aktuelle Auswahl markieren
            skinContainer.classList.add("selected");
        });

        skinsMenuDiv.appendChild(skinContainer);
    });
}

function ToggleMenu(menuName) {
    const menus = {
        skins: document.getElementById("lobby_UI_skins"),
        character: document.getElementById("lobby_UI_character"),
        songs: document.getElementById("lobby_UI_songs")
    };

    // Alle Menüs verstecken
    for (let key in menus) {
        menus[key].classList.add("hidden");
        menus[key].classList.remove("active");
    }

    // Aktuelles Menü einblenden
    const selectedMenu = menus[menuName];
    selectedMenu.classList.remove("hidden");
    selectedMenu.classList.add("active");

    // Inhalte anzeigen (z. B. Skins laden)
    if (menuName === "skins") DisplaySkins();
    if (menuName === "character") DisplayCharacters();
    if (menuName === "songs") DisplaySongs();
}

function DisplayCharacters() {
    const charDiv = document.getElementById("lobby_UI_character_div");
    charDiv.innerHTML = "";

    characters.forEach((char) => {
        const div = document.createElement("div");
        div.classList.add("locker-item");

        const img = document.createElement("img");
        img.src = char.image;
        img.alt = char.name;

        const name = document.createElement("h3");
        name.textContent = char.name;

        const desc = document.createElement("p");
        desc.textContent = char.desc;

        div.appendChild(img);
        div.appendChild(name);
        div.appendChild(desc);

        div.addEventListener("click", () => {
             
            localStorage.setItem("locker_picked_character", char.name);

            document.querySelectorAll("#lobby_UI_character_div .locker-item").forEach((item) => {
                item.classList.remove("selected");
            });

            div.classList.add("selected");
        });

        charDiv.appendChild(div);
    });
}

function DisplaySongs() {
    const songsDiv = document.getElementById("lobby_UI_songs_div");
    songsDiv.innerHTML = "";

    songs.forEach((song) => {
        const div = document.createElement("div");
        div.classList.add("locker-item");

        const title = document.createElement("h3");
        title.textContent = song.title;

        const songInfo = document.createElement("div");
        songInfo.classList.add("song-info");

        const duration = document.createElement("span");
        duration.textContent = `⏱ ${song.duration}`;

        const difficulty = document.createElement("span");
        difficulty.classList.add("difficulty", getDifficultyClass(song.difficulty));
        difficulty.textContent = song.difficulty;

        songInfo.appendChild(duration);
        songInfo.appendChild(difficulty);

        div.appendChild(title);
        div.appendChild(songInfo);

        div.addEventListener("click", () => {
             
            localStorage.setItem("locker_picked_song", song.title);

            document.querySelectorAll("#lobby_UI_songs_div .locker-item").forEach((item) => {
                item.classList.remove("selected");
            });

            div.classList.add("selected");
        });

        songsDiv.appendChild(div);
    });
}


// Funktion für das Spiel starten
function playGame() {
    const selectedSkin = localStorage.getItem("locker_picked_skin") || "Brass";
    const selectedChar = localStorage.getItem("locker_picked_character") || "Normal Guy";
    const selectedSong = localStorage.getItem("locker_picked_song") || "Song of Chaos";

    const GameTitleH2 = document.getElementById("GameTitle");
    const DragBar = document.getElementById("DragBar");

    const toggleFullscreenEl = document.getElementById("toggle_fullscreen");

    if (toggleFullscreenEl && toggleFullscreenEl.checked) {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(`Vollbild konnte nicht aktiviert werden: ${err.message}`);
            });
        }

        if (screen.orientation && screen.orientation.lock) {
            try {
                screen.orientation.lock("landscape").then(() => {
                    // Nach erfolgreicher Sperre
                     

                    // Jetzt verschiebe die JoyStick-Bar
                    if (DragBar) {
                        DragBar.style.left = "10%";
                         
                    }
                });
            } catch (err) {
                console.warn("Bildschirm-Drehung konnte nicht gesperrt werden:", err);
            }
        }
    }

    if (GameTitleH2) {
        GameTitleH2.innerHTML = `${selectedSong} - Don’t Blow it!`;
    }

     
    displayUI("game_UI");
}

    // Hilfsfunktion für Schwierigkeitsgrad CSS-Klassen
    function getDifficultyClass(difficulty) {
    return difficulty.toLowerCase().replace(" ", "");
}

function gameLogic() {

if (GameField.classList.contains("active")) {
let el1 = DragBarHandle;
let el2 = document.getElementById("Note");
let el3

el1 = el1.getBoundingClientRect().top.toFixed(0);
el2 = el2.getBoundingClientRect().top.toFixed(0);
el3 = el1 - el2
console.log(el3);

if (el3 < 10) {
    console.log("perfect");
} else if (el3 < 20) {
    console.log("Good");
} else if (el3 > 30) {
    console.log("Bad");
}



}}

document.getElementById("exportSettings").addEventListener("click", () => {
        const dataStr = JSON.stringify(localStorage, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "TrumpetChaos.json";
        link.click();

        URL.revokeObjectURL(url); // aufräumen
    });
    
document.getElementById("importSettings").addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const text = await file.text();
        try {
            const settings = JSON.parse(text);
            for (const key in settings) {
                localStorage.setItem(key, settings[key]);
            }
            alert("Import erfolgreich! Seite wird neu geladen.");
            location.reload();
        } catch (err) {
            alert("Fehler beim Import: " + err.message);
        }
    });
    
    
      function confirmClearStorage() {
      Swal.fire({
        title: 'Are you sure?',
        text: 'All saved data will be permanently deleted!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        background: '#1e1e1e',
        color: '#f0f0f0',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          // Clear localStorage
          localStorage.clear();

          // Optional: Feedback before reload
          Swal.fire({
            title: 'Deleted!',
            text: 'Your data has been cleared.',
            icon: 'success',
            background: '#1e1e1e',
            color: '#f0f0f0',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            // Refresh page
            location.reload();
          });
        }
      });
      }
