document.addEventListener("DOMContentLoaded", () => {
  console.log("Script caricato correttamente!");

  // ============================================================
  // Recupero degli elementi DOM per ciascuna schermata
  // ============================================================
  const screenIntroPart1    = document.getElementById("screen_intro_part1");
  const screenIntroPart2    = document.getElementById("screen_intro_part2");
  const screenInstructions  = document.getElementById("screen_instructions");
  const screenDifficulty    = document.getElementById("screen_difficulty");
  const screenGame1Superior = document.getElementById("screen_game1_superior");
  const screenGame2Superior = document.getElementById("screen_game2_superior");
  const screenDocument      = document.getElementById("screen_document");
  const screenGame3         = document.getElementById("screen_game3");
  const screenGraph1        = document.getElementById("screen_graph1");
  const screenGraph2        = document.getElementById("screen_graph2");
  const screenGraph3        = document.getElementById("screen_graph3");
  const screenEscape        = document.getElementById("screen_escape");
  const screenGame1Media    = document.getElementById("screen_game1_media");
  const screenGame2Media    = document.getElementById("screen_game2_media");
  const screenDocumentMedia = document.getElementById("screen_document_media");
  const screenGame3Media = document.getElementById("screen_game3_media");  
  const screenFail          = document.getElementById("screen_fail");
  const screenSuccess = document.getElementById("screen_success");

  // ============================================================
  // Tracciamento della difficoltà attuale
  // ============================================================
  let currentDifficulty = ""; // "media" o "superiore"

  // ============================================================
  // Funzione di utilità: mostra una schermata e nasconde le altre
  // ============================================================
  function showScreen(screenElement) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    screenElement.classList.add("active");
  }

  // ============================================================
  // Navigazione tra le schermate introduttive e le istruzioni
  // ============================================================
  document.getElementById("btn_next_intro1").addEventListener("click", () => {
    showScreen(screenIntroPart2);
  });
  document.getElementById("btn_back_intro2").addEventListener("click", () => {
    showScreen(screenIntroPart1);
  });
  document.getElementById("btn_next_intro2").addEventListener("click", () => {
    showScreen(screenInstructions);
  });
  document.getElementById("btn_back_instructions").addEventListener("click", () => {
    showScreen(screenIntroPart2);
  });
  document.getElementById("btn_next_instructions").addEventListener("click", () => {
    showScreen(screenDifficulty);
  });
  document.getElementById("btn_back_difficulty").addEventListener("click", () => {
    showScreen(screenInstructions);
  });

  // ============================================================
  // Gestione del timer globale della missione
  // ============================================================
  const timeRemainingEl = document.getElementById("timeRemaining");
  let remainingTime = 1200; // 20 minuti = 1200 secondi
  let timerInterval;

  function updateTimerDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    timeRemainingEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  function startTimer() {
    console.log("Timer avviato");
    updateTimerDisplay();
    timerInterval = setInterval(() => {
      remainingTime--;
      updateTimerDisplay();
      if (remainingTime <= 0) {
        clearInterval(timerInterval);
        showScreen(screenFail);
      }
    }, 1000);
  }

  function subtractTimePenalty(seconds) {
    remainingTime = Math.max(0, remainingTime - seconds);
    updateTimerDisplay();
  }

  // ============================================================
  // GAME 1 (SUPERIORE) - Puzzle Drag & Drop "Il Codice del DNA"
  // ============================================================
  const wordsDataSuperior = [
    { text: "codone",    isCorrect: true },
    { text: "mRNA",      isCorrect: true },
    { text: "tripletta", isCorrect: true },
    { text: "adenina",   isCorrect: true },
    { text: "peptide",   isCorrect: false },
    { text: "mitosi",    isCorrect: false },
    { text: "emoglobina",isCorrect: false },
    { text: "antigene",  isCorrect: false }
  ];
  const totalWordsSuperior = wordsDataSuperior.length;

  // Funzione di shuffle (Fisher-Yates)
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function initGame1Superior() {
    console.log("Inizializzazione Game 1 (Superiore)");
    const wordBank = document.getElementById("wordBank");
    wordBank.innerHTML = "";
    document.getElementById("dropzone_correct").innerHTML = "<h3>Parole Corrette</h3>";
    document.getElementById("dropzone_incorrect").innerHTML = "<h3>Parole Errate</h3>";
    document.getElementById("game1Message").textContent = "";

    const words = [...wordsDataSuperior];
    shuffleArray(words);

    words.forEach((word, index) => {
      const wordEl = document.createElement("div");
      wordEl.classList.add("draggable-word");
      wordEl.textContent = word.text;
      wordEl.setAttribute("draggable", "true");
      wordEl.dataset.isCorrect = word.isCorrect;
      wordEl.id = "word_" + index;
      wordEl.addEventListener("dragstart", handleDragStart);
      wordEl.addEventListener("dragend", handleDragEnd);
      wordBank.appendChild(wordEl);
    });
  }

  // Drag & Drop handlers per Game 1
  function handleDragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.id);
    e.target.classList.add("dragging");
  }
  function handleDragEnd(e) {
    e.target.classList.remove("dragging");
  }
  function handleDragOver(e) {
    e.preventDefault();
  }
  function handleDrop(e) {
    e.preventDefault();
    const dropZone = e.currentTarget;
    const wordId = e.dataTransfer.getData("text/plain");
    const wordEl = document.getElementById(wordId);
    if (!wordEl) return;
    dropZone.appendChild(wordEl);
    wordEl.removeEventListener("dragstart", handleDragStart);
    wordEl.removeEventListener("dragend", handleDragEnd);
  }

  const dropzoneCorrect = document.getElementById("dropzone_correct");
  const dropzoneIncorrect = document.getElementById("dropzone_incorrect");
  dropzoneCorrect.addEventListener("dragover", handleDragOver);
  dropzoneCorrect.addEventListener("drop", handleDrop);
  dropzoneIncorrect.addEventListener("dragover", handleDragOver);
  dropzoneIncorrect.addEventListener("drop", handleDrop);

  // Gestione del pulsante "Conferma" per Game 1 Superior
  document.getElementById("btn_submit_game1").addEventListener("click", () => {
    const wordBank = document.getElementById("wordBank");
    if (wordBank.children.length > 0) {
      document.getElementById("game1Message").textContent = "Completa il posizionamento di tutte le parole.";
      return;
    }
    const correctWords = document.getElementById("dropzone_correct").querySelectorAll(".draggable-word");
    const incorrectWords = document.getElementById("dropzone_incorrect").querySelectorAll(".draggable-word");
    if (correctWords.length === 4 && incorrectWords.length === 4) {
      let allCorrect = true;
      correctWords.forEach(wordEl => {
        if (wordEl.dataset.isCorrect !== "true") {
          allCorrect = false;
        }
      });
      if (allCorrect) {
        document.getElementById("game1Message").textContent = "Il codice biometrico è accettato, la porta del bunker si apre!";
        // Dopo un breve delay, passa al Game 2 (Superior)
        setTimeout(() => {
          showScreen(screenGame2Superior);
          initGame2Superior();
        }, 1000);
        return;
      }
    }
    document.getElementById("game1Message").textContent = "Errore! Hai posizionato le parole in modo errato. Hai perso 1 minuto e devi riprovare.";
    subtractTimePenalty(60);
    setTimeout(initGame1Superior, 2500);
  });

  // ============================================================
  // GAME 2 (SUPERIORE) - Card Sorting Puzzle: Il Sistema Immunitario
  // ============================================================
  const cardsDataSuperior = [
    { text: "iniezione del vaccino", order: 1 },
    { text: "attivazione risposta immunitaria", order: 2 },
    { text: "attivazione linfociti T e B", order: 3 },
    { text: "produzione anticorpi", order: 4 },
    { text: "eliminazione antigene", order: 5 },
    { text: "memoria immunologica", order: 6 }
  ];

  function initGame2Superior() {
    console.log("Inizializzazione Game 2 (Superiore)");
    // Svuota gli slot e il contenitore delle carte
    document.querySelectorAll(".card-slot").forEach(slot => {
      slot.innerHTML = "";
    });
    const cardsContainer = document.getElementById("cardsContainer");
    cardsContainer.innerHTML = "";
    document.getElementById("game2Message").textContent = "";

    const cards = [...cardsDataSuperior];
    shuffleArray(cards);

    cards.forEach((card, index) => {
      const cardEl = document.createElement("div");
      cardEl.classList.add("card");
      cardEl.textContent = card.text;
      cardEl.setAttribute("draggable", "true");
      cardEl.dataset.order = card.order;
      cardEl.id = "card_" + index;
      cardEl.addEventListener("dragstart", handleCardDragStart);
      cardEl.addEventListener("dragend", handleCardDragEnd);
      cardsContainer.appendChild(cardEl);
    });

    document.querySelectorAll(".card-slot").forEach(slot => {
      slot.addEventListener("dragover", handleCardDragOver);
      slot.addEventListener("drop", handleCardDrop);
    });
  }

  // Drag & Drop handlers per le carte del Game 2
  function handleCardDragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.id);
    e.target.classList.add("dragging");
  }
  function handleCardDragEnd(e) {
    e.target.classList.remove("dragging");
  }
  function handleCardDragOver(e) {
    e.preventDefault();
  }
  function handleCardDrop(e) {
    e.preventDefault();
    const slot = e.currentTarget;
    const cardId = e.dataTransfer.getData("text/plain");
    const cardEl = document.getElementById(cardId);
    if (!cardEl) return;
    if (slot.children.length > 0) {
      const existingCard = slot.firstElementChild;
      document.getElementById("cardsContainer").appendChild(existingCard);
    }
    slot.appendChild(cardEl);
  }

  // Gestione del pulsante "Conferma" per il Game 2 Superior
  document.getElementById("btn_submit_game2").addEventListener("click", () => {
    let allSlotsFilled = true;
    let correctOrder = true;
    document.querySelectorAll("#screen_game2 .card-slot").forEach(slot => {
      if (slot.childElementCount === 0) {
        allSlotsFilled = false;
      } else {
        const cardEl = slot.firstElementChild;
        const slotNumber = parseInt(slot.dataset.slot);
        if (parseInt(cardEl.dataset.order) !== slotNumber) {
          correctOrder = false;
        }
      }
    });
    if (!allSlotsFilled) {
      document.getElementById("game2Message").textContent = "Completa il posizionamento di tutte le carte.";
      return;
    }
    if (correctOrder) {
      document.getElementById("game2Message").textContent = "Sequenza corretta!";
      // Dopo un breve delay, passa al documento medie
      setTimeout(() => {
        showScreen(screenDocument);
      }, 1000);
    } else {
      document.getElementById("game2Message").textContent = "Errore! Ordine errato. Hai perso 1 minuto, riprova.";
      subtractTimePenalty(60);
      setTimeout(initGame2, 2500);
    }
  });

  // ============================================================
  // GAME 3 - Matching Puzzle: Abbinamento Eventi e Date
  // ============================================================
  document.getElementById("btn_doc_continue").addEventListener("click", () => {
    showScreen(screenGame3);
    initGame3();
  });
  
  const matchData = [
    { event: "Scoperta della vaccinazione contro il vaiolo da parte di Edward Jenner.", date: "1796" },
    { event: "Louis Pasteur sviluppa i primi vaccini attenuati contro rabbia e antrace.", date: "1885" },
    { event: "Viene sviluppato il primo vaccino contro la poliomielite.", date: "1955" },
    { event: "L’OMS lancia un programma globale per l’eradicazione del vaiolo.", date: "1967" },
    { event: "Il vaiolo viene dichiarato ufficialmente eradicato.", date: "1980" },
    { event: "I primi vaccini a mRNA vengono sviluppati per affrontare una pandemia globale.", date: "2020" }
  ];

  function initGame3() {
    console.log("Inizializzazione Game 3 (Matching Event & Date)");
    const eventSlotsContainer = document.querySelector(".event-slots");
    eventSlotsContainer.innerHTML = "";
    const datesContainer = document.getElementById("datesContainer");
    datesContainer.innerHTML = "";
    document.getElementById("game3Message").textContent = "";

    const events = [...matchData];
    shuffleArray(events);
    events.forEach(item => {
      const slotDiv = document.createElement("div");
      slotDiv.classList.add("event-slot");
      slotDiv.dataset.correctDate = item.date;

      const eventText = document.createElement("div");
      eventText.classList.add("event-text");
      eventText.textContent = item.event;

      const dropZone = document.createElement("div");
      dropZone.classList.add("date-dropzone");
      dropZone.addEventListener("dragover", handleDateDragOver);
      dropZone.addEventListener("drop", handleDateDrop);

      slotDiv.appendChild(eventText);
      slotDiv.appendChild(dropZone);
      eventSlotsContainer.appendChild(slotDiv);
    });

    const dates = matchData.map(item => item.date);
    shuffleArray(dates);
    dates.forEach((date, index) => {
      const dateCard = document.createElement("div");
      dateCard.classList.add("date-card");
      dateCard.textContent = date;
      dateCard.setAttribute("draggable", "true");
      dateCard.dataset.date = date;
      dateCard.id = "date_" + index;
      dateCard.addEventListener("dragstart", handleDateDragStart);
      dateCard.addEventListener("dragend", handleDateDragEnd);
      datesContainer.appendChild(dateCard);
    });
  }

  function handleDateDragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.id);
    e.target.classList.add("dragging");
  }
  function handleDateDragEnd(e) {
    e.target.classList.remove("dragging");
  }
  function handleDateDragOver(e) {
    e.preventDefault();
  }
  function handleDateDrop(e) {
    e.preventDefault();
    const dropZone = e.currentTarget;
    const dateCardId = e.dataTransfer.getData("text/plain");
    const dateCard = document.getElementById(dateCardId);
    if (!dateCard) return;
    if (dropZone.children.length > 0) {
      const existingCard = dropZone.firstElementChild;
      document.getElementById("datesContainer").appendChild(existingCard);
    }
    dropZone.appendChild(dateCard);
  }

  document.getElementById("btn_submit_game3").addEventListener("click", () => {
    let allFilled = true;
    let allCorrect = true;
    document.querySelectorAll(".event-slot").forEach(slot => {
      const correctDate = slot.dataset.correctDate;
      const dropZone = slot.querySelector(".date-dropzone");
      if (dropZone.children.length === 0) {
        allFilled = false;
      } else {
        const dateCard = dropZone.firstElementChild;
        const selectedDate = dateCard.dataset.date;
        if (selectedDate !== correctDate) {
          allCorrect = false;
        }
      }
    });
    if (!allFilled) {
      document.getElementById("game3Message").textContent = "Completa l'abbinamento di tutti gli eventi.";
      return;
    }
    if (allCorrect) {
      document.getElementById("game3Message").textContent = "Accesso ai dati concesso. Frammento del Protocollo Genesi recuperato.";
      setTimeout(() => {
        showScreen(screenGraph1);
      }, 1000);
    } else {
      if (!window.game3Attempts) {
        window.game3Attempts = 3;
      }
      window.game3Attempts--;
      document.getElementById("game3Message").textContent = `Errore di abbinamento. Tentativi rimanenti: ${window.game3Attempts}`;
      if (window.game3Attempts <= 0) {
        setTimeout(initGame3, 1500);
        window.game3Attempts = 3;
      }
    }
  });

  // ============================================================
  // GAME 4 (SECRET ARCHIVE) - Domande con Grafici
  // ============================================================
  const correctAnswerGraph1 = "falso";
  const correctAnswerGraph2 = "vero";
  const correctAnswerGraph3 = "falso";

  let graphAnswer1 = null;
  let graphAnswer2 = null;
  let graphAnswer3 = null;

  document.querySelectorAll("#screen_graph1 .answer-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      graphAnswer1 = btn.dataset.answer;
      if (graphAnswer1 === correctAnswerGraph1) {
        document.getElementById("game4Msg1").textContent = "Risposta corretta.";
      } else {
        document.getElementById("game4Msg1").textContent = "Risposta errata. Hai perso 1 minuto.";
        subtractTimePenalty(60);
      }
    });
  });
  document.getElementById("btn_next_graph1").addEventListener("click", () => {
    if (!graphAnswer1) {
      document.getElementById("game4Msg1").textContent = "Seleziona una risposta.";
      return;
    }
    showScreen(screenGraph2);
  });

  document.querySelectorAll("#screen_graph2 .answer-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      graphAnswer2 = btn.dataset.answer;
      if (graphAnswer2 === correctAnswerGraph2) {
        document.getElementById("game4Msg2").textContent = "Risposta corretta.";
      } else {
        document.getElementById("game4Msg2").textContent = "Risposta errata. Hai perso 1 minuto.";
        subtractTimePenalty(60);
      }
    });
  });
  document.getElementById("btn_next_graph2").addEventListener("click", () => {
    if (!graphAnswer2) {
      document.getElementById("game4Msg2").textContent = "Seleziona una risposta.";
      return;
    }
    showScreen(screenGraph3);
  });

  document.querySelectorAll("#screen_graph3 .answer-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      graphAnswer3 = btn.dataset.answer;
      if (graphAnswer3 === correctAnswerGraph3) {
        document.getElementById("game4Msg3").textContent = "Risposta corretta.";
      } else {
        document.getElementById("game4Msg3").textContent = "Risposta errata. Hai perso 1 minuto.";
        subtractTimePenalty(60);
      }
    });
  });
  document.getElementById("btn_submit_graph3").addEventListener("click", () => {
    if (!graphAnswer3) {
      document.getElementById("game4Msg3").textContent = "Seleziona una risposta.";
      return;
    }
    document.getElementById("game4Msg3").textContent = "Accesso ai dati concesso. Frammento del Protocollo Genesi recuperato.";
    setTimeout(() => {
      showScreen(screenEscape);
      // Reset degli slider per il Game 5
      slider1.value = 0;
      slider2.value = 0;
      slider1Value.textContent = "0%";
      slider2Value.textContent = "0%";
    }, 1000);
  });

  const slider1 = document.getElementById("slider1");
  const slider2 = document.getElementById("slider2");
  const slider1Value = document.getElementById("slider1Value");
  const slider2Value = document.getElementById("slider2Value");

  slider1.addEventListener("input", () => {
    slider1Value.textContent = slider1.value + "%";
  });
  slider2.addEventListener("input", () => {
    slider2Value.textContent = slider2.value + "%";
  });

  document.getElementById("btn_submit_game5").addEventListener("click", () => {
    const answer1 = parseInt(slider1.value, 10);
    const answer2 = parseInt(slider2.value, 10);
    
    // Range accettabili:
    // Scenario 1: 22-24%
    // Scenario 2: 93-95%
    const correct1 = (answer1 >= 22 && answer1 <= 24);
    const correct2 = (answer2 >= 93 && answer2 <= 95);
    
    if (correct1 && correct2) {
      document.getElementById("game5Message").textContent = "Backup attivato. Fuga riuscita!";
      setTimeout(() => {
        showScreen(screenSuccess);
      }, 1000);
    } else {
      if (typeof window.game5Attempts === "undefined") {
        window.game5Attempts = 3;
      }
      window.game5Attempts--;
      document.getElementById("game5Message").textContent = `Errore. Tentativi rimanenti: ${window.game5Attempts}`;
      if (window.game5Attempts <= 0) {
        document.getElementById("game5Message").textContent = "Sistema bloccato per 2 minuti.";
        slider1.disabled = true;
        slider2.disabled = true;
        document.getElementById("btn_submit_game5").disabled = true;
        setTimeout(() => {
          window.game5Attempts = 3;
          slider1.disabled = false;
          slider2.disabled = false;
          document.getElementById("btn_submit_game5").disabled = false;
          document.getElementById("game5Message").textContent = "";
        }, 120000);
      }
    }
  });

  // ============================================================
  // GAME 1 (MEDIA) - Puzzle DNA: Selezione della lettera complementare
  // ============================================================

  // FUNZIONE UTILE: Restituisce il complementare della lettera (A ↔ T, C ↔ G)
  function getComplement(letter) {
    const comp = { A: "T", T: "A", C: "G", G: "C" };
    return comp[letter.toUpperCase()] || "";
  }

  // FUNZIONE UTILE: Miscelazione casuale di un array (algoritmo Fisher-Yates)
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  /**
   * Handler per il click su una cella vuota (o già scelta) nella griglia medie.
   * Apre (o chiude) un menu touch-friendly per scegliere tra A, T, C, G.
   */
  function handleEmptyCellClick(e) {
    e.stopPropagation();
    const cell = e.currentTarget;
    // Se il menu esiste già, toglilo (toggle)
    const existingMenu = cell.querySelector(".cell-menu");
    if (existingMenu) {
      cell.removeChild(existingMenu);
      return;
    }
    // Crea il menu di scelta
    const options = ["A", "T", "C", "G"];
    const menu = document.createElement("div");
    menu.classList.add("cell-menu");
    options.forEach(option => {
      const btn = document.createElement("button");
      btn.textContent = option;
      btn.classList.add("cell-menu-btn");
      btn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        // Imposta la scelta nella cella (sovrascrivendo quella precedente)
        cell.textContent = option;
        if (cell.contains(menu)) {
          cell.removeChild(menu);
        }
        // Feedback immediato sulla correttezza
        const correctLetter = cell.dataset.correct;
        if (option.toUpperCase() === correctLetter.toUpperCase()) {
          cell.classList.add("matched");
          document.getElementById("mediaGameMessage").textContent = "Coppia corretta!";
        } else {
          cell.classList.remove("matched");
          document.getElementById("mediaGameMessage").textContent = "Scelta errata! (Modifica se vuoi)";
        }
      });
      menu.appendChild(btn);
    });
    cell.appendChild(menu);
  }

  /**
   * Inizializza la griglia per il puzzle medie.
   * La griglia è composta da 2 righe x 8 colonne (16 celle totali).
   * In ogni colonna, una cella (determinata casualmente) è pre-riempita e l’altra è vuota.
   * La cella vuota riceve il dato "correct" con il complementare della lettera pre-riempita.
   */
  function initGame1Media() {
    console.log("Inizializzazione Game 1 (Medie)");
    const gridContainer = document.getElementById("mediaGrid");
    gridContainer.innerHTML = "";
    document.getElementById("mediaGameMessage").textContent = "";

    // Definiamo 8 coppie per ottenere 8 abbinamenti (una per ogni colonna)
    const basePairs = [
      { top: "A", bottom: "T" },
      { top: "C", bottom: "G" },
      { top: "T", bottom: "A" },
      { top: "G", bottom: "C" },
      { top: "A", bottom: "T" },
      { top: "C", bottom: "G" },
      { top: "T", bottom: "A" },
      { top: "G", bottom: "C" }
    ];
    let pairs = [...basePairs];
    shuffleArray(pairs);

    // Genera un array di colonne da 0 a 7 e mescolalo
    const columns = [...Array(8).keys()];
    shuffleArray(columns);
    // Le prime 4 colonne avranno la cella superiore pre-riempita, le altre la cella inferiore
    const topFilledCols = columns.slice(0, 4);
    const bottomFilledCols = columns.slice(4);

    const topCells = [];
    const bottomCells = [];

    for (let col = 0; col < 8; col++) {
      // Crea la cella superiore per la colonna col
      const topCell = document.createElement("div");
      topCell.classList.add("media-cell");
      topCell.dataset.row = "top";
      topCell.dataset.col = col;
      // Crea la cella inferiore per la stessa colonna
      const bottomCell = document.createElement("div");
      bottomCell.classList.add("media-cell");
      bottomCell.dataset.row = "bottom";
      bottomCell.dataset.col = col;

      if (topFilledCols.includes(col)) {
        // In questa colonna, la cella superiore è pre-riempita
        const pair = pairs.shift(); // Viene utilizzata una coppia
        topCell.textContent = pair.top;
        topCell.classList.add("filled");
        // La cella inferiore resta vuota e deve essere completata dall'utente
        bottomCell.textContent = "";
        bottomCell.addEventListener("click", handleEmptyCellClick);
        bottomCell.dataset.correct = getComplement(pair.top);
      } else {
        // In questa colonna, la cella inferiore è pre-riempita
        const pair = pairs.shift();
        bottomCell.textContent = pair.bottom;
        bottomCell.classList.add("filled");
        // La cella superiore resta vuota
        topCell.textContent = "";
        topCell.addEventListener("click", handleEmptyCellClick);
        topCell.dataset.correct = getComplement(pair.bottom);
      }
      topCells.push(topCell);
      bottomCells.push(bottomCell);
    }
    // Aggiungi prima le celle della riga superiore, poi quelle inferiori
    topCells.forEach(cell => gridContainer.appendChild(cell));
    bottomCells.forEach(cell => gridContainer.appendChild(cell));
  }

  /**
   * Handler per il click su una cella vuota (o già scelta).
   * Apre (o chiude, in modalità toggle) un menu touch-friendly per scegliere tra A, T, C, G.
   */
  function handleEmptyCellClick(e) {
    e.stopPropagation();
    const cell = e.currentTarget;
    // Se il menu è già aperto, toglilo
    const existingMenu = cell.querySelector(".cell-menu");
    if (existingMenu) {
      cell.removeChild(existingMenu);
      return;
    }
    // Crea il menu di scelta
    const options = ["A", "T", "C", "G"];
    const menu = document.createElement("div");
    menu.classList.add("cell-menu");
    options.forEach(option => {
      const btn = document.createElement("button");
      btn.textContent = option;
      btn.classList.add("cell-menu-btn");
      btn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        cell.textContent = option;
        if (cell.contains(menu)) {
          cell.removeChild(menu);
        }
        // Feedback immediato: verifica la correttezza della scelta
        const correctLetter = cell.dataset.correct;
        if (option.toUpperCase() === correctLetter.toUpperCase()) {
          cell.classList.add("matched");
          document.getElementById("mediaGameMessage").textContent = "Coppia corretta!";
        } else {
          cell.classList.remove("matched");
          document.getElementById("mediaGameMessage").textContent = "Scelta errata! (Modifica se vuoi)";
        }
      });
      menu.appendChild(btn);
    });
    cell.appendChild(menu);
  }

  document.getElementById("btn_confirm_media").addEventListener("click", () => {
    const cells = document.querySelectorAll("#mediaGrid .media-cell");
    let allFilled = true;
    let allCorrect = true;
    
    // Verifica che tutte le celle da completare siano riempite correttamente
    cells.forEach(cell => {
      if (cell.dataset.correct) { // Solo per le celle che l'utente deve completare
        if (cell.textContent.trim() === "") {
          allFilled = false;
        } else if (cell.textContent.trim().toUpperCase() !== cell.dataset.correct.toUpperCase()) {
          allCorrect = false;
        }
      }
    });
    
    if (!allFilled) {
      document.getElementById("mediaGameMessage").textContent = "Completa tutte le scelte!";
    } else if (!allCorrect) {
      document.getElementById("mediaGameMessage").textContent = "Alcuni abbinamenti sono errati. Hai perso 1 minuto!";
      subtractTimePenalty(60);
      // Per ogni cella errata, resetta il contenuto e riattiva l'handler
      cells.forEach(cell => {
        if (cell.dataset.correct) {
          if (cell.textContent.trim().toUpperCase() !== cell.dataset.correct.toUpperCase()) {
            cell.textContent = "";
            const existingMenu = cell.querySelector(".cell-menu");
            if (existingMenu) {
              cell.removeChild(existingMenu);
            }
            cell.addEventListener("click", handleEmptyCellClick);
          }
        }
      });
    } else {
      document.getElementById("mediaGameMessage").textContent = "Codice biometrico accettato, porta sbloccata!";
      // Blocca le celle corrette per impedire ulteriori modifiche
      cells.forEach(cell => {
        if (cell.dataset.correct && cell.textContent.trim().toUpperCase() === cell.dataset.correct.toUpperCase()) {
          // Sostituisci il nodo con una copia senza listener
          let newCell = cell.cloneNode(true);
          cell.parentNode.replaceChild(newCell, cell);
        }
      });
      // Dopo un breve delay, passa al gioco 2 per le medie
      setTimeout(() => {
        showScreen(screenGame2Media);
        initGame2Media();
      }, 1000);
    }
  });  

  // ============================================================
  // GAME 2 (MEDIA) - Ordinare i termini
  // ============================================================
  
  function initGame2Media() {
    console.log("Inizializzazione Game 2 (Medie)");
    // Svuota gli slot e il contenitore delle carte per le medie
    document.querySelectorAll("#screen_game2_media .card-slot").forEach(slot => {
      slot.innerHTML = "";
    });
    const cardsContainerMedia = document.getElementById("cardsContainerMedia");
    cardsContainerMedia.innerHTML = "";
    document.getElementById("game2MediaMessage").textContent = "";

    // Definisci i termini per il puzzle medie (più intuitivi)
    const cardsDataMedia = [
      { text: "somministrazione del vaccino", order: 1 },
      { text: "attivazione delle difese", order: 2 },
      { text: "produzione di anticorpi", order: 3 },
      { text: "memoria immunitaria", order: 4 }
    ];
    let cards = [...cardsDataMedia];
    shuffleArray(cards);

    // Crea le carte da trascinare
    cards.forEach((card, index) => {
      const cardEl = document.createElement("div");
      cardEl.classList.add("card");
      cardEl.textContent = card.text;
      cardEl.setAttribute("draggable", "true");
      cardEl.dataset.order = card.order;
      cardEl.id = "cardMedia_" + index;
      cardEl.addEventListener("dragstart", handleCardDragStart);
      cardEl.addEventListener("dragend", handleCardDragEnd);
      cardsContainerMedia.appendChild(cardEl);
    });

    // Associa gli eventi di drag & drop agli slot
    document.querySelectorAll("#screen_game2_media .card-slot").forEach(slot => {
      slot.addEventListener("dragover", handleCardDragOver);
      slot.addEventListener("drop", handleCardDrop);
    });
  }

  // Listener per il pulsante "Conferma" del gioco 2 medie
  document.getElementById("btn_submit_game2_media").addEventListener("click", () => {
    let allSlotsFilled = true;
    let correctOrder = true;
    document.querySelectorAll("#screen_game2_media .card-slot").forEach(slot => {
      if (slot.children.length === 0) {
        allSlotsFilled = false;
      } else {
        const cardEl = slot.firstElementChild;
        const slotNumber = parseInt(slot.dataset.slot);
        if (parseInt(cardEl.dataset.order) !== slotNumber) {
          correctOrder = false;
        }
      }
    });
    if (!allSlotsFilled) {
      document.getElementById("game2MediaMessage").textContent = "Completa il posizionamento di tutte le carte.";
      return;
    }
    if (correctOrder) {
      document.getElementById("game2MediaMessage").textContent = "Sequenza corretta!";
      // Dopo un breve delay, passa al gioco 3 medie
      setTimeout(() => {
        showScreen(screenDocumentMedia);
        initGame3Media();
      }, 1000);
    } else {
      document.getElementById("game2MediaMessage").textContent = "Errore! Ordine errato. Hai perso 1 minuto, riprova.";
      subtractTimePenalty(60);
      setTimeout(initGame2Media, 2500);
    }
  });  

  // 
  // GAME 3 - DOCUMENTO
  //
  document.getElementById("btn_doc_continue_media").addEventListener("click", () => {
    showScreen(screenGame3Media);
    initGame3Media();
  });  

  // ============================================================
  // GAME 3 (MEDIA) - Riordinare le date
  // ============================================================
  
  function initGame3Media() {
    console.log("Inizializzazione Game 3 (Medie)");
    const eventSlotsContainer = document.querySelector("#screen_game3_media .event-slots");
    eventSlotsContainer.innerHTML = "";
    const datesContainerMedia = document.getElementById("datesContainerMedia");
    datesContainerMedia.innerHTML = "";
    document.getElementById("game3MediaMessage").textContent = "";
  
    // Definisci 4 eventi con relative date per le medie
    const matchDataMedia = [
      { event: "Prima somministrazione moderna", date: "1900" },
      { event: "Sviluppo vaccini 2a generazione", date: "1950" },
      { event: "Innovazioni tecnologiche", date: "2000" },
      { event: "Rivoluzione dei vaccini a mRNA", date: "2020" }
    ];
  
    // Mescola gli eventi
    let events = [...matchDataMedia];
    shuffleArray(events);
    events.forEach(item => {
      const slotDiv = document.createElement("div");
      slotDiv.classList.add("event-slot");
      slotDiv.dataset.correctDate = item.date;
  
      const eventText = document.createElement("div");
      eventText.classList.add("event-text");
      eventText.textContent = item.event;
  
      const dropZone = document.createElement("div");
      dropZone.classList.add("date-dropzone");
      dropZone.addEventListener("dragover", handleDateDragOver);
      dropZone.addEventListener("drop", handleDateDrop);
  
      slotDiv.appendChild(eventText);
      slotDiv.appendChild(dropZone);
      eventSlotsContainer.appendChild(slotDiv);
    });
  
    // Estrai le date dagli eventi (4 date) e mescolale
    let dates = matchDataMedia.map(item => item.date);
    shuffleArray(dates);
    dates.forEach((date, index) => {
      const dateCard = document.createElement("div");
      dateCard.classList.add("date-card");
      dateCard.textContent = date;
      dateCard.setAttribute("draggable", "true");
      dateCard.dataset.date = date;
      dateCard.id = "dateMedia_" + index;
      dateCard.addEventListener("dragstart", handleDateDragStart);
      dateCard.addEventListener("dragend", handleDateDragEnd);
      datesContainerMedia.appendChild(dateCard);
    });
  }
  
  document.getElementById("btn_submit_game3_media").addEventListener("click", () => {
    let allFilled = true;
    let allCorrect = true;
    document.querySelectorAll("#screen_game3_media .event-slot").forEach(slot => {
      const correctDate = slot.dataset.correctDate;
      const dropZone = slot.querySelector(".date-dropzone");
      if (dropZone.children.length === 0) {
        allFilled = false;
      } else {
        const dateCard = dropZone.firstElementChild;
        const selectedDate = dateCard.dataset.date;
        if (selectedDate !== correctDate) {
          allCorrect = false;
        }
      }
    });
    if (!allFilled) {
      document.getElementById("game3MediaMessage").textContent = "Completa l'abbinamento di tutti gli eventi.";
      return;
    }
    if (allCorrect) {
      document.getElementById("game3MediaMessage").textContent = "Accesso ai dati concesso. Frammento del Protocollo Genesi recuperato.";
      setTimeout(() => {
        showScreen(screenSuccess);
      }, 1000);
    } else {
      document.getElementById("game3MediaMessage").textContent = "Errore nell'abbinamento. Riprova.";
      subtractTimePenalty(60);
      setTimeout(initGame3Media, 2500);
    }
  });  

  // ============================================================
  // GESTIONE DELLA SCELTA DIFFICOLTÀ
  // ============================================================
  document.querySelectorAll(".difficulty-button").forEach(btn => {
    btn.addEventListener("click", () => {
      const difficulty = btn.dataset.difficulty;
      currentDifficulty = difficulty; // salva la difficoltà scelta
      console.log("Difficoltà scelta:", difficulty);
      if (difficulty === "superiore") {
        console.log("Avvio del gioco per Scuola Superiore.");
        showScreen(screenGame1Superior);
        document.getElementById("globalTimer").style.display = "block";
        initGame1Superior();
        remainingTime = 1200; // reset del timer
        startTimer();
      } else if (difficulty === "media") {
        console.log("Avvio del gioco per Scuola Media.");
        showScreen(screenGame1Media);
        document.getElementById("globalTimer").style.display = "block";
        initGame1Media();
        remainingTime = 1200;
        startTimer();
      } else {
        alert("Difficoltà non riconosciuta.");
      }
    });
  });  

  // Pulsante "Riprova" in caso di missione fallita
  document.getElementById("btn_restart").addEventListener("click", () => {
    remainingTime = 1200;
    if (currentDifficulty === "media") {
      initGame1Media();
      startTimer();
      showScreen(screenGame1Media);
    } else {
      // Per "superiore" o default
      initGame1Superior();
      startTimer();
      showScreen(screenGame1Superior);
    }
  });
  
  // Pulsante per continuare dalla schermata Documento
  document.getElementById("btn_doc_continue").addEventListener("click", () => {
    showScreen(screenGame3);
    initGame3();
  });

  // Mostra la prima schermata al caricamento della pagina
  showScreen(screenIntroPart1);
});
