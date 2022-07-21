const { leerInput, inquirerMenu, pausa, listarLugares } = require('./helpers/inquirer')
const Busquedas = require('./models/Busquedas')

require('dotenv').config()

const main = async () => {
    const busquedas = new Busquedas()
    let opcion

    do {
        opcion = await inquirerMenu()

        switch (opcion) {
            case 1:
                const terminoDeBusqueda = await leerInput('Ciudad: ')
                const lugares = await busquedas.ciudad(terminoDeBusqueda)
                const idSeleccionado = await listarLugares(lugares)
                if (idSeleccionado === '0') continue

                const lugarSeleccionado = lugares.find((elemento) => elemento.id === idSeleccionado)
                busquedas.agregarHistoria(lugarSeleccionado.nombre)

                const climaDelLugar = await busquedas.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.lng)

                console.log('\nInformación de la ciudad\n'.green)
                console.log(`Ciudad: ${lugarSeleccionado.nombre.toString().yellow}`)
                console.log(`Latitud: ${lugarSeleccionado.lat.toString().yellow}`)
                console.log(`Longitud: ${lugarSeleccionado.lng.toString().yellow}`)
                console.log(`Temperatura: ${climaDelLugar.temp.toString().yellow}`)
                console.log(`Temperatura Mínima: ${climaDelLugar.min.toString().yellow}`)
                console.log(`Temperatura Máxima: ${climaDelLugar.max.toString().yellow}`)
                console.log(`Clima: ${climaDelLugar.desc.toString().yellow}`)
                break

            case 2:
                historiaDeBusquedas = busquedas.historiaCapitalizado
                historiaDeBusquedas.forEach((lugar, index) => {
                    const idx = `${index + 1}.`.green
                    console.log(`${idx} ${lugar}`)
                })
                break
        }

        if (opcion !== 0) await pausa()
    } while (opcion !== 0)
}

main()
