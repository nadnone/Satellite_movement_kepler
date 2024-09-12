const PIXEL = 1/5

const GRAVITY_UNIVERSAL = 6.67430 * 10**(-11) // force
const SAT_MASSE = 150 // kg Artificial Satelite
const ASTRE_MASS = 5.972 * 10**24 // kg | Earth

const RAYON_TERRE = 6371 * 10**3 //m
const SAT_HAUTEUR = 6 //m
const SAT_LARGEUR = 3 //m

const DISTANCE_SATELITE_min = 30 * 10**3 + RAYON_TERRE//m
const DISTANCE_SATELITE_max = 70 * 10**3 + RAYON_TERRE//m

const RATIO_ECRAN = window.innerWidth/window.innerHeight

let speedTime = 1
let SB = 0
let ratio_e = 1
let realTime
let t_time = false
let scale_Sat = 3
let scale_astre = 4 * 1/10**6

const PIXEL_RANGE_DEFAULT = PIXEL * RATIO_ECRAN 

let pixel_range = PIXEL_RANGE_DEFAULT
let d_pixel_Range = PIXEL * 1/10**4

// initialisation des ranges
document.getElementById("speedtime_range").value = speedTime
document.getElementById("scale_range").value = pixel_range
document.getElementById("grand_axe").value = (DISTANCE_SATELITE_max - RAYON_TERRE) / 1000
document.getElementById("excentreticity_range").value = ratio_e
document.getElementById("t_time").value = 0
document.getElementById("scale_sat_range").value = scale_Sat
document.getElementById("scale_d").value = d_pixel_Range

function satellite(){

    
    const OB = DISTANCE_SATELITE_min
    const SB = DISTANCE_SATELITE_max
    
    
    function timeLoop(){
    
        // calcul du temps de révolution
        const T = 2 * Math.PI * Math.sqrt( SB**3 / (GRAVITY_UNIVERSAL * ASTRE_MASS) )

        // temps de Greenwich
        const timestamp_GMT = new Date().getTimezoneOffset() * 60*10**3

        // initialize time t range
        document.getElementById("t_time").setAttribute("min", 0)
        document.getElementById("t_time").setAttribute("max", T)

        // time t range check
        if(!t_time) realTime = Date.now()+timestamp_GMT
        else if(t_time) realTime = document.getElementById("t_time").value * 1000

        // temps écoulé en secondes
        const time = (realTime / 1000) * speedTime 
    
        // distance du centre de l'astre au foyer
        const SO = Math.sqrt( SB**2 - OB**2 ) // a**2 = b**2 + c**2 => c = sqrt(a**2 - b**2)
    
        // excentricité (applatissement de l'elipse)
        const e = (SO/SB) * ratio_e
        
        const mouvement_moyen = 2*Math.PI/T // angle AÔP
        const moment_cinetique_periapside = Math.sqrt( (1-e**2)*GRAVITY_UNIVERSAL*ASTRE_MASS* SB) // instant où le satellite est le plus loin
    
        // calcul de l'angle Phi
        const anomalie_moyenne = mouvement_moyen * (time - moment_cinetique_periapside) // angle OÂP
    

        // trigonométrie pour trouver les coordonnées (x,y)
        const SH = SB * ( Math.cos(anomalie_moyenne - e) )
        const HP = SB * Math.sqrt( 1 - e**2 ) * Math.sin(anomalie_moyenne)
        const OH = SO - SH 

        // calcul de la vitesse
        const OP = HP / Math.sin(anomalie_moyenne)
        const v_radiale = Math.sqrt((GRAVITY_UNIVERSAL*ASTRE_MASS)/OP)
        
        //coordonées          
        const x = OH * d_pixel_Range
        const y = HP * d_pixel_Range


        const star = document.getElementById("earth");
        const sat = document.getElementById("sat");

        // tailles
        star.style.setProperty("height", Math.abs(RAYON_TERRE * scale_astre * 1/pixel_range)+"px")
        star.style.setProperty("width", Math.abs(RAYON_TERRE * scale_astre * 1/pixel_range)+"px")

        sat.style.setProperty("height", Math.abs(SAT_HAUTEUR * scale_Sat * 1/pixel_range)+"px")
        sat.style.setProperty("width", Math.abs(SAT_LARGEUR * scale_Sat * 1/pixel_range)+"px")


        //position planete
        star.style.setProperty("left", `${parseFloat(window.innerWidth/2) - parseFloat(star.style.width)/2}px`)
        star.style.setProperty("top", `${parseFloat(window.innerHeight/2) - parseFloat(star.style.height)/2}px`)

        // position du satellite
        sat.style.setProperty("left", `${parseFloat(star.style.left) + parseFloat(star.style.width)/2 - parseFloat(sat.style.width)/2 + x}px`)
        sat.style.setProperty("top", `${parseFloat(star.style.top) + parseFloat(star.style.height)/2 - parseFloat(sat.style.height)/2 + y}px`)



        // tableau de bord
        document.getElementById("infobox").innerText = `
        Bienvenue sur mon tableau de bord, voici mon satellite imaginaire.

        Coordonnées du satellite (taille écran): (${x.toFixed(3)}px, ${y.toFixed(3)*-1}px)
        Distance satellite - terre (écran): ${ (Math.sqrt(x**2 + y**2).toFixed(3))} px
        Vitesse radiale: ~${(v_radiale/1000).toFixed(3)} km/s 

        Excentricité: ~${e.toFixed(5)}
        Grand axe: ${(SB-RAYON_TERRE)/1000} km
        
        Echelle de temps: 1x${(speedTime).toFixed(2)}
        
        Temps: ${new Date(time*1000).getHours()}H ${new Date(time*1000).getMinutes()}m ${new Date(time*1000).getSeconds()}s (heure de Greenwich)        
        Repo GitHub : nadnone/Satellite_movement_kepler
        
        
        (les distances "réelles" n'ont pas l'air fiables)
        Update: 12.09.2024`;


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
function change_d_scale(d){
    d_pixel_Range = PIXEL * 1/10**4 * d
}

function reset(){

    speedTime = 1
    SB = 0
    ratio_e = 1
    realTime
    t_time = false
    scale_Sat = 3
    scale_astre = 1/10**5

    pixel_range = PIXEL_RANGE_DEFAULT
    let d_pixel_Range = PIXEL * 1/10**4

    // ré initialisation des ranges
    document.getElementById("speedtime_range").value = speedTime
    document.getElementById("scale_range").value = pixel_range
    document.getElementById("grand_axe").value = (DISTANCE_SATELITE_max - RAYON_TERRE) / 1000
    document.getElementById("excentreticity_range").value = ratio_e
    document.getElementById("t_time").value = 0
    document.getElementById("scale_sat_range").value = scale_Sat
    document.getElementById("scale_d").value = 1/d_pixel_Range

}


if(window.innerWidth > 601 || window.innerHeight > 401) satellite()