const inquirer = require('inquirer')
require('colors')

const stop = [
	{
		type: 'input',
		name: 'pausa',
		message: `Presione ${'ENTER'.bgCyan} para continuar`,
		/* choices: [{ value: 'ENTER', name: 'Continua?' }] */
	}
]

const preguntas = [
	{
		type: 'list',
		name: 'opcion',
		message: '¿Que desea hacer?',
		choices: [
			{
				value: 1,
				name: `${'1.'.cyan} Buscar ciudad`
			},
			{
				value: 2,
				name: `${'2.'.cyan} Historial`
			},
			{
				value: 0,
				name: `${'0.'.cyan} Salir`
			}
		]
	}
]

const inquirerMenu = async () => {
	console.clear()
	console.log('==============================='.bgCyan)
	console.log(`${'= <> Seleccione una opcion <>'.white} =`.green)
	console.log('===============================\n'.bgCyan)
	const { opcion } = await inquirer.prompt(preguntas)
	return opcion

}

const searchCity = async () => {
	console.log('buscando ciudad')
}

const history = async () => {
	console.log('historial')
}

const pausa = async () => {
	/* console.clear() */
	console.log('\n')
	const { pausa } = await inquirer.prompt(stop)
	return pausa
}

const readInput = async (message) => {//leer inputs
	const question = [
		{
			type: 'input',
			name: 'desc',
			message: message,
			validate(value) {
				if (value.length === 0) {
					return 'Por favor ingrese un valor'
				}
				return true
			}
		}
	]
	const { desc } = await inquirer.prompt(question)
	return desc
}

const listPlaces = async (place = []) => {
	const choices = place.map((place, i) => {
		const idx = `${i + 1}.`.cyan
		return {
			value: place.id,
			name: `${idx} ${place.nombre}`
		}
	})
	choices.unshift({
		value: 0,
		name: '0. '.cyan + 'Volver atras'
	})
	const preguntas = [
		{
			type: 'list',
			name: 'id',
			message: 'Seleccione lugar:',
			choices
		}
	]
	const { id } = await inquirer.prompt(preguntas)
	return id
}

const showCheckList = async (tareas = []) => {
	const choices = tareas.map((tarea, i) => {
		const idx = `${i + 1}.`.gray
		return {
			value: tarea.id,
			name: `${idx} ${tarea.desc}`,
			checked: (tarea.completadoEn) ? true : false
		}
	})
	const question = [
		{
			type: 'checkbox',
			name: 'ids',
			message: 'Seleccione',
			choices
		}
	]
	const { ids } = await inquirer.prompt(question)
	return ids
}

const confirm = async (message) => {
	const question = [
		{
			type: 'confirm',
			name: 'ok',
			message
		}
	]
	const { ok } = await inquirer.prompt(question)
	return ok
}

module.exports = {
	inquirerMenu,
	pausa,
	readInput,
	listPlaces,
	confirm,
	showCheckList,
	searchCity,
	history
}