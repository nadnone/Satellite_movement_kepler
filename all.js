

const PIXEL = 0.05

const GRAVITY_UNIVERSAL = 6.67430 * 10**(-11) // force
const SAT_MASSE = 150 // kg Artificial Satelite
const ASTRE_MASS = 5.972 * 10**24 // kg | Earth

const RAYON_TERRE = 6371 * 10**3 //m

const DISTANCE_SATELITE_min = 300 * 10**3 + RAYON_TERRE//m
const DISTANCE_SATELITE_max = 400 * 10**3 + RAYON_TERRE//m

const RATIO_ECRAN = window.innerWidth/window.innerHeight

let speedTime = 1
let SB = 0
let ratio_e = 1
let realTime
let t_time = false

pixel_range = PIXEL * RATIO_ECRAN

// initialisation des ranges
document.getElementById("speedtime_range").value = speedTime
document.getElementById("scale_range").value = pixel_range
document.getElementById("grand_axe").value = (DISTANCE_SATELITE_max - RAYON_TERRE) / 1000
document.getElementById("excentreticity_range").value = ratio_e
document.getElementById("t_time").value = 0

function satellite(){

    let star = document.getElementById("star");
    let sat = document.getElementById("sat");
    
    
    // positions initiales
    star.style.top = (window.innerHeight/2)-(120/2)+"px"; star.style.left = (window.innerWidth/2)-(120/2)+"px";
    sat.style.top = (window.innerHeight/2)-(200/2)+"px"; sat.style.left = (window.innerWidth/2)-(50/2)+"px";
    
   
    
    let OB = DISTANCE_SATELITE_min
    let OA = DISTANCE_SATELITE_max

    SB = OA

    const FOYER_SX = Math.sqrt( SB**2 - OB**2 )

    
    let T = 2 * Math.PI * Math.sqrt( SB**3 / (GRAVITY_UNIVERSAL * ASTRE_MASS) )
    
    
    function timeLoop(){
    
    
        let timestamp_GMT = new Date().getTimezoneOffset() * 60*10**3
        
        

        // time t range check
        if(!t_time) realTime = Date.now()+timestamp_GMT
        else if(t_time) realTime = document.getElementById("t_time").value * 1000

        // initialize time t range
        document.getElementById("t_time").setAttribute("min", 0)
        document.getElementById("t_time").setAttribute("max", T)


        let time = realTime * speedTime / 1000
    
    
        let SO = Math.sqrt( SB**2 - OB**2 ) // a**2 = b**2 + c**2 => c = sqrt(a**2 - b**2)
    
    
        let e = (SO/SB) * ratio_e// excentricité (applatissement de l'elipse)
    
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
        
        let v_eloignement = Math.sqrt(1/SB)
    
    
        //coordonées          
        let x = OH  * v_eloignement * pixel_range
        let y = HP  * v_eloignement * pixel_range
    
        sat.style.setProperty("left", `${parseFloat(star.style.left+star.style.width/2) + x}px`)
        sat.style.setProperty("top", `${parseFloat(star.style.top+star.style.height/2) + y}px`)

        








        document.getElementById("infobox").innerText = `
        Bienvenue sur mon tableau de bord, voici mon satellite imaginaire.

    
        Coordonnées du satellite: (${x.toFixed(3)}m,${y.toFixed(3)*-1}m)
        Vitesse angulaire du satellite: ~${(mouvement_moyen * 3600).toFixed(3)} km/h
        Masse du satellite: ${SAT_MASSE}kg
        
        Excentricité: ~${e.toFixed(5)}
        Rayon: ~ ${( Math.abs((RAYON_TERRE-OP)/1000 ).toFixed(3))} km
        Grand axe: ${(SB-RAYON_TERRE)/1000} km
        
        Echelle de distance: 1m = ~${(pixel_range).toFixed(3)}pixel (s'adapte à l'écran)
        Echelle de temps: 1*${speedTime.toFixed(2)} seconde
    
        Temps: ${new Date(realTime).getHours()}H ${new Date(realTime).getMinutes()}m ${new Date(realTime).getSeconds()}s (heure de Greenwich)        
        ` ; 
    
        if(time > T) time = 0
    }
    
    setInterval(timeLoop, 60);
    
    
    
    
}



window.addEventListener("resize", () => {
        window.location.href = document.URL
});

function changeTimespeed(speed){
    speedTime = speed
}

function ChangeOA(d){
    SB = (d * 10**3) + RAYON_TERRE
}

function excentreticity(ratio){
    ratio_e = ratio
}
function change_t_time(){
    t_time = true
}

function reset(){



    speedTime = 1
    SB = DISTANCE_SATELITE_max
    ratio_e = 1
    t_time = false
    pixel_range = PIXEL * window.innerWidth/window.innerHeight

    // ré initialisation des ranges
    document.getElementById("speedtime_range").value = speedTime
    document.getElementById("scale_range").value = pixel_range
    document.getElementById("grand_axe").value = (DISTANCE_SATELITE_max-RAYON_TERRE) / 1000
    document.getElementById("excentreticity_range").value = ratio_e
    document.getElementById("t_time").value = 0


}


if(window.innerWidth > 601 || window.innerHeight > 401) satellite()
 