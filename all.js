

let speedTime = 1


function satellite(){

    let star = document.getElementById("star");
    let sat = document.getElementById("sat");
    
    
    // positions initiales
    star.style.top = (window.innerHeight/2)-(120/2)+"px"; star.style.left = (window.innerWidth/2)-(120/2)+"px";
    sat.style.top = (window.innerHeight/2)-(29/2)+"px"; sat.style.left = (window.innerWidth/2)-(20/2)+"px";
    
    
    const PIXEL = 0.05
    
    const GRAVITY_UNIVERSAL = 6.67430 * 10**(-11) // force
    const SAT_MASSE = 150 // kg Artificial Satelite
    const ASTRE_MASS = 5.972 * 10**24 // kg | Earth
    
    const RAYON_TERRE = 6371 * 10**3 //m
    
    const DISTANCE_SATELITE_min = 300 * 10**3 + RAYON_TERRE//m
    const DISTANCE_SATELITE_max = 400 * 10**3 + RAYON_TERRE//m
    
    let OB = DISTANCE_SATELITE_min
    let OA = DISTANCE_SATELITE_max

    let SB = OA

    const FOYER_SX = Math.sqrt( SB**2 - OB**2 )

    
    let T = 2 * Math.PI * Math.sqrt( SB**3 / (GRAVITY_UNIVERSAL * ASTRE_MASS) )
    
    
    function timeLoop(){
    
        const RATIO_ECRAN = window.innerWidth/window.innerHeight
    
        let timestamp_GMT = new Date().getTimezoneOffset() * 60*10**3
        
        let realTime = Date.now()+timestamp_GMT
    
        let time = realTime * speedTime / 1000
    
    
        let SO = Math.sqrt( SB**2 - OB**2 ) // a**2 = b**2 + c**2 => c = sqrt(a**2 - b**2)
    
    
        let e = SO/SB // excentricité (applatissement de l'elipse)
    
        let angle_OAP = (2*Math.PI/T) * time
    
    
        //let angle_BSO = Math.sin( OB * Math.sin(90) / SB )
    
        let mouvement_moyen = 2*Math.PI/T

        let moment_cinetique_periapside = Math.sqrt( (1-e**2)*GRAVITY_UNIVERSAL*ASTRE_MASS* SB)
    
        let anomalie_moyenne = mouvement_moyen * (time - moment_cinetique_periapside)
    
    
        //let AS = OA - SO;
    
        //let SP = SB * ( 1 - e * Math.cos(angle_OAP) )
    
        let SH = SB * ( Math.cos(angle_OAP - e) )
        let HP = SB * Math.sqrt( 1 - e**2 ) * Math.sin(angle_OAP)
    
        let OH = SO - SH
    
        let OP = HP / Math.sin(anomalie_moyenne)
        
        let R = OP;
    
        let v_eloignement = Math.sqrt(1/SB)
    
    
        //coordonées          
        let x = OH * PIXEL * v_eloignement * RATIO_ECRAN
        let y = HP * PIXEL * v_eloignement * RATIO_ECRAN
    
        sat.style.setProperty("left", `${parseFloat(star.style.left+star.style.width/2) + x}px`)
        sat.style.setProperty("top", `${parseFloat(star.style.top+star.style.height/2) + y}px`)

        








        document.getElementById("infobox").innerText = `
        Bienvenue sur mon tableau de bord, voici mon satellite imaginaire.

    
        Coordonnées du satellite: (${x.toFixed(3)}m,${y.toFixed(3)}m)
        Vitesse angulaire du satellite: ~${(mouvement_moyen * 3600).toFixed(3)} km/h
        Masse du satellite: ${SAT_MASSE}kg
        
        Excentricité: ~${e.toFixed(5)}
        Rayon: ~ ${Math.abs((((R).toFixed(3)-RAYON_TERRE)/1000).toFixed(3))} km
        
        Echelle de distance: 1m = ~${(PIXEL*RATIO_ECRAN).toFixed(3)}pixel (s'adapte à l'écran)
        Echelle de temps: 1*${speedTime.toFixed(2)} seconde
    
        Temps: ${new Date(realTime).getHours()}:${new Date(realTime).getMinutes()}:${new Date(realTime).getSeconds()} (Heure de Greenwich)        
        ` ; 
    
        if(time > T) time = 0
    }
    
    setInterval(timeLoop, 60);
    
    
    
    
}



window.addEventListener("resize", () => {
        window.location.href = document.URL
});

function changespeed(speed){
    speedTime *= speed
    if (speed == 0 ) speedTime = 1
}


if(window.innerWidth > 701 || window.innerHeight > 401) satellite()
 