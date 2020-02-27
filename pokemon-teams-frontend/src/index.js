const BASE_URL = "http://localhost:3000";
const TRAINERS_URL = `${BASE_URL}/trainers`;
const POKEMONS_URL = `${BASE_URL}/pokemons`;
const mainTag = document.querySelector("main");

function beginFetch() {
  fetch(TRAINERS_URL)
    .then(resp => resp.json())
    .then(obj => addTrainerToDom(obj));
}

function addTrainerToDom(obj) {
  for (const pokemonTrainer of obj.data) {
    let trainer = pokemonTrainer.attributes;
    let template = createTemplate(trainer);
    mainTag.innerHTML += template;
  }

  const addPokemonBtns = document.querySelectorAll(".card p + button");
  const releaseBtn = document.querySelectorAll(".card .release");
  addPokemonBtns.forEach(btn => btn.addEventListener("click", addPokemon));
  releaseBtn.forEach(btn => btn.addEventListener("click", releasePokemon));
}

function createPokemonDomElements(pokemonArry) {
  let pokemonsList = ``;
  for (const pokemon of pokemonArry) {
    pokemonsList += createPokemon(pokemon);
  }

  return pokemonsList;
}

function createTemplate(trainer) {
  let pokemonsList = createPokemonDomElements(trainer.pokemons);
  let template = `
    <div class="card" data-id="${trainer.id}">
        <p>${trainer.name}</p>
        <button data-trainer-id="${trainer.id}">Add Pokemon</button>
        <ul>
            ${pokemonsList}
        </ul>
      </div>
  `;
  return template;
}

function addPokemon(e) {
  const trainerId = e.target.dataset.trainerId;
  const trainerCardUl = e.target.nextElementSibling;

  if (trainerCardUl.childElementCount <= 5) {
    let config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ trainer_id: trainerId })
    };

    fetch(POKEMONS_URL, config)
      .then(resp => resp.json())
      .then(pokemon => {
        let pokemonElmt = createPokemon(pokemon);
        trainerCardUl.innerHTML += pokemonElmt;
      })
      .catch(error => console.log(error));
  } else {
    console.log("No More Space");
  }
}

function createPokemon(pokemon) {
  return `
            <li>
                ${pokemon.nickname} (${pokemon.species})
                <button class="release" data-pokemon-id="${pokemon.id}">Release</button>
            </li>`;
}

function releasePokemon(e) {
  const pokemon = e.target.parentElement;
  const pokemonID = e.target.dataset.pokemonId;

  fetch(`${POKEMONS_URL}/${pokemonID}`, { method: "DELETE" });
  // .then(resp => resp.json())
  // .then(obj => console.log(obj));

  pokemon.remove();
}

beginFetch();
