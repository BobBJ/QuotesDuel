/* eslint-disable no-use-before-define */
/* ******************************************************************
 * Constantes de configuration
 */
const apiKey = "1f4b643f-195e-4052-b5cc-86f0cd3f7f14";
const serverUrl = "https://lifap5.univ-lyon1.fr";

/* ******************************************************************
 * Gestion des tabs "Voter" et "Toutes les citations"
 ******************************************************************** */

/**
 * Affiche/masque les divs "div-duel" et "div-tout"
 * selon le tab indiqué dans l'état courant.
 *
 * @param {Etat} etatCourant l'état courant
 */
function majTab(etatCourant) {
  const dDuel = document.getElementById("div-duel");
  const dTout = document.getElementById("div-tout");
  const tDuel = document.getElementById("tab-duel");
  const tTout = document.getElementById("tab-tout");
  if (etatCourant.tab === "duel") {
    dDuel.style.display = "flex";
    tDuel.classList.add("is-active");
    dTout.style.display = "none";
    tTout.classList.remove("is-active");
  } else {
    dTout.style.display = "flex";
    tTout.classList.add("is-active");
    dDuel.style.display = "none";
    tDuel.classList.remove("is-active");
  }
}

/**
 * Efface toutes les données de l'html,
 * permet de garantir que les données ne se chevauchent pas.
 */

function clearpage() {
  console.log("CALL clearpage");
  const localisationtab = document.querySelector(".tabtoutcit");
  localisationtab.innerHTML = "";
}
/**
 * Mets au besoin à jour l'état courant lors d'un click sur un tab.
 * En cas de mise à jour, déclenche une mise à jour de la page.
 *
 * @param {String} tab le nom du tab qui a été cliqué
 * @param {Etat} etatCourant l'état courant
 */
function clickTab(tab, etatCourant) {
  console.log(`CALL clickTab(${tab},...)`);
  if (tab === "tout") {
    clearpage();
    majcit(etatCourant);
  }
  if (tab === "duel") {
    clearpage();
    affichagevote();
  }
  if (etatCourant.tab !== tab) {
    etatCourant.tab = tab;
    majPage(etatCourant);
  }
}

/**
 * Enregistre les fonctions à utiliser lorsque l'on clique
 * sur un des tabs.
 *
 * @param {Etat} etatCourant l'état courant
 */
function registerTabClick(etatCourant) {
  document.getElementById("tab-duel").onclick = () =>
    clickTab("duel", etatCourant);
  document.getElementById("tab-tout").onclick = () =>
    clickTab("tout", etatCourant);
}

/* ******************************************************************
 * Gestion de la boîte de dialogue (a.k.a. modal) d'affichage de
 * l'utilisateur.
 * ****************************************************************** */

/**
 * Fait une requête GET authentifiée sur /whoami
 * @returns une promesse du login utilisateur ou du message d'erreur
 */
function fetchWhoami() {
  return fetch(serverUrl + "/whoami", { headers: { "x-api-key": apiKey } })
    .then((response) => response.json())
    .then((jsonData) => {
      if (jsonData.status && Number(jsonData.status) != 200) {
        return { err: jsonData.message };
      }
      return jsonData;
    })
    .catch((erreur) => ({ err: erreur }));
}

/**
 * Fait une requête sur le serveur et insère le login dans
 * la modale d'affichage de l'utilisateur.
 * @returns Une promesse de mise à jour
 */
function lanceWhoamiEtInsereLogin() {
  return fetchWhoami().then((data) => {
    const elt = document.getElementById("elt-affichage-login");
    const ok = data.err === undefined;
    if (!ok) {
      elt.innerHTML = `<span class="is-error">${data.err}</span>`;
    } else {
      elt.innerHTML = `Bonjour ${data.login}.`;
    }
    return ok;
  });
}


/***************DEBUT DE NOS FONCTIONS **********************/

/***** AFFICHAGE CITATIONS NORMALES ******/

/**
 * Récupère toutes les citations du serveur.
 * @returns une promesse de récupération des données.
 */

async function getallcit() {
  const url = serverUrl + "/citations";
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

/**
 * Stop le porgramme pendant ms millisecondes
 * @param {Number} ms Nombre de millisecondes de stop
 */
function wait(ms) {
  const chrono = {start : Date , end: Date };
  chrono.start = new Date().getTime();
  chrono.end = chrono.start;
  while (chrono.end < chrono.start + ms) {
    chrono.end = new Date().getTime();
  }
}

/**
 * Transforme des valeurs acquéries grâce au JavaScript en
 * balises html utilisées pour l'affichage.
 * Cette fonction est utilisée pour l'affichage basique de chaque citation.
 * @param {Number} index 
 * @param {String} quote 
 * @param {String} character
 * @returns L'html crée à partir des données JavaScript.
 */
function rendercitnorm(index,quote,character)
{
  console.log("CALL renderecitnorm");
  return (`<div class="user">
    <table is-bordered class="table">
    <tr>
     <th>${index}</th><td> </td> 
     <td>${quote}</td><td></td> 
     <td>${character}</td><td> 
     <button onclick="elargir(${index})" id="elargir${index}">
     Elargir</button></td> 
     <td> <button onclick ="changerform(${index})" id="changer${index}">
     Changer</button></td>
     <td><button onclick ="Ajouter()">
     Ajouter</button></td>
    </tr>
    <table> 
    </div>`);
}

/**
 * Met à jour la liste des citation
 * et affiche cette dernière dans l'onglet toutes les citations.
 * Ajoute aussi les boutons nécessaires au fonctionnement sur chaque ligne.
 * @param {Etat} etatCourant l'état courant
 */

async function majcit(etatCourant) {
  console.log("CALL majcit");
  wait(1000);
  console.log("call2 majcit 5 sec");
  const users = await getallcit();
  etatCourant.citation.html = renderfiltre(); 
  etatCourant.index = 0;
  users.forEach((user) => { 
    etatCourant.citation.html += rendercitnorm(etatCourant.index,
                                              user.quote,user.character);
    etatCourant.index += 1;
  });
  etatCourant.citation.nbrecit = etatCourant.index;
  const localisationtab = document.querySelector(".tabtoutcit");
  localisationtab.innerHTML = etatCourant.citation.html;
}

/******************* */


/******DETAILS DES CITATIONS*******/

/**
 * Transforme des valeurs acquéries grâce au JavaScript en
 * balises html utilisées pour l'affichage.
 * Cette fonction est utilisée pour les détails d'une citation.
 * @param {Number} index Index de la citation 
 * @param {String} quote citation
 * @param {String} character personnage qui dit la citation
 * @param {String} image lien vers une image du personnage
 * @param {String} characterdir Direction du personnage
 * @param {String} origin Origine de la citation
 * @param {String} added numéro d'étudiant de la personne qui l'ajoute
 * @returns L'html crée à partir des données JavaScript
 */
function rendercitelargie(index,quote,character,image,characterdir,origin,added)
{
  console.log("CALL renderelargi");
  return (`<div class="user">
  <table is-bordered class="table">
  <tr>
    <th>${index}</th><td> </td> 
    <td>${quote}</td><td></td> 
    <td>${character}</td>
    <td>${image}</td>
    <td>${characterdir}</td>
    <td>${origin}</td>
    <td>${added}</td>
    <td> <button onclick ="changerform(${index})" id="changer${index}">
    Changer</button></td>
    <td><button onclick ="Ajouter()">
    Ajouter</button></td>
  </tr>
  <table> 
</div>`);
}

/**
 * Récupère le numéro de ligne que l'utilisateur souhaite élargir
 * puis lance une fonction plus précise
 * permettant d'élargir cette ligne précise.
 * @param {Number} id Numéro de la citation à élargir
 */

function elargir(id) {
  const etatInitial = {
    tab: "duel",
    loginModal: false,
    citation: { quote: [], character: [], html: String, nbrecit: Number },
    index: Number,
  };
  majcit(etatInitial);
  elargirCitation(etatInitial, id);
}

/**
 * Fonction plus précise qui permet d'élargir une citation dans le tableau.
 * Elle changera donc l'affichage du tableau des citations.
 * @param {Etat} etatCourant l'état courant
 * @param {Number} idelargir Numéro de la citation
 */

async function elargirCitation(etatCourant, idelargir) {
  console.log("CALL elargir");
  majcit(etatCourant);
  const users = await getallcit();
  etatCourant.citation.html = renderfiltre();
  etatCourant.index = 0;
  users.forEach((user) => {
    if (etatCourant.index == idelargir) {
      etatCourant.citation.html += rendercitelargie(etatCourant.index,
        user.quote, user.character, user.image,
        user.characterDirection, user.origin, user.addedBy);
    } else {
      etatCourant.citation.html += rendercitnorm(etatCourant.index, user.quote,
                                                              user.character);
    }
    etatCourant.index += 1;
  });
  etatCourant.nbrecit = etatCourant.index;
  const localisationtab = document.querySelector(".tabtoutcit");
  localisationtab.innerHTML = etatCourant.citation.html;
}

/*********************/


/********FILTRE********/

/**
 * Crée l'html nécessaire pour l'affichage des champs à remplir pour le filtre.
 * @returns L'html crée.
 */
function renderfiltre()
{
  console.log("CALL renderfiltre()");
  return( `<div class="user">
  <table is-bordered class="table">
  <tr> 
  <td>Filtre Citation:</label><input type="text" id="filtragecitation">
  </br ><button class="favorite styled"
  type="button" id="filtragecitation" onclick="filtre(1)">
  Filtrer
  </button> </div></td>
  <td> Filtre Personnage:</label><input type="text" id="filtragepersonnage"> 
  </br ><button class="favorite styled"
  type="button" id="filtragepersonnage" onclick="filtre(2)">
  Filtrer
  </button> </div></td>
  <td> Filtre Image:</label><input type="text" id="filtrageimage"></br > 
  <button class="favorite styled"
  type="button" id="filtrageimage" onclick="filtre(3)">
  Filtrer
  </button> </div></td>
  <td> Filtre Direction:</label><input type="text" id="filtragedirection"> 
  </br ><button class="favorite styled"
  type="button" id="filtragedirection" onclick="filtre(4)">
  Filtrer
  </button> </div></td>
  <td> Filtre Origin:</label><input type="text" id="filtrageorigin"> 
  </br ><button class="favorite styled"
  type="button" id="filtrageorigin" onclick="filtre(5)">
  Filtrer
  </button> </div></td>
  <td> Filtre Ajouteur:</label><input type="text" id="filtrageajouteur">
  </br ><button class="favorite styled"
  type="button" id="filtrageajouteur" onclick="filtre(6)">
  Filtrer
  </button> </div></td> </tr>`);
}

/**
 * Récupère la colonne que l'utilisateur souhaite filtrer ainsi que le filtre.
 * Lance ensuite une fonction de filtre plus précise
 * avec les paramètres récupérés.
 * @param {Number} choix Numéro du filtre à utiliser (1 à 6)
 */
async function filtre(choix) {
  const etatInitial = {
    tab: "duel",
    loginModal: false,
    citation: { quote: [], character: [], html: String, nbrecit: Number },
    nbrefiltre: Number,
    Filtre: String,
    NbreF: Number,
    index: Number,
  };
  const citfiltre = await lancemenfiltre(etatInitial, choix);
}

/**
 * Permet de lancer le filtre en fonction du choix
 * acquérit par la fonction Filtre(choix).
 * @param {Etat} etatF Etat lors du filtrage
 * @param {Number} choix Numéro du filtre à utiliser (1 à 6)
 */
async function lancemenfiltre(etatF, choix)
{
  if (choix == 1) {
    etatF.Filtre = document.getElementById("filtragecitation").value;
    etatF.NbF = await filtrecit(etatF, "citation", etatF.Filtre, "N");
  } else if (choix == 2) {
    etatF.Filtre = document.getElementById("filtragepersonnage").value;
    etatF.NbF = await filtrecit(etatF, "personnage", etatF.Filtre, "N");
  } else if (choix == 3) {
    etatF.Filtre = document.getElementById("filtrageimage").value;
    etatF.NbF = await filtrecit(etatF, "image", etatF.Filtre, "N");
  } else if (choix == 4) {
    etatF.Filtre = document.getElementById("filtragedirection").value;
    etatF.NbF = await filtrecit(etatF, "direction", etatF.Filtre, "N");
  } else if (choix == 5) {
    etatF.Filtre = document.getElementById("filtrageorigin").value;
    etatF.NbF = await filtrecit(etatF, "origin", etatF.Filtre, "N");
  } else if (choix == 6) {
    etatF.Filtre = document.getElementById("filtrageajouteur").value;
    etatF.NbF = await filtrecit(etatF, "ajouteur", etatF.Filtre, "N");
  }
  return (etatF.NbF);
}

/**
 * Fonction de filtre qui est lancé par filtre().
 * Elle permet de choisir une certaine colonne et de filtrer cette colonne
 * avec un filtre précis qu'elle récupère dans l'input adéquat.
 * @param {Etat} etatInitial l'état Initial
 * @param {String} ch le nom du filtre à utiliser
 * @param {String} filtretest Le string du filtre à utiliser
 * @param {String} t Indication du mode de la fonction : en test ou non.
 * @returns Nombre de citations gardées après filtrage.
 */

async function filtrecit(etatInitial, ch, filtretest, t) {
  console.log("CALL filtrer");
  wait(1000);
  console.log("call2 filtrer 5 sec");
  majcit(etatInitial);
  const users = await getallcit();
  etatInitial.citation.html = renderfiltre();
  etatInitial.index = 0;
  etatInitial.nbrefiltre = 0;
  users.forEach((user) => {
    const regex = new RegExp(`^.*` + filtretest + `.*$`)
    if (ch == "citation") {
      if (user.quote !== undefined && user.quote.match(regex)) {
        etatInitial.citation.html += rendercitnorm(etatInitial.index,
                                                   user.quote,user.character);
        etatInitial.nbrefiltre += 1;
      }
      etatInitial.index += 1;
    } else if (ch == "personnage") {
      if (user.character !== undefined && user.character.match(regex)) {
        etatInitial.citation.html += rendercitnorm(etatInitial.index, 
                                                   user.quote,user.character);
        etatInitial.nbrefiltre += 1;
      }
      etatInitial.index += 1;
    } else if (ch == "image") {
      if (user.image !== undefined && user.image.match(regex)) {
        etatInitial.citation.html += rendercitnorm(etatInitial.index,
                                                   user.quote,user.character);
        etatInitial.nbrefiltre += 1;
      }
      etatInitial.index += 1;
    } else if (ch == "direction") {
      if (user.characterDirection !== undefined &&
          user.characterDirection.match(regex)) {
        etatInitial.citation.html += rendercitnorm(etatInitial.index,
                                                   user.quote,user.character);
        etatInitial.nbrefiltre += 1;
      }
      etatInitial.index += 1;
    } else if (ch == "origin") {
      if (user.origin !== undefined && user.origin.match(regex)) {
        etatInitial.citation.html += rendercitnorm(etatInitial.index,
                                                   user.quote, user.character);
        etatInitial.nbrefiltre += 1;
      }
      etatInitial.index += 1;
    } else if (ch == "ajouteur") {
      if (user.addedBy !== undefined && user.addedBy.match(regex)) {
        etatInitial.citation.html += rendercitnorm(etatInitial.index,
                                                   user.quote, user.character);
        etatInitial.nbrefiltre += 1;
      }
      etatInitial.index += 1;
    }
  });
  etatInitial.citation.nbrecit = etatInitial.index;
  const localisationtab = document.querySelector(".tabtoutcit");
  if (t !== "test") {
    localisationtab.innerHTML = etatInitial.citation.html;
  }
  return etatInitial.nbrefiltre;
}

/*********************/


/******AJOUTER CITATION********/

/**
 * Remplace la liste des citations par un formulaire à remplir
 * pour ajouter une autre citation sur le serveur.
 */

function Ajouter() {
  const etatInitial = {
    tab: "duel",
    loginModal: false,
    citation: { quote: [], character: [], html: String, nbrecit: Number },
  };
  etatInitial.citation.html = `<div for="citexpand"> <br><form method="post">
   <div>
     <label for="citation">Quel citation voulez‑vous envoyer?</label>
     <input name="say" id="citation">
   </div>
   <div>
     <label for="personnage">Qui est le personnage?</label>
     <input name="personnage" id="personnage">
   </div>
   <div>
     <label for="lienimage">Lien vers une image</label>
     <input name="lienimage" id="lienimage">
   </div>
   <div>
     <label for="directioncit">Direction du personnage?</label>
     <input name="directioncit" id="directioncit">
   </div>
   <div>
     <label for="originecit">Origine de la citation?</label>
     <input name="originecit" id="originecit">
   </div>
   </form><div>
   <button id="OnClickcit" onclick="sendata()">Envoyer la citation</button>
   </div>`;
  const localisationtab = document.querySelector(".tabtoutcit");
  localisationtab.innerHTML = etatInitial.citation.html;
}

/**
 * Permet d'acquérir les valeurs renseignées par l'utilisateur
 * dans le form d'ajout de citation.
 * @returns L'objet contenant toutes les données acquéries.
 */

function getdatasent() {
  const data = {
    q: String,
    c: String,
    i: String,
    cd: String,
    or: String,
  };
  data.q = document.getElementById("citation").value;
  data.c = document.getElementById("personnage").value;
  data.i = document.getElementById("lienimage").value;
  data.cd = document.getElementById("directioncit").value;
  data.or = document.getElementById("originecit").value;

  return data;
}

/**
 * Test des zones de saisies nécessaires pour vérifier qu'elles ne sont
 * pas vides. Sinon on affiche une alerte.
 * @param {String} quote citation à tester
 * @param {String} character personnage à tester.
 * @param {String} origin origine à tester.
 */
function lanceralarme(quote, character, origin) {
  if (quote === "") {
    window.alert("Vous avez oublié de remplir le champ de la citation");
  }
  if (character === "") {
    window.alert("Vous avez oublié de remplir le champ du personnage");
  }
  if (origin === "") {
    window.alert("Vous avez oublié de remplir le champ de l'origine");
  }
}

/**
 * Fonction intermédiaire permettant de lancer la fonction pour la requête POST
 */
function sendata() {
  const data = getdatasent();
  console.log(data);
  sendataprecis(data);
}

/**
 * Envoie une requête POST pour ajouter une citation sur le serveur.
 * Préviens l'utilisateur avec une alerte
 * en cas de manquement de données nécessaires.
 * @param {Object} data Les données à envoyer avec la requête.
 */

function sendataprecis(data) {
  console.log("CALL sendata()");
  if (data.q !== "" && data.c !== "" && data.or !== "") {
    fetch(serverUrl + "/citations", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quote: data.q,
        character: data.c,
        image: data.i,
        characterDirection: data.cd,
        origin: data.or,
      })
    });
  } else {
    lanceralarme(data.q, data.c, data.or);
  }
  const etatInitial = {
    tab: "duel",
    loginModal: false,
    citation: {html: String, nbrecit: Number, index: Number },
  };
  majcit(etatInitial);
}

/*********************/

/******CHANGER CITATION EXISTANTE*******/

/**
 * Remplace la liste des citations
 * par un formulaire contenant les données
 * préremplies de la citation qu'on veut changer.
 * @param {Number} id Numéro de la citation à préremplir dans le formulaire
 */

async function changerform(id) {
  const etatInitial = {
    tab: "duel",
    loginModal: false,
    citation: { quote: [], character: [], html: String, nbrecit: Number },
    index: Number,
  };
  const users = await getallcit();
  etatInitial.index = 0;
  users.forEach((user) => {
    if (etatInitial.index === id) {
      etatInitial.citation.html = `<div>
   <label for="nouvcitation">Nouvelle citation ?</label>
   <input name="nouvcitation" id="nouvcitation" value = "${user.quote}">
</br >

   <label for="nouvpersonnage">Nouveau personnage?</label>
   <input name="nouvpersonnage" id="nouvpersonnage" value = "${user.character}">
</br >
 
   <label for="nouvlienimage">Nouveau Lien vers une image</label>
   <input name="nouvlienimage" id="nouvlienimage" value = "${user.image}">
</br >
 
   <label for="nouvdirectioncit">Nouvelle Direction du personnage?</label>
   <input name="nouvdirectioncit" id="nouvdirectioncit" 
   value = "${user.characterDirection}">
 </br >
 
   <label for="nouvoriginecit">Nouveau Origine de la citation?</label>
   <input name="nouvoriginecit" id="nouvoriginecit" value = "${user.origin}">
   </br >
 <button id="OnClickcit2" onclick="changercit(${id})">Changer citation</button> 
 </div> `;
    }

    etatInitial.index += 1;
  });

  const localisationtab = document.querySelector(".tabtoutcit");
  localisationtab.innerHTML = etatInitial.citation.html;
}


/**
 * Permet d'acquérir les valeurs renseignées par l'utilisateur
 * dans le form de modification de citation.
 * @returns L'objet contenant toutes les données acquéries.
 */
function getdatachange() {
  const datach = {
    q: String,
    c: String,
    i: String,
    cd: String,
    or: String,
  };
  datach.q = document.getElementById("nouvcitation").value;
  datach.c = document.getElementById("nouvpersonnage").value;
  datach.i = document.getElementById("nouvlienimage").value;
  datach.cd = document.getElementById("nouvdirectioncit").value;
  datach.or = document.getElementById("nouvoriginecit").value;

  return datach;
}
/**
 * A partir d'un numéro de citation à changer précis,
 * cette fonction permet de déterminer son ID sur le serveur
 * puis de le communiquer à une fonction plus pfiltrecitrécise
 * qui se chargera de faire une requête PUT.
 * @param {Number} id Numéro de la citation à changer
 */

async function changercit(id) {
  console.log("CALL changercit");
  const etatInitial = {
    tab: "duel",
    loginModal: false,
    citation: { quote: [], character: [], html: String, nbrecit: Number },
    index: Number,
  };
  if (id === "") {
    window.alert("Vous avez oublié le numéro de la citation à changer");
  }
  const users = await getallcit();
  etatInitial.index = 0;
  users.forEach((user) => {
    if (etatInitial.index == id) {
      changecitprecis(user._id, getdatachange());
    }
    etatInitial.index += 1;
  });
  majcit(etatInitial);
}


/**
 * Envoie une requête PUT contenant les données renseignées par
 * l'utilisateur dans le formulaire de changement
 * pour changer une citation précise.
 * Elle enverra aussi une alerte en cas de manque de données.
 * @param {Number} nbreachange ID sur le serveur de la citation à changer
 * @param {Object} data Les données à envoyer avec la requête.
 */

function changecitprecis(nbreachange, data) {
  console.log("CALL changecitprecis");
  if (data.q !== "" && data.c !== "" && data.or !== "") {
    fetch(serverUrl + "/citations/" + nbreachange + "/", {
      method: "PUT",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quote: data.q,
        character: data.c,
        image: data.i,
        characterDirection: data.cd,
        origin: data.or,
      })
    });
  } else {
    lanceralarme(data.q, data.c, data.or);
  }
}

/*********************/


/*****DUELS******/

/**
 * Retourne un entier aléatoire entre 0 et un paramètre nbre
 * @param {Number} nbre Borne supérieur pour la prise aléatoire
 * @returns un nombre aléatoire entre 0 et nbre
 */

function aleatoire(nbre) {
  const alea = Math.floor(Math.random() * (nbre - 0) + 0);
  return alea;
}

/**
 * Retourne un entier aléatoire entre 0 et un paramètre nbre - 1.
 * Ou 0 à nbre si c'est égal au deuxième paramètre.
 * De plus, si l'entier et identique avec l'entier passé en paramètre,
 * on ajoute 1 au retour.
 * @param {Number} nbre Borne supérieur pour la prise aléatoire
 * @param {Number} aleaP nombre auquel le nombre retourné ne doit pas être égal
 * @returns un nombre aléatoire entre 0 et nbre
 */

function aleatoiremoins(nbre, aleaP) {
  const aleamoins = Math.floor(Math.random() * ((nbre - 1) - 0) + 0);
  if (aleamoins === aleaP) {
    return aleamoins + 1;
  }
  return aleamoins;
}

/**
 * Retourne le nombre de citations du serveur
 * @returns Nombre de citations du serveur
 */

async function nbredecit() {
  const users = await getallcit();
  const etatInitial = {
    tab: "duel",
    loginModal: false,
    citation: {
      html: String,
      nbrecit: Number,
    },
  };
  etatInitial.citation.nbrecit = 0;
  users.forEach((user) => {
    etatInitial.citation.nbrecit += 1;
  });
  return etatInitial.citation.nbrecit;
}

/**
 * Choisi deux citations au hasard parmi toutes les citations du serveur
 * et les affiche dans l'onglet de vote. Prend aussi
 * en charge le sens d'une image (s'il est renseigné)
 * et change le sens d'une image pour faire en sorte
 * que les personnages se regardent.
 */

async function affichagevote() {
  const etatInitial = {
    tab: "duel",
    loginModal: false,
    citation: {
      quote: [],
      character: [],
      html: String,
      nbrecit: Number,
      choix: Number,
      choix2: Number,
      index: Number,
    },
    vote: {
      quote2: String,
      character2: String,
      image: String,
      characterdir: String,
      origin2: String,
    },
  };
  console.log("CALL affichagevote");
  majcit(etatInitial);
  const users = await getallcit();
  etatInitial.citation.nbrecit = await nbredecit();
  etatInitial.citation.index = 0;
  etatInitial.citation.choix2 = aleatoire(etatInitial.citation.nbrecit);
  etatInitial.citation.choix = aleatoiremoins(etatInitial.citation.nbrecit,
                                              etatInitial.citation.choix2);
  users.forEach((user) => {
    if (etatInitial.citation.choix < etatInitial.citation.choix2) {
      if (etatInitial.citation.index === etatInitial.citation.choix) {
        etatInitial.vote.quote2 = user.quote;
        etatInitial.vote.character2 = user.character;
        etatInitial.vote.origin2 = user.origin;
        etatInitial.vote.image = user.image;
        etatInitial.vote.characterdir = user.characterDirection;
      }
      if (etatInitial.citation.index === etatInitial.citation.choix2) {
        etatInitial.citation.html = `
        <div class="columns">
        <div class="column is-half">
          <div class="card">
            <div class="columns card-content">
              <div class="column is-one-third">
                <div class="card-image">
                <figure class="image">
                `;
        if (
          user.characterDirection === "Right" ||
          user.characterDirection === "right" ||
          user.characterDirection === "droit" ||
          user.characterDirection === "Droit"
        ) {
          etatInitial.citation.html =
            etatInitial.citation.html +
            `<img src="${user.image}"
                  style="transform: scaleX(-1)"
                /> `;
        } else {
          etatInitial.citation.html =
            etatInitial.citation.html +
            `<img
                  src="${user.image}"
                />`;
        }
        etatInitial.citation.html =
          etatInitial.citation.html +
          `</figure>
                </div>
              </div>
              <div class="column is-8">
                <p class="title">${user.quote}</p>
                <p class="subtitle">${user.character} dans ${user.origin}</p>
              </div>
            </div>
            <div class="card-content">
              <div class="columns is-centered">
                <p class="button is-danger">
                  Voter pour la citation de gauche !
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-half">
          <div class="card">
            <div class="columns card-content">
              <div class="column is-8">
                <p class="title">
                  ${etatInitial.vote.quote2}
                </p>
                <p class="subtitle">${etatInitial.vote.character2} 
                dans ${etatInitial.vote.origin2}</p>
              </div>
              <div class="column is-one-third">
                <div class="card-image">
                `;
        if (
          etatInitial.vote.characterdir === "Left" ||
          etatInitial.vote.characterdir === "left" ||
          etatInitial.vote.characterdir === "Gauche" ||
          etatInitial.vote.characterdir === "gauche"
        ) {
          etatInitial.citation.html =
            etatInitial.citation.html +
            `<img src="${etatInitial.vote.image}"
                   style="transform: scaleX(-1)"
                 /> `;
        } else {
          etatInitial.citation.html =
            etatInitial.citation.html +
            `<img
                   src="${etatInitial.vote.image}"
                 />`;
        }
        etatInitial.citation.html =
          etatInitial.citation.html +
          `</figure>
                </div>
              </div>
            </div>
            <div class="card-content">
              <div class="columns is-centered">
                <p class="button is-info">Voter pour la citation de droite !</p>
              </div>
            </div>
          </div>
        </div>
      `;
        const localisationtab = document.querySelector(".tabtoutvote");
        localisationtab.innerHTML = etatInitial.citation.html;
      }
    }

    if (etatInitial.citation.choix > etatInitial.citation.choix2) {
      if (etatInitial.citation.index === etatInitial.citation.choix2) {
        etatInitial.vote.quote2 = user.quote;
        etatInitial.vote.character2 = user.character;
        etatInitial.vote.origin2 = user.origin;
        etatInitial.vote.image = user.image;
        etatInitial.vote.characterdir = user.characterDirection;
      }
      if (etatInitial.citation.index === etatInitial.citation.choix) {
        etatInitial.citation.html = `
        <div class="columns">
        <div class="column is-half">
          <div class="card">
            <div class="columns card-content">
              <div class="column is-one-third">
                <div class="card-image">
                  <figure class="image"> `;
        if (
          user.characterDirection === "Right" ||
          user.characterDirection === "right" ||
          user.characterDirection === "droit" ||
          user.characterDirection === "Droit"
        ) {
          etatInitial.citation.html =
            etatInitial.citation.html +
            `<img src="${user.image}"
          style="transform: scaleX(-1)"
        /> `;
        } else {
          etatInitial.citation.html =
            etatInitial.citation.html +
            `<img
          src="${user.image}"
        />`;
        }
        etatInitial.citation.html =
          etatInitial.citation.html +
          `</figure>
                </div>
              </div>
              <div class="column is-8">
                <p class="title">${user.quote}</p>
                <p class="subtitle">${user.character} dans ${user.origin}</p>
              </div>
            </div>
            <div class="card-content">
              <div class="columns is-centered">
                <p class="button is-danger">
                  Voter pour la citation de gauche !
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-half">
          <div class="card">
            <div class="columns card-content">
              <div class="column is-8">
                <p class="title">
                  ${etatInitial.vote.quote2}
                </p>
                <p class="subtitle">${etatInitial.vote.character2} 
                dans ${etatInitial.vote.origin2}</p>
              </div>
              <div class="column is-one-third">
                <div class="card-image">
                  <figure class="image"> `;
        if (
          etatInitial.vote.characterdir === "Left" ||
          etatInitial.vote.characterdir === "left" ||
          etatInitial.vote.characterdir === "Gauche" ||
          etatInitial.vote.characterdir === "gauche"
        ) {
          etatInitial.citation.html =
            etatInitial.citation.html +
            `<img src="${etatInitial.vote.image}"
                    style="transform: scaleX(-1)"
                  /> `;
        } else {
          etatInitial.citation.html =
            etatInitial.citation.html +
            `<img
                    src="${etatInitial.vote.image}"
                  />`;
        }
        etatInitial.citation.html =
          etatInitial.citation.html +
          `</figure>
                </div>
              </div>
            </div>
            <div class="card-content">
              <div class="columns is-centered">
                <p class="button is-info">Voter pour la citation de droite !</p>
              </div>
            </div>
          </div>
        </div>
      `;
        const localisationtab = document.querySelector(".tabtoutvote");
        localisationtab.innerHTML = etatInitial.citation.html;
      }
    }
    etatInitial.citation.index += 1;
  });
}


/*********************/


/***************FIN DE NOS FONCTIONS **********************/

/****RESTE DES FONCTIONS PAS CODÉES PAR NOUS ******/

/**
 * Affiche ou masque la fenêtre modale de login en fonction de l'état courant.
 *
 * @param {Etat} etatCourant l'état courant
 */
function majModalLogin(etatCourant) {
  const modalClasses = document.getElementById("mdl-login").classList;
  if (etatCourant.loginModal) {
    modalClasses.add("is-active");
    lanceWhoamiEtInsereLogin();
    majcit(etatCourant);
  } else {
    modalClasses.remove("is-active");
  }
}

/**
 * Déclenche l'affichage de la boîte de dialogue du nom de l'utilisateur.
 * @param {Etat} etatCourant l'état courant
 */
function clickFermeModalLogin(etatCourant) {
  console.log("CALL clickFermeModal");
  etatCourant.loginModal = false;
  majPage(etatCourant);
}

/**
 * Déclenche la fermeture de la boîte de dialogue du nom de l'utilisateur.
 * @param {Etat} etatCourant l'état courant
 */
function clickOuvreModalLogin(etatCourant) {
  etatCourant.loginModal = true;
  majPage(etatCourant);
}

/**
 * Enregistre les actions à effectuer lors d'un click sur les boutons
 * d'ouverture/fermeture de la boîte de dialogue affichant l'utilisateur.
 * @param {Etat} etatCourant l'état courant
 */
function registerLoginModalClick(etatCourant) {
  document.getElementById("btn-close-login-modal1").onclick = () =>
    clickFermeModalLogin(etatCourant);
  document.getElementById("btn-close-login-modal2").onclick = () =>
    clickFermeModalLogin(etatCourant);
  document.getElementById("btn-open-login-modal").onclick = () =>
    clickOuvreModalLogin(etatCourant);
}

/* ******************************************************************
 * Initialisation de la page et fonction de mise à jour
 * globale de la page.
 * ****************************************************************** */

/**
 * Mets à jour la page (contenu et événements) en fonction d'un nouvel état.
 *
 * @param {Etat} etatCourant l'état courant
 */
function majPage(etatCourant) {
  majTab(etatCourant);
  majModalLogin(etatCourant);
  registerTabClick(etatCourant);
  registerLoginModalClick(etatCourant);
}

/**
 * Appelé après le chargement de la page.
 * Met en place la mécanique de gestion des événements
 * en lançant la mise à jour de la page à partir d'un état initial.
 * Lance aussi la fonction affichant un duel aléatoire sur la page de vote.
 */
function initClientCitations() {
  console.log("CALL initClientCitations");
  affichagevote();
  const etatInitial = {
    tab: "duel",
    loginModal: false,
    citation: { quote: [], character: [], html: String, nbrecit: Number },
    index: Number,
  };
  majPage(etatInitial);
}

// Appel de la fonction init_client_duels au après chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  console.log("Exécution du code après chargement de la page");
  initClientCitations();
});

/*****************/
