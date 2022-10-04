require('dotenv').config()

const { inquirerMenu, pausa, readInput, listPlaces } = require("./helpers/inquirer");
const Searches = require("./models/searches");

const app = async () => {
    const searches = new Searches()//instanciamos nuestra clase
    let opc;
    //recibe opc por func
    do {
        //le paso opc por para en switch
        opc = await inquirerMenu()

        switch (opc) {
            case 1:
                //mostrar mensaje
                const place = await readInput('Ciudad: ')

                //buscar los lugares
                const places = await searches.city(place)

                //seleccionar el lugar
                const id = await listPlaces(places)
                if (id === 0) continue //sigue la iteracion del programa

                const placeSelect = places.find(c => c.id === id)
                //Guardamos en historial
                searches.addHistory(placeSelect.nombre)
                const { lon, lat } = placeSelect

                //clima
                const climate = await searches.climateSearch(lat, lon)

                //mostrar resultados
                console.log('\nInformacion de la ciudad.\n'.cyan)
                console.log('Ciudad: ', placeSelect.nombre)
                console.log('Lon: ', placeSelect.lon)
                console.log('Lat: ', placeSelect.lat)
                console.log('Temperatura:', climate.temp)
                console.log('Cielo:', climate.desc)
                console.log('Nubes:', climate.nubes)
                console.log('Direccion del viento:', climate.vientos)
                break;
            case 2:
                searches.historyCap.forEach((city, i) => {
                    const idx = `${i + 1}.`.cyan
                    console.log(`${idx} ${city}`)
                })
                /* history() */
                break;
        }
        //pausa
        await pausa()
    } while (opc !== 0);
}
app()