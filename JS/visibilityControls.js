"use strict";

//Array de para el .back de las tarjetas, con su valor para comparar
let cardBackImage = [
  { src: "./images/1.png", value: 1 },
  { src: "./images/2.png", value: 2 },
  { src: "./images/3.png", value: 3 },
  { src: "./images/4.png", value: 4 },
  { src: "./images/5.png", value: 5 },
  { src: "./images/6.png", value: 6 },
  { src: "./images/7.png", value: 7 },
  { src: "./images/8.png", value: 8 },
];

//Declaramos las variables que vamos a utilizar
const divIntentosContent = document.getElementById("divIntentos");
const divFallosContent = document.getElementById("divFallos");
const resetBtnController2 = document.getElementById("resetBtn");
const h3ResultadoContent = document.getElementById("h3Resultado");
const h3NotaFinalContent = document.getElementById("h3NotaFinal");

// Mezclar las tarjetas
cardBackImage = shuffleCards(cardBackImage.concat(cardBackImage));

// Funcion para mezclar las tarjetas
function shuffleCards(cardBackImage) {
  return cardBackImage.sort(() => Math.random() - 0.5);
}

// Funcion para calcular la nota final del usuario sobre 10
function calcularNota(intentos) {
  if (intentos === 8) {
    return 10;
  } else {
    return Math.max(0, 80 / intentos);
  }
}

// Funcion para los contadores de intentos y fallos
function contadores(divIntentosContent, divFallosContent) {
  return {
    intentos: 0,
    fallos: 0,
    incrementarIntentos: function () {
      this.intentos++;
      divIntentosContent.textContent = `Intentos: ${this.intentos}`;
      let nota = calcularNota(this.intentos);

      const guardarNota = (nota) =>
        localStorage.setItem("nota", nota.toFixed(1));
      guardarNota(nota);

      let claseColor = this.determinarClaseColor(nota);
      h3ResultadoContent.textContent = `Lo conseguiste en: ${this.intentos} intentos!`;
      h3NotaFinalContent.innerHTML = `Tu nota final es un: <span class=${claseColor}>${nota.toFixed(
        1
      )}</span> / 10!`;
    },
    incrementarFallos: function () {
      this.fallos++;
      divFallosContent.textContent = `Fallos: ${this.fallos}`;
    },
    reset: function () {
      this.intentos = 0;
      this.fallos = 0;
      divIntentosContent.textContent = `Intentos: ${this.intentos}`;
      divFallosContent.textContent = `Fallos: ${this.fallos}`;
      h3ResultadoContent.textContent = "";
      // Convertir el array a un Set para eliminar duplicados
      let uniqueImages = new Set(
        cardBackImage.map((image) => JSON.stringify(image))
      );
      // Convertir el Set de nuevo a un array
      cardBackImage = Array.from(uniqueImages, (image) => JSON.parse(image));
      cardBackImage = shuffleCards(cardBackImage.concat(cardBackImage));
    },
    determinarClaseColor: function (nota) {
      if (nota < 5) {
        return "nota-baja";
      } else if (nota >= 5 && nota < 7) {
        return "nota-media";
      } else if (nota >= 7 && nota < 9) {
        return "nota-alta";
      } else {
        return "nota-muy-alta";
      }
    },
  };
}

//Declaramos la variable que va a contener los contadores de intentos y fallos
const counters = contadores(divIntentosContent, divFallosContent);

document.addEventListener("DOMContentLoaded", function () {
  const gameContent = document.getElementById("gameContent");
  const headerContent = document.querySelector("header");
  const startGameBtn = document.getElementById("startGame");
  const userInput = document.getElementById("user");
  const container = document.querySelector(".container");
  const divUserContent = document.getElementById("divUser");
  const divContadorContent = document.getElementById("divContador");
  const divTextContadorContent = document.getElementById("divTextContador");
  const resetBtnContent = document.getElementById("resetBtn");
  const divResultadoJuegoContent = document.getElementById("divResultadoJuego");
  const divRankingContent = document.getElementById("divRanking");
  const pFromRanking = document.getElementsByClassName("pRanking");
  const divBackgroundContent = document.getElementById("divBackground");

  gameContent.classList.add("hidden");
  divUserContent.classList.add("hidden");
  divContadorContent.classList.add("hidden");
  divTextContadorContent.classList.add("hidden");
  divIntentosContent.classList.add("hidden");
  resetBtnContent.classList.add("hidden");
  divRankingContent.classList.add("hidden");
  divRankingContent.classList.add("parteOculta");
  startGameBtn.addEventListener("click", startGame);
  resetBtnController2.addEventListener("click", resetGame);

  for (let i = 0; i < pFromRanking.length; i++) {
    pFromRanking[i].classList.add("hidden");
  }

  //Funcion para empezar el juego

  function startGame(event) {
    event.preventDefault();
    if (userInput.value.trim() !== "") {
      headerContent.classList.add("hidden");
      gameContent.classList.remove("hidden");
      divUserContent.classList.remove("hidden");
      divContadorContent.classList.remove("hidden");
      divTextContadorContent.classList.remove("hidden");
      divIntentosContent.classList.remove("hidden");
      resetBtnContent.classList.remove("hidden");
      divRankingContent.classList.remove("hidden");
      divBackgroundContent.classList.add("borroso");
      divResultadoJuegoContent.classList.add("parteOculta");
      counters.reset();
      initializeGame();
    }
  }

  //Funcion para inicializar el juego
  function initializeGame() {
    container.innerHTML = "";

    // Crear las tarjetas
    for (let i = 0; i < cardBackImage.length; i++) {
      const card = document.createElement("article");
      const content = document.createElement("ul");
      const front = document.createElement("li");
      const back = document.createElement("li");
      const img = document.createElement("img");

      card.classList.add("card");
      card.classList.add("flipped");
      content.classList.add("content");
      front.classList.add("front");
      back.classList.add("back");

      // Asignar valor a la tarjeta trasera
      img.src = cardBackImage[i].src;
      img.dataset.value = cardBackImage[i].value;
      back.dataset.value = cardBackImage[i].value;
      back.appendChild(img);

      // Asignar imagen al frente
      const frontImg = document.createElement("img");
      frontImg.src = "./images/logo-cartas.png";
      frontImg.alt = "logo hack a boss";
      front.appendChild(frontImg);
      content.appendChild(front);
      content.appendChild(back);
      card.appendChild(content);
      container.appendChild(card);
      card.addEventListener("click", reveal);
    }
  }

  // Función para girar las tarjetas
  let flippedCards = [];
  function reveal(e) {
    const currentCard = e.currentTarget;
    if (flippedCards.length < 2 && !currentCard.classList.contains("flipped")) {
      currentCard.classList.add("flipped");
      flippedCards.push(currentCard);
    }

    // Si hay dos tarjetas volteadas y compararlas para ver si son iguales
    if (flippedCards.length === 2) {
      const img1Value =
        flippedCards[0].querySelector(".back img").dataset.value;
      const img2Value =
        flippedCards[1].querySelector(".back img").dataset.value;

      if (img1Value === img2Value) {
        // Añadir la clase 'matched' a los elementos 'li' con la clase 'back'
        flippedCards[0].querySelector(".back").classList.add("matched");
        flippedCards[1].querySelector(".back").classList.add("matched");
        flippedCards = [];
        matchedCards++;
        checkMatchedCards();
        counters.incrementarIntentos();
      } else {
        setTimeout(() => {
          flippedCards[0].classList.remove("flipped");
          flippedCards[1].classList.remove("flipped");
          flippedCards = [];
          counters.incrementarFallos();
          counters.incrementarIntentos();
        }, 500);
      }
    }
  }

  // Función para salir del juego desde el main
  const exitMainBtn = document.getElementById("exitBtn");
  exitMainBtn.addEventListener("click", function () {
    location.reload();
  });

  //Funcion para reiniciar el juego
  function resetGame() {
    counters.reset();
    container.innerHTML = "";
    divResultadoJuegoContent.classList.add("parteOculta");
    divResultadoJuegoContent.classList.remove("parteVisible");
    gameContent.classList.remove("parteOculta");
    btnRankingContent.classList.remove("hidden");

    matchedCards = 0;
    initializeGame();
  }

  // Función botón de volver a jugar desde el div del resultado
  const btnGameAgainContent = document.getElementById("btnGameAgain");
  btnGameAgainContent.addEventListener("click", resetGame);

  // Función para salir del juego desde el div del resultado
  const btnExitGameContent = document.getElementById("btnExitGame");
  btnExitGameContent.addEventListener("click", function () {
    location.reload();
  });

  // Función para que cuando matchedCards sea igual a 8, se muestre el div con el resultado del juego
  let matchedCards = 0;
  async function checkMatchedCards() {
    // Esperar a que todas las demás tareas síncronas hayan terminado
    await new Promise((resolve) => setTimeout(resolve, 0));

    if (matchedCards === 8) {
      gameContent.classList.add("parteOculta");
      divResultadoJuegoContent.classList.add("parteVisible");
      divRankingContent.classList.add("parteOculta");
      btnRankingContent.classList.add("hidden");
    }
  }
});

// Función para mostrar el ranking con el botón ranking
const btnRankingContent = document.getElementsByClassName("btnRanking")[0];

btnRankingContent.addEventListener("click", function () {
  const pFromRanking = document.getElementsByClassName("pRanking");
  const divRankingContent = document.getElementById("divRanking");
  divRankingContent.classList.toggle("parteOculta");
  btnRankingContent.classList.toggle("btnPulsado");

  for (let i = 0; i < pFromRanking.length; i++) {
    pFromRanking[i].classList.toggle("hidden");
  }
});
