

const PIXEL = 1/9

const GRAVITY_UNIVERSAL = 6.67430 * 10**(-11) // force
const SAT_MASSE = 150 // kg Artificial Satelite
const ASTRE_MASS = 5.972 * 10**24 // kg | Earth

const RAYON_TERRE = 6371 * 10**3 //m
const SAT_HAUTEUR = 6 //m
const SAT_LARGEUR = 3 //m

const DISTANCE_SATELITE_min = 200 * 10**3 + RAYON_TERRE//m
const DISTANCE_SATELITE_max = 400 * 10**3 + RAYON_TERRE//m

const RATIO_ECRAN = window.innerWidth/window.innerHeight

let speedTime = 1
let SB = 0
let ratio_e = 1
let realTime
let t_time = false
let scale_Sat = 3 * 10**5

const PIXEL_RANGE_DEFAULT = PIXEL * RATIO_ECRAN * 10 * 10**4

let pixel_range = PIXEL_RANGE_DEFAULT
let d_pixel_Range = PIXEL

// initialisation des ranges
document.getElementById("speedtime_range").value = speedTime
document.getElementById("scale_range").value = pixel_range
document.getElementById("grand_axe").value = (DISTANCE_SATELITE_max - RAYON_TERRE) / 1000
document.getElementById("excentreticity_range").value = ratio_e
document.getElementById("t_time").value = 0
document.getElementById("scale_sat_range").value = scale_Sat
document.getElementById("scale_d").value = 1/d_pixel_Range

function satellite(){

    
    const OB = DISTANCE_SATELITE_min
    const OA = DISTANCE_SATELITE_max

    SB = OA

    const FOYER_SX = Math.sqrt( SB**2 - OB**2 )

    
    let T = 2 * Math.PI * Math.sqrt( SB**3 / (GRAVITY_UNIVERSAL * ASTRE_MASS) )
    
    
    function timeLoop(){
    
    
        const timestamp_GMT = new Date().getTimezoneOffset() * 60*10**3
        

        // initialize time t range
        document.getElementById("t_time").setAttribute("min", 0)
        document.getElementById("t_time").setAttribute("max", T)

        // time t range check
        if(!t_time) realTime = Date.now()+timestamp_GMT
        else if(t_time) realTime = document.getElementById("t_time").value * 1000


        const time = (realTime / 1000) * speedTime
    
        const SO = Math.sqrt( SB**2 - OB**2 ) // a**2 = b**2 + c**2 => c = sqrt(a**2 - b**2)
    
    
        const e = (SO/SB) * ratio_e// excentricité (applatissement de l'elipse)
    
        const angle_OAP = (2*Math.PI/T) * time
    
    
        //let angle_BSO = Math.sin( OB * Math.sin(90) / SB )
    
        const mouvement_moyen = 2*Math.PI/T

        const moment_cinetique_periapside = Math.sqrt( (1-e**2)*GRAVITY_UNIVERSAL*ASTRE_MASS* SB)
    
        const anomalie_moyenne = mouvement_moyen * (time - moment_cinetique_periapside)
    
    
        //let AS = OA - SO;
    
        //let SP = SB * ( 1 - e * Math.cos(angle_OAP) )
    
        const SH = SB * ( Math.cos(angle_OAP - e) )
        const HP = SB * Math.sqrt( 1 - e**2 ) * Math.sin(angle_OAP)
    
        const OH = SO - SH
    
        const OP = HP / Math.sin(anomalie_moyenne)
        
        const v_eloignement = Math.sqrt(1/SB)
    
    
        //coordonées          

        let x = (OH * v_eloignement) * d_pixel_Range
        let y = (HP * v_eloignement) * d_pixel_Range

        let star = document.getElementById("earth");
        let sat = document.getElementById("sat");
        

        // tailles
        star.style.setProperty("height", Math.abs(RAYON_TERRE * 1/pixel_range)+"px")
        star.style.setProperty("width", Math.abs(RAYON_TERRE * 1/pixel_range)+"px")

        sat.style.setProperty("height", Math.abs(SAT_HAUTEUR * scale_Sat * 1/pixel_range)+"px")
        sat.style.setProperty("width", Math.abs(SAT_LARGEUR * scale_Sat * 1/pixel_range)+"px")


        //position planete
        star.style.setProperty("left", `${parseFloat(window.innerWidth/2) - parseFloat(star.style.width)/2}px`)
        star.style.setProperty("top", `${parseFloat(window.innerHeight/2) - parseFloat(star.style.height)/2}px`)

        // position du satellite
        sat.style.setProperty("left", `${parseFloat(star.style.left) + parseFloat(star.style.width)/2 - parseFloat(sat.style.width)/2 + x}px`)
        sat.style.setProperty("top", `${parseFloat(star.style.top) + parseFloat(star.style.height)/2 - parseFloat(sat.style.height)/2 + y}px`)



        document.getElementById("infobox").innerText = `
        Bienvenue sur mon tableau de bord, voici mon satellite imaginaire.

    

        Coordonnées du satellite (taille réelle): (${(OH/1000).toFixed(3)}km, ${(HP/1000).toFixed(3)*-1}km) 
        Coordonnées du satellite (taille écran): (${x.toFixed(3)}px, ${y.toFixed(3)*-1}px)

        
        Excentricité: ~${e.toFixed(5)}
        Grand axe: ${(SB-RAYON_TERRE)/1000} km
        
        Echelle de tailles (s'adapte à l'écran): 1m x ${((1/pixel_range)*10**5).toFixed(6)} x10^6 px
        Echelle de distances: 1m x ${(d_pixel_Range*10**2).toFixed(3)} x10^2 px
        Echelle de temps: 1x${(speedTime).toFixed(2)}


        Tailles du satellite: ${SAT_HAUTEUR*SAT_LARGEUR}m^2 x ${((1/scale_Sat)*10**6).toFixed(4)} x10^6 px      
        Masse du satellite: ${SAT_MASSE}kg
        
        Temps: ${new Date(time*1000).getHours()}H ${new Date(time*1000).getMinutes()}m ${new Date(time*1000).getSeconds()}s (heure de Greenwich)        


        ` ; 
        document.getElementById("infobox").innerHTML += `Repo GitHub : spoutnik911/Satellite_movement_kepler`
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
    d_pixel_Range = 1/d
}
function reset(){



    speedTime = 1
    SB = DISTANCE_SATELITE_max
    ratio_e = 1
    t_time = false
    pixel_range = PIXEL_RANGE_DEFAULT
    scale_Sat = 3 * 10**5
    d_pixel_Range = PIXEL

    // ré initialisation des ranges
    document.getElementById("speedtime_range").value = speedTime
    document.getElementById("scale_d").value = 1/d_pixel_Range
    document.getElementById("scale_range").value = pixel_range
    document.getElementById("grand_axe").value = (DISTANCE_SATELITE_max-RAYON_TERRE) / 1000
    document.getElementById("excentreticity_range").value = ratio_e
    document.getElementById("t_time").value = 0
    document.getElementById("scale_sat_range").value = scale_Sat


}


if(window.innerWidth > 601 || window.innerHeight > 401) satellite()
 