mocha.timeout(100000);
suite("Tests pour la fonction getallcit()", function () {
  test("Vérification que 2 appels de la fonction retournent les mêmes données",
  async function () {
    const users = await getallcit();
    const users2 = await getallcit();
    chai.assert.deepEqual(users, users2);
  });
});

suite(
  "Tests pour la fonction rendercitnorm(index,quote,character)",
  function () {
    test("On vérifie que les données JS sont bien transformées en html", 
    function () {
      const indextest = 40;
      const cittest = "Bart is out!";
      const chartest = "Bart Simpson";
      const resultattendu = `<div class="user">
    <table is-bordered class="table">
    <tr>
     <th>40</th><td> </td> 
     <td>Bart is out!</td><td></td> 
     <td>Bart Simpson</td><td> 
     <button onclick="elargir(40)" id="elargir40">
     Elargir</button></td> 
     <td> <button onclick ="changerform(40)" id="changer40">
     Changer</button></td>
     <td><button onclick ="Ajouter()">
     Ajouter</button></td>
    </tr>
    <table> 
    </div>`;
      const htmltest = rendercitnorm(indextest, cittest, chartest);
      chai.assert.deepEqual(htmltest, resultattendu);
    });
  }
);

suite(
  "Tests pour la fonction rendercitelargie(index,quote,character,image,characterdir,origin,added)",
  function () {
    test("On test que les données JS sont bien transformées en html (détails)",
     function () {
      const indextest = 30;
      const cittest = "Lisa is out!";
      const chartest = "Lisa Simpson";
      const imagetest = "urlimage";
      const diretest = "Left";
      const oritest = "Simpson Season 2";
      const adtest = "p123456789";
  const resultattendularge = `<div class="user">
  <table is-bordered class="table">
  <tr>
    <th>30</th><td> </td> 
    <td>Lisa is out!</td><td></td> 
    <td>Lisa Simpson</td>
    <td>urlimage</td>
    <td>Left</td>
    <td>Simpson Season 2</td>
    <td>p123456789</td>
    <td> <button onclick ="changerform(30)" id="changer30">
    Changer</button></td>
    <td><button onclick ="Ajouter()">
    Ajouter</button></td>
  </tr>
  <table> 
</div>`;
      const htmltestlarge = rendercitelargie(indextest,cittest,chartest,imagetest,diretest,oritest,adtest);
      chai.assert.deepEqual(htmltestlarge, resultattendularge);
    });
  }
);

suite("Tests pour la fonction aleatoire(nbre)", function () {
  test("On test si le nombre retourné est entre 0 et une borne supérieure", 
  function () {
    const borne = 50;
    const test = aleatoire(borne);
    console.log(test);
    chai.assert.isAtMost(test, borne);
    chai.assert.isAtLeast(test, 0);
  });
});

suite("Tests pour la fonction aleatoiremoins(nbre, aleaP)", function () {
  test("On vérifie que le nombre retourné est entre 0 et une borne supérieure et pas égal à un autre nombre aléatoire", 
  async function () {
    const borne = 50;
    const borntest = await nbredecit();
    console.log("nbre cit " + borntest);
    const test = aleatoire(borne);
    const test2 = aleatoiremoins(borne, test);
    console.log(test);
    console.log(test2);
    chai.assert.isAtMost(test2, borne);
    chai.assert.isAtLeast(test2, 0);
    chai.assert.notDeepEqual(test2, test);
  });
});
suite("Tests pour la fonction sendataprecis(data)", function () {
  test("On vérifie que la citation qu'on vient d'ajouter est bien faite",
   async function () {
    const data = {
      q: String,
      c: String,
      i: String,
      cd: String,
      or: String,
    };
    data.q = "Je suis une citation de Lisa Simpson";
    data.c = "Lisa Simpson";
    data.i = "un lien vers une image";
    data.cd = "Right";
    data.or = "Simpson";

    const datatest = {
      index: Number,
    };

    sendataprecis(data);
    const nbre = await nbredecit();
    const users = await getallcit();
    datatest.index = 1;
    users.forEach((user) => {
      if (datatest.index === nbre) {
        chai.assert.deepEqual(user.quote, data.q);
        chai.assert.deepEqual(user.character, data.c);
        chai.assert.deepEqual(user.image, data.i);
        chai.assert.deepEqual(user.characterDirection, data.cd);
        chai.assert.deepEqual(user.origin, data.or);
      }
      datatest.index = datatest.index + 1;
    });
  });
});

suite("Tests pour la fonction changecitprecis(idchange, data)", function () {
  test("On test que la dernière citation a été changée par les valeurs données",
   async function () {
    const data = {
      q: String,
      c: String,
      i: String,
      cd: String,
      or: String,
    };
    data.q = "Je suis une citation de Lisa Simpson2";
    data.c = "Lisa Simpson";
    data.i = "un lien vers une image";
    data.cd = "Right";
    data.or = "Simpson";
    const datatest = {
      index: Number,
    };
    sendataprecis(data);
    const nbre = await nbredecit();
    const datach = {
      q: String,
      c: String,
      i: String,
      cd: String,
      or: String,
    };
    datach.q = "Je suis une nouvelle citation de Lisa Simpson";
    datach.c = "Lisa Simpson";
    datach.i = "un lien vers une image";
    datach.cd = "Right";
    datach.or = "Simpson";

    const etatInitial = {
      tab: "duel",
      loginModal: false,
      citation: {
        quote: [],
        character: [],
        html: String,
        nbrecit: Number,
        index: Number,
      },
    };

    const users = await getallcit();
    etatInitial.citation.nbrecit = await nbredecit();
    console.log(etatInitial.citation.nbrecit);
    etatInitial.citation.index = 1;
    users.forEach((user) => {
      if (etatInitial.citation.index == etatInitial.citation.nbrecit) {
        const idchange = user._id;
        changecitprecis(idchange, datach);
        majcit(etatInitial);
      }
      etatInitial.citation.index = etatInitial.citation.index + 1;
    });
    etatInitial.citation.index = 1;
    const users2 = await getallcit();
    users2.forEach((user) => {
      if (etatInitial.citation.index == etatInitial.citation.nbrecit) {
        chai.assert.deepEqual(user.quote, datach.q);
        chai.assert.deepEqual(user.character, datach.c);
        chai.assert.deepEqual(user.image, datach.i);
        chai.assert.deepEqual(user.characterDirection, datach.cd);
        chai.assert.deepEqual(user.origin, datach.or);
      }
      etatInitial.citation.index = etatInitial.citation.index + 1;
    });
  });
});

suite("Tests pour filtrecit(etatInitial, ch, filtretest, t)",
function () {
  test("On vérifie que le bon nombre de citation sont gardées",
   async function () {
    const etatInitial = {
      tab: "duel",
      loginModal: false,
      citation: { quote: [], character: [], html: String, nbrecit: Number },
      nbrefiltre: Number,
      nbrefiltreq: Number,
      nbrefiltrec: Number,
      nbrefiltreim: Number,
      nbrefiltred: Number,
      nbrefiltrea: Number,
      nbrefiltreo: Number,
      Filtre: String,
      test : {Nbréelq: Number, Nbréelc: Number, Nbréelim: Number, 
        Nbréeld: Number, Nbréela: Number, Nbréelo: Number,}

    };
    etatInitial.test.Nbréelq = 0;
    etatInitial.test.Nbréelc = 0;
    etatInitial.test.Nbréelim = 0;
    etatInitial.test.Nbréeld = 0;
    etatInitial.test.Nbréela = 0;
    etatInitial.test.Nbréelo = 0;
    const catperso = "personnage";
    const catquote = "citation";
    const catdir = "direction";
    const catori = "origin";
    const catim = "image";
    const catadded = "ajouteur";
    const T = "test";
    const filtq = "NE PAS MODIFIER : citation test";
    const filtc = "NE PAS MODIFIER Bart Simpson";
    const filtim = "NE PAS MODIFIER un lien vers une image";
    const filtd = "NE PAS MODIFIER Right";
    const filta = "p1924945";
    const filto = "NE PAS MODIFIER The Simpsons";
    const datach2 = {
      q: String,
      c: String,
      i: String,
      cd: String,
      or: String,
    };
    datach2.q = filtq;
    datach2.c = filtc;
    datach2.i = filtim;
    datach2.cd = filtd;
    datach2.or = filto;
    sendataprecis(datach2);
    majcit(etatInitial);
    const users = await getallcit();
    etatInitial.nbrefiltreq = await filtrecit(etatInitial, catquote, filtq, T);
    etatInitial.nbrefiltrec = await filtrecit(etatInitial, catperso, filtc, T);
    etatInitial.nbrefiltreim = await filtrecit(etatInitial, catim, filtim, T);
    etatInitial.nbrefiltred = await filtrecit(etatInitial, catdir, filtd, T);
    etatInitial.nbrefiltrea = await filtrecit(etatInitial, catadded, filta, T);
    console.log(" origine triée");
    etatInitial.nbrefiltreo = await filtrecit(etatInitial, catori, filto, T);
    users.forEach((user) => {
      if (user.character == filtc) {
        etatInitial.test.Nbréelc = etatInitial.test.Nbréelc + 1;
      }
      if (user.quote == filtq) {
        etatInitial.test.Nbréelq = etatInitial.test.Nbréelq + 1;
      }
      if (user.characterDirection == filtd) {
        etatInitial.test.Nbréeld = etatInitial.test.Nbréeld + 1;
      }
      if (user.image == filtim) {
        etatInitial.test.Nbréelim = etatInitial.test.Nbréelim + 1;
      }
      if (user.origin == filto) {
        etatInitial.test.Nbréelo = etatInitial.test.Nbréelo + 1;
      }
      if (user.addedBy == filta) {
        etatInitial.test.Nbréela = etatInitial.test.Nbréela + 1;
      }
    });
    chai.assert.deepEqual(etatInitial.nbrefiltreq, etatInitial.test.Nbréelq);
    chai.assert.deepEqual(etatInitial.nbrefiltrec, etatInitial.test.Nbréelc);
    chai.assert.deepEqual(etatInitial.nbrefiltreim, etatInitial.test.Nbréelim);
    chai.assert.deepEqual(etatInitial.nbrefiltred, etatInitial.test.Nbréeld);
    chai.assert.deepEqual(etatInitial.nbrefiltreo, etatInitial.test.Nbréelo);
    chai.assert.deepEqual(etatInitial.nbrefiltrea, etatInitial.test.Nbréela);
  });
});
