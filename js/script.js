

//_____________________________________________________variable
let ville = document.getElementById('ville');
let position = document.getElementById('position');
let recherche = document.getElementById('recherche');

let stockVille;                                                        //stock la ville 
let stockRens;                                                         //stock la reponse de requete en json
let latitud;                                                           // stock la latitude
let longitud;                                                            // stock la longitude
let tromper;                                                            // stock message d'erreur

let coord;                                                              // cree une div erreur coordonnees 
let corpsAffiche   ;                                                     // cree box qui contient les information
let titre;                                                              // variable cree titre h3
let jour0;                                                               // jour actuelle  
let jour1;                                                               //jour +1
let jour2;                                                              //jour +2
let jour3;                                                              //jour +3
let jour4;                                                              //jour +4








let boxAutocomple = document.getElementById('boxAutocomple');
let autocomple = document.getElementById('autocomple');


//_____________________________________________________lecture fucntion

//-----function recherche la ville
recherche.addEventListener('click', rechercheVille);

// lecture ville
ville.addEventListener('keyup', function () {
    autocompletion(this.value)
});

// lecture au click et affiche la position
position.addEventListener('click', affichePosi);






//_____________________________________________________________________fucntion

///-------function reset
function reset() {
   
    if (autocomple) {
        autocomple.remove();
    }

    if (corpsAffiche) {
        corpsAffiche.remove();


    }

    if (tromper) {
        tromper.remove();

    }
    console.clear();
    // return

}





//_______function permet de comparer chaque objet du tableau a lettre rentrer        "autocompletion"
function autocompletion(mot) {

    console.clear();
    console.log(mot);



    let url = `https://geo.api.gouv.fr/communes?nom=${mot}&fields=departement&boost=population&limit=5`;

    fetch(url)
        .then(response => response.json())
        .then(response => {

            console.log(response);


            let fluxHtml = "";

            response.forEach(element => {

                console.log(element);

                let position = element.nom.toUpperCase().substr(0, mot.length).normalize('NFD').search(mot.toUpperCase());
                if (position === 0) {

                    fluxHtml += "<div class='choixPays cursor-pointer hover:bg-red-600'>" + element.nom + "</div>"
                }

            });
            reset();
            autocomple = document.createElement('div');  // fait apparaitre ma div pour affiche les resultat de la recherche
            boxAutocomple.appendChild(autocomple);
            autocomple.id = 'autocomple';
            autocomple.classList = " w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-center rounded rounded-lg font-bold ";
            autocomple.innerHTML = fluxHtml;     //  affiche les resultat trouver
            




            // seclection la ville danc l'aucompletion pour le copier dans l'input

            let choixPays = document.querySelectorAll('.choixPays');
            choixPays.forEach(item => {
                item.addEventListener('click', function () {

                    ville.value = this.textContent;
                    autocomple.remove();

                });
            });





        })

        .catch(error => {
            error = "la requete ne fait pas";
            console.log(error);
        })



};





//-----function recherche ma position
function affichePosi() {
    console.clear();
    reset()


    let geo = navigator.geolocation;
    console.log(geo);

    geo.getCurrentPosition(position => {


        latitud = position.coords.latitude;
        longitud = position.coords.longitude;

        console.log(latitud);
        console.log(longitud);

        requetePosition();
    });




};



//------------------function recherche 
function rechercheVille() {
    
    console.clear();
    stockVille = ville.value;
    ville.value = "";
    // function de requete vers l'api
    requete()

}


// ----------------function requete position
function requetePosition() {
    reset();
    console.log(latitud);
    console.log(longitud);
    let urlPosi = `https://prevision-meteo.ch/services/json/lat=${latitud}lng=${longitud}, { mode: 'no-cors' }`;

    fetch(urlPosi)
        .then(response => response.json())
        .then(response => {
            console.log(response);
            stockRens = response;
            afficheDynam()



        })
        .catch(error => {
            error = "erreur durant la requete"
            console.log(error);

            tromper = document.createElement('h3');
            tromper.id = 'coord';
            tromper.classList = 'my-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded rounded-lg  font-bold  text-center py-2.5 ';
            tromper.innerText = "Erreur durant la requete";
            document.getElementById('corps').appendChild(tromper);
            return
        })

}


//------------------function a la recherche
function requete() {
    reset();

    let url = `https://prevision-meteo.ch/services/json/${stockVille}`;

    fetch(url)
        .then(response => response.json())
        .then(response => {

            console.log(response.city_info.name);
            stockRens = response;
            console.log(stockRens);
            console.log(stockRens.fcst_day_0)
            console.log(stockRens.fcst_day_0.icon);
            afficheDynam();

        })
        .catch(error => {

            error = "erreur durant la requete"
            console.log(error);

            tromper = document.createElement('h3');
            tromper.id = 'coord';
            tromper.classList = 'my-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded rounded-lg  font-bold  text-center py-2.5 text-red-500';
            tromper.innerText = "Erreur durant la requete OU le relever meteo de cette ville et compris dans une ville alentour.";
            document.getElementById('corps').appendChild(tromper);
        })
}





///---------------------------affiche les resultat des requetes
function afficheDynam() {



    corpsAffiche = document.createElement('div');                       // cree la box qui va contenir les information
    corpsAffiche.id = 'affiche';
    corpsAffiche.classList = "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white p-2";
    document.getElementById('corps').appendChild(corpsAffiche);


    titre = document.createElement('h3');
    titre.id = 'titre';
    titre.classList = 'my-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded rounded-lg  font-bold  text-center py-2.5 ';
    titre.innerText = stockRens.city_info.name.toUpperCase();
    document.getElementById('affiche').appendChild(titre);


    jour0 = document.createElement('div');
    jour0.id = 'jour0'
    jour0.classList = `my-2 bg-gradient-to-r from-cyan-500 to-blue-500  rounded rounded-lg text-center  font-bold p-2`;
    jour0.innerHTML = `<img src ='${stockRens.fcst_day_0.icon}' class='ml-8    alt='image meteo'><span >${stockRens.fcst_day_0.day_short} &nbsp ${stockRens.fcst_day_0.date} &nbsp ${stockRens.fcst_day_0.tmax}°C</span>`;
    document.getElementById('affiche').append(jour0);


    jour1 = document.createElement('div');
    jour1.id = 'jour1'
    jour1 = document.createElement('div');
    jour1.classList = `my-2 bg-gradient-to-r from-cyan-500 to-blue-500  rounded rounded-lg text-center  font-bold p-2 `;
    jour1.innerHTML = `<img src ='${stockRens.fcst_day_1.icon}' class='ml-8  my-auto   alt='image meteo'><span>${stockRens.fcst_day_1.day_short} &nbsp ${stockRens.fcst_day_1.date} &nbsp ${stockRens.fcst_day_1.tmax}°C</span>`;
    document.getElementById('affiche').append(jour1);


    jour2 = document.createElement('div');
    jour2.id = 'jour2'
    jour2 = document.createElement('div');
    jour2.classList = `my-2 bg-gradient-to-r from-cyan-500 to-blue-500  rounded rounded-lg text-center  font-bold p-2 `;
    jour2.innerHTML = `<img src ='${stockRens.fcst_day_2.icon}' class='ml-8  my-auto   alt='image meteo'><span>${stockRens.fcst_day_2.day_short} &nbsp ${stockRens.fcst_day_2.date} &nbsp ${stockRens.fcst_day_2.tmax}°C</span>`;
    document.getElementById('affiche').append(jour2);



    jour3 = document.createElement('div');
    jour3.id = 'jour3'
    jour3 = document.createElement('div');
    jour3.classList = `my-2 bg-gradient-to-r from-cyan-500 to-blue-500  rounded rounded-lg text-center  font-bold p-2 `;
    jour3.innerHTML = `<img src ='${stockRens.fcst_day_3.icon}' class='ml-8  my-auto   alt='image meteo'><span>${stockRens.fcst_day_3.day_short} &nbsp ${stockRens.fcst_day_3.date} &nbsp ${stockRens.fcst_day_3.tmax}°C</span>`;
    document.getElementById('affiche').append(jour3);




    jour4 = document.createElement('div');
    jour4.id = 'jour4'
    jour4 = document.createElement('div');
    jour4.classList = `my-2 bg-gradient-to-r from-cyan-500 to-blue-500  rounded rounded-lg text-center  font-bold p-2 `;
    jour4.innerHTML = `<img src ='${stockRens.fcst_day_4.icon}' class='ml-8  my-auto   alt='image meteo'><span>${stockRens.fcst_day_4.day_short} &nbsp ${stockRens.fcst_day_4.date} &nbsp ${stockRens.fcst_day_4.tmax}°C</span>`;
    document.getElementById('affiche').append(jour4);


}