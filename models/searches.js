const fs = require('fs')

const axios = require('axios')

const keyMAPBOX = process.env.MAPBOX_KEY
const keyWAHTERBIT = process.env.WHATERBIT_KEY

class Searches {

    historial = []
    dbPath = './db/database.json'

    constructor() {
        this.readBD()
    }

    get historyCap() {
        return this.historial.map(cit => {

            let palabras = cit.split('')
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1))

            return palabras.join('')

        })
    }
    //fnc que buscara la ciudad
    async city(place = []) {
        try {
            //se podria crear una instancia de axios, pero no me salio.
            //Peticion HTTP
            const resp = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json?language=es&access_token=${keyMAPBOX}`)
            return resp.data.features.map(city => ({
                id: city.id,
                nombre: city.place_name_es,
                lon: city.center[0],
                lat: city.center[1]
            }))
        } catch (error) {
            return []
        }
    }

    //fnc que buscara datos del clima
    async climateSearch(lat, lon) {
        try {
            const resp = await axios.get(`https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${keyWAHTERBIT}&include=minutely&lang=es`)
            const data = await { ...resp.data.data }
            return {
                vientos: data['0'].wind_cdir_full,
                temp: data['0'].temp,
                nubes: data['0'].clouds,
                desc: data['0'].weather.description
            }
        } catch (error) {
            console.log(error)
        }
    }

    addHistory(place = '') {
        if (this.historial.includes(place.toLocaleLowerCase())) {
            return
        }
        this.historial.unshift(place.toLocaleLowerCase())
        //Grabando
        this.saveBD()
    }
    //Grabar en bd
    saveBD() {
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }
    //Leer BD
    readBD() {
        if (!fs.existsSync(this.dbPath)) {
            return
        }
        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' })
        const data = JSON.parse(info)

        this.historial = data.historial
    }
}

module.exports = Searches