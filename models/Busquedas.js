const fs = require('fs')

const axios = require('axios')

class Busquedas {
    historial = []
    dbPath = './db/database.json'
    latitud = 0
    longitud = 0

    get paramsMapBox() {
        return {
            access_token: process.env.MAPBOX_KEY || '',
            limit: 5,
            language: 'es',
        }
    }

    get paramsOpenWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY || '',
            lat: this.latitud,
            lon: this.longitud,
            units: 'metric',
            lang: 'es',
        }
    }

    get historiaCapitalizado() {
        if (this.historial.length > 0) {
            return this.historial.map((lugar) => {
                return lugar.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase())
            })
        } else {
            return this.historial
        }
    }

    constructor() {
        this.leerDeBaseDeDatos()
    }

    /**
     *
     * @param {string} lugar el nombre de la Ciudad o Lugar que se desea buscar
     * @returns Arreglo de objetos con las ciudades y lugar que coinciden con el nombre proporcionado
     * @author Darwin Ruiz
     */
    ciudad = async (lugar = '') => {
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapBox,
            })

            const respuesta = await instance.get()
            return respuesta.data.features.map((lugar) => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }))
        } catch (error) {
            return []
        }
    }

    /**
     *
     * @param {number} lat - Latitud de la Ciudad o Lugar
     * @param {number} lng - Longitud de la Ciudad o Lugar
     * @author Darwin Ruiz
     */
    climaLugar = async (lat, lng) => {
        this.latitud = lat
        this.longitud = lng
        try {
            const openWeaterInstanceFromAxios = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: this.paramsOpenWeather,
            })
            const respuesta = await openWeaterInstanceFromAxios.get()
            return {
                desc: respuesta.data.weather[0].description,
                min: respuesta.data.main.temp_min,
                max: respuesta.data.main.temp_max,
                temp: respuesta.data.main.temp,
            }
        } catch (error) {}
    }

    agregarHistoria = (lugar = '') => {
        if (this.historial.includes(lugar.toLocaleLowerCase())) return
        this.historial.unshift(lugar.toLocaleLowerCase())
        this.guardarEnBaseDeDatos()
    }

    guardarEnBaseDeDatos = () => {
        const payload = {
            historial: this.historial,
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }

    leerDeBaseDeDatos = () => {
        if (fs.existsSync(this.dbPath)) {
            const respuesta = fs.readFileSync(this.dbPath, {
                encoding: 'utf-8',
            })

            this.historial = JSON.parse(respuesta).historial
        }
    }
}

module.exports = Busquedas
