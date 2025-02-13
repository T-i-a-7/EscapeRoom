document.addEventListener("DOMContentLoaded", () => {
  console.log("Script caricato correttamente!");

  // Riferimenti alle schermate
  const screenStory1 = document.getElementById("screen-story1");
  const screenStory2 = document.getElementById("screen-story2");
  const screenInstructions = document.getElementById("screen-instructions");
  const screenDifficulty = document.getElementById("screen-difficulty");
  const screenGame1 = document.getElementById("screen-game1");
  const screenGame2 = document.getElementById("screen-game2");
  const screenDoc = document.getElementById("screen-doc");
  const screenGame3 = document.getElementById("screen-game3");
  const screenGraph1 = document.getElementById("screen-graph1");
  const screenGraph2 = document.getElementById("screen-graph2");
  const screenGraph3 = document.getElementById("screen-graph3");
  const screenGame5 = document.getElementById("screen-game5");
  const screenFail = document.getElementById("screen-fail");

  // Funzione per mostrare una schermata
  function showScreen(screen) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    screen.classList.add("active");
  }

  // Navigazione iniziale
  document.getElementById("btn-next-story1").addEventListener("click", () => {
    showScreen(screenStory2);
  });
  document.getElementById("btn-back-story2").addEventListener("click", () => {
    showScreen(screenStory1);
  });
  document.getElementById("btn-next-story2").addEventListener("click", () => {
    showScreen(screenInstructions);
  });
  document.getElementById("btn-back-instr").addEventListener("click", () => {
    showScreen(screenStory2);
  });
  document.getElementById("btn-next-instr").addEventListener("click", () => {
    showScreen(screenDifficulty);
  });
  document.getElementById("btn-back-diff").addEventListener("click", () => {
    showScreen(screenInstructions);
  });

  /* --- Gestione Timer e Gioco "Il Codice del DNA" --- */

  const timeRemainingEl = document.getElementById("time-remaining");
  let remainingTime = 1200; // 20 minuti in secondi
  let timerInterval;

  function updateTimerDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    timeRemainingEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  function startTimer() {
    console.log("startTimer eseguita");
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

  // Nuove parole per il gioco (4 giuste e 4 sbagliate)
  const wordsData = [
    { text: "codone", isCorrect: true },
    { text: "mRNA", isCorrect: true },
    { text: "tripletta", isCorrect: true },
    { text: "adenina", isCorrect: true },
    { text: "peptide", isCorrect: false },
    { text: "mitosi", isCorrect: false },
    { text: "emoglobina", isCorrect: false },
    { text: "antigene", isCorrect: false }
  ];
  const totalWords = wordsData.length;

  // Funzione per mischiare l'array (Fisher-Yates shuffle)
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function initGame1() {
    console.log("initGame1 eseguita");
    const wordBank = document.getElementById("word-bank");
    wordBank.innerHTML = "";
    document.getElementById("dropzone-correct").innerHTML = "<h3>Parole Corrette</h3>";
    document.getElementById("dropzone-incorrect").innerHTML = "<h3>Parole Errate</h3>";
    document.getElementById("message").textContent = "";

    // Clona e mischia le parole per avere ordine casuale
    const words = [...wordsData];
    shuffleArray(words);

    words.forEach((word, index) => {
      const wordEl = document.createElement("div");
      wordEl.classList.add("draggable-word");
      wordEl.textContent = word.text;
      wordEl.setAttribute("draggable", "true");
      wordEl.dataset.isCorrect = word.isCorrect;
      wordEl.id = "word-" + index;
      wordEl.addEventListener("dragstart", handleDragStart);
      wordEl.addEventListener("dragend", handleDragEnd);
      wordBank.appendChild(wordEl);
    });
  }

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

  // In questo esempio, permettiamo il drop in entrambe le zone senza validare subito la correttezza
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

  const dropzoneCorrect = document.getElementById("dropzone-correct");
  const dropzoneIncorrect = document.getElementById("dropzone-incorrect");
  dropzoneCorrect.addEventListener("dragover", handleDragOver);
  dropzoneCorrect.addEventListener("drop", handleDrop);
  dropzoneIncorrect.addEventListener("dragover", handleDragOver);
  dropzoneIncorrect.addEventListener("drop", handleDrop);

  // Submit game1
  document.getElementById("btn-submit-game1").addEventListener("click", () => {
    const wordBank = document.getElementById("word-bank");
    if (wordBank.children.length > 0) {
      document.getElementById("message").textContent = "Completa il posizionamento di tutte le parole.";
      return;
    }
    const correctWords = document.getElementById("dropzone-correct").querySelectorAll(".draggable-word");
    const incorrectWords = document.getElementById("dropzone-incorrect").querySelectorAll(".draggable-word");
    if (correctWords.length === 4 && incorrectWords.length === 4) {
      let allCorrect = true;
      correctWords.forEach(wordEl => {
        if (wordEl.dataset.isCorrect !== "true") {
          allCorrect = false;
        }
      });
      if (allCorrect) {
        document.getElementById("message").textContent = "Il codice biometrico è accettato, la porta del bunker si apre!";
        // Dopo un breve delay, passa al Gioco 2
        setTimeout(() => {
          showScreen(screenGame2);
          initGame2();
        }, 1000);
        return;
      }
    }
    document.getElementById("message").textContent = "Errore! Hai posizionato le parole in modo errato. Hai perso 1 minuto e devi riprovare.";
    subtractTimePenalty(60);
    setTimeout(initGame1, 2500);
  });

  const cardsData = [
    { text: "iniezione del vaccino", order: 1 },
    { text: "attivazione risposta immunitaria", order: 2 },
    { text: "attivazione linfociti T e B", order: 3 },
    { text: "produzione anticorpi", order: 4 },
    { text: "eliminazione antigene", order: 5 },
    { text: "memoria immunologica", order: 6 }
  ];

  function initGame2() {
    console.log("initGame2 eseguita");
    // Svuota i contenitori degli slot e delle carte
    document.querySelectorAll(".card-slot").forEach(slot => {
      slot.innerHTML = "";
    });
    const cardsContainer = document.getElementById("cards-container");
    cardsContainer.innerHTML = "";
    document.getElementById("game2-message").textContent = "";
  
    // Clona e miscela le carte per ordine casuale
    const cards = [...cardsData];
    shuffleArray(cards);
  
    // Crea gli elementi delle carte e aggiungi gli event listener per il drag & drop
    cards.forEach((card, index) => {
      const cardEl = document.createElement("div");
      cardEl.classList.add("card");
      cardEl.textContent = card.text;
      cardEl.setAttribute("draggable", "true");
      cardEl.dataset.order = card.order; // Ordine corretto della carta
      cardEl.id = "card-" + index;
      cardEl.addEventListener("dragstart", handleCardDragStart);
      cardEl.addEventListener("dragend", handleCardDragEnd);
      cardsContainer.appendChild(cardEl);
    });
  
    // Aggiungi listener per i drop sugli slot (se non già presenti)
    document.querySelectorAll(".card-slot").forEach(slot => {
      slot.addEventListener("dragover", handleCardDragOver);
      slot.addEventListener("drop", handleCardDrop);
    });
  }

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
    // Se lo slot ha già una carta, la sposta nel contenitore delle carte
    if (slot.children.length > 0) {
      const existingCard = slot.firstElementChild;
      document.getElementById("cards-container").appendChild(existingCard);
    }
    slot.appendChild(cardEl);
  }

  document.getElementById("btn-submit-game2").addEventListener("click", () => {
    let allSlotsFilled = true;
    let correctOrder = true;
    document.querySelectorAll(".card-slot").forEach(slot => {
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
      document.getElementById("game2-message").textContent = "Completa il posizionamento di tutte le carte.";
      return;
    }
    if (correctOrder) {
      document.getElementById("game2-message").textContent = "Il sistema immunitario è accettato, il team è sicuro!";
      setTimeout(() => {
        // Mostra la schermata documento per far memorizzare le informazioni
        showScreen(screenDoc);
      }, 1000);
    } else {
      document.getElementById("game2-message").textContent = "Errore! Ordine errato. Hai perso 1 minuto e devi riprovare.";
      subtractTimePenalty(60);
      setTimeout(initGame2, 2500);
    }
  });  

  document.getElementById("btn-doc-continue").addEventListener("click", () => {
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
    console.log("initGame3 eseguita");
    const eventSlotsContainer = document.querySelector(".event-slots");
    eventSlotsContainer.innerHTML = "";
    const datesContainer = document.getElementById("dates-container");
    datesContainer.innerHTML = "";
    document.getElementById("game3-message").textContent = "";

    // Crea una copia di matchData e mescola l'ordine
    const events = [...matchData];
    shuffleArray(events); // ora gli eventi sono in ordine casuale

    events.forEach((item, index) => {
      const slotDiv = document.createElement("div");
      slotDiv.classList.add("event-slot");
      // Salva la data corretta nello slot per la verifica
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

    // Prepara le carte delle date: estrai le date da matchData e mescola l'ordine
    const dates = matchData.map(item => item.date);
    shuffleArray(dates);

    dates.forEach((date, index) => {
      const dateCard = document.createElement("div");
      dateCard.classList.add("date-card");
      dateCard.textContent = date;
      dateCard.setAttribute("draggable", "true");
      dateCard.dataset.date = date;
      dateCard.id = "date-" + index;
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
    // Se lo slot è già occupato, rimetti la carta esistente nel container delle date
    if (dropZone.children.length > 0) {
      const existingCard = dropZone.firstElementChild;
      document.getElementById("dates-container").appendChild(existingCard);
    }
    dropZone.appendChild(dateCard);
  }  
  
  document.getElementById("btn-submit-game3").addEventListener("click", () => {
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
      document.getElementById("game3-message").textContent = "Completa l'abbinamento di tutti gli eventi.";
      return;
    }
    if (allCorrect) {
      document.getElementById("game3-message").textContent = "Accesso ai dati concesso. Frammento del Protocollo Genesi recuperato.";
      // Dopo 1 secondo, passa alla schermata del gioco 4 (Graph1)
      setTimeout(() => {
        // (Opzionale) Resetta le variabili per le risposte di game4
        game4Answer1 = null;
        game4Answer2 = null;
        game4Answer3 = null;
        showScreen(screenGraph1);
      }, 1000);
    } else {
      if (!window.game3Attempts) {
        window.game3Attempts = 3;
      }
      window.game3Attempts--;
      document.getElementById("game3-message").textContent = `Errore di abbinamento. Tentativi rimanenti: ${window.game3Attempts}`;
      if (window.game3Attempts <= 0) {
        setTimeout(initGame3, 1500);
        window.game3Attempts = 3;
      }
    }
  });
   
  // Imposta le risposte corrette per ciascuna domanda
  const correctAnswerGraph1 = "falso";
  const correctAnswerGraph2 = "vero";
  const correctAnswerGraph3 = "falso";

  // Variabili per memorizzare le risposte selezionate
  let game4Answer1 = null;
  let game4Answer2 = null;
  let game4Answer3 = null;

  // Schermata Graph1
  document.querySelectorAll("#screen-graph1 .answer-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      game4Answer1 = btn.dataset.answer;
      if (game4Answer1 === correctAnswerGraph1) {
        document.getElementById("game4-msg1").textContent = "Risposta corretta.";
      } else {
        document.getElementById("game4-msg1").textContent = "Risposta errata. Hai perso 1 minuto.";
        subtractTimePenalty(60);
      }
    });
  });
  document.getElementById("btn-next-graph1").addEventListener("click", () => {
    if (!game4Answer1) {
      document.getElementById("game4-msg1").textContent = "Seleziona una risposta.";
      return;
    }
    // Passa alla schermata Graph2
    showScreen(screenGraph2);
  });

  // Schermata Graph2
  document.querySelectorAll("#screen-graph2 .answer-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      game4Answer2 = btn.dataset.answer;
      if (game4Answer2 === correctAnswerGraph2) {
        document.getElementById("game4-msg2").textContent = "Risposta corretta.";
      } else {
        document.getElementById("game4-msg2").textContent = "Risposta errata. Hai perso 1 minuto.";
        subtractTimePenalty(60);
      }
    });
  });
  document.getElementById("btn-next-graph2").addEventListener("click", () => {
    if (!game4Answer2) {
      document.getElementById("game4-msg2").textContent = "Seleziona una risposta.";
      return;
    }
    showScreen(screenGraph3);
  });

  // Schermata Graph3
  document.querySelectorAll("#screen-graph3 .answer-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      game4Answer3 = btn.dataset.answer;
      if (game4Answer3 === correctAnswerGraph3) {
        document.getElementById("game4-msg3").textContent = "Risposta corretta.";
      } else {
        document.getElementById("game4-msg3").textContent = "Risposta errata. Hai perso 1 minuto.";
        subtractTimePenalty(60);
      }
    });
  });
  document.getElementById("btn-submit-graph3").addEventListener("click", () => {
    if (!game4Answer3) {
      document.getElementById("game4-msg3").textContent = "Seleziona una risposta.";
      return;
    }
    document.getElementById("game4-msg3").textContent = "Accesso ai dati concesso. Frammento del Protocollo Genesi recuperato.";
    setTimeout(() => {
      showScreen(screenGame5);
      // Reset dei slider
      slider1.value = 0;
      slider2.value = 0;
      slider1Value.textContent = "0%";
      slider2Value.textContent = "0%";
    }, 1000);
  });

  const slider1 = document.getElementById("slider1");
  const slider2 = document.getElementById("slider2");
  const slider1Value = document.getElementById("slider1-value");
  const slider2Value = document.getElementById("slider2-value");

  slider1.addEventListener("input", () => {
    slider1Value.textContent = slider1.value + "%";
  });
  slider2.addEventListener("input", () => {
    slider2Value.textContent = slider2.value + "%";
  });

  document.getElementById("btn-submit-game5").addEventListener("click", () => {
    const answer1 = parseInt(slider1.value, 10);
    const answer2 = parseInt(slider2.value, 10);
    
    // Imposta range di accettazione: 
    // Scenario 1: 22-24% (approssimativamente 23%)
    // Scenario 2: 93-95% (approssimativamente 94%)
    let correct1 = (answer1 >= 22 && answer1 <= 24);
    let correct2 = (answer2 >= 93 && answer2 <= 95);
    
    if (correct1 && correct2) {
      document.getElementById("game5-message").textContent = "Backup attivato. Fuga riuscita!";
      // Qui puoi eventualmente mostrare una schermata finale o terminare la missione.
    } else {
      if (typeof window.game5Attempts === "undefined") {
        window.game5Attempts = 3;
      }
      window.game5Attempts--;
      document.getElementById("game5-message").textContent = `Errore. Tentativi rimanenti: ${window.game5Attempts}`;
      if (window.game5Attempts <= 0) {
        document.getElementById("game5-message").textContent = "Sistema bloccato per 2 minuti.";
        slider1.disabled = true;
        slider2.disabled = true;
        document.getElementById("btn-submit-game5").disabled = true;
        setTimeout(() => {
          window.game5Attempts = 3;
          slider1.disabled = false;
          slider2.disabled = false;
          document.getElementById("btn-submit-game5").disabled = false;
          document.getElementById("game5-message").textContent = "";
        }, 120000);
      }
    }
  });

  // Gestione della scelta della difficoltà "Scuola Superiore"
  document.querySelectorAll(".difficulty-button").forEach(btn => {
    btn.addEventListener("click", () => {
      const difficulty = btn.dataset.difficulty;
      console.log("Difficulty scelta:", difficulty);
      if (difficulty === "superiore") {
        console.log("Difficoltà Superiore scelta, avvio gioco 1.");
        showScreen(screenGame1);
        document.getElementById("timer").style.display = "block"; // Mostra il timer
        initGame1();
        remainingTime = 1200; // reset timer
        startTimer();
      } else {
        alert(`Per la difficoltà "Scuola Media" il gioco non è ancora implementato.`);
      }
    });
  });

  document.getElementById("btn-restart").addEventListener("click", () => {
    remainingTime = 1200;
    initGame1();
    startTimer();
    showScreen(screenGame1);
  });

  // Mostra la prima schermata al caricamento
  showScreen(screenStory1);
});
