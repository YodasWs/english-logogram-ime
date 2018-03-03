/* app.json */

angular.module('EnglishLogogramIME', modules)
.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
	$locationProvider.html5Mode(false)
	$routeProvider.when('/', {
		templateUrl: 'pages/home.html',
		controllerAs: '$ctrl',
		controller() {
			angular.element('[ng-view]').attr('ng-view', 'pageHome')
			let $list = $('#composition')
			let list = []

			function updateCompBox(word) {
				clearCompBox()
				if (! word || typeof word !== 'string') return
				dictStartWith(word.toLowerCase()).forEach((word) => {
					$list.append(`<li>${word}`)
					list.push(word)
				})
			}
			function clearCompBox() {
				$list.empty()
				list = []
			}

			document.querySelectorAll('textarea').forEach((textarea) => {
				let composing = {
					start: false,
					is: false,
				}

				textarea.addEventListener('input', (e) => {
					if (e.isComposing) composing.is = e.isComposing

					let re = /\b[a-z']+$/i, lastWord
					let end = re.exec(e.target.value)
					if (Array.isArray(end)) {
						lastWord = end[0].toLowerCase()
					}

					switch (e.inputType) {
					case 'insertText':
						if (e.data.match(/\s/)) { // Whitespace

							if (composing.is) {
								re = new RegExp(`([a-z']+)${e.data}$`, 'i')
								end = re.exec(e.target.value)
								if (Array.isArray(end)) {
									lastWord = end[1].toLowerCase()
									if (dict[lastWord] || list.length === 1) {
										const word = list.length === 1 ? list[0] : Array.isArray(dict[lastWord]) ? dict[lastWord][0] : dict[lastWord]
										e.target.value = e.target.value.replace(re, `${word}${e.data}`)
									}
								}
							}
							composing.is = false
							clearCompBox()

						} else if (isLetter(e.data) || e.data === "'") {
							// TODO: Open Composition Box if unopen
							if (!composing.is) {
								composing.start = end.index
							}
							composing.is = true
							updateCompBox(lastWord)

						} else if (isNumeric(e.data)) {
							if (composing.is) {
								// Replace Text with Selected Composition Box Entry
								const num = Number.parseInt(e.data, 10) - 1
								re = new RegExp(`([a-z']+)${e.data}$`, 'i')
								end = re.exec(e.target.value)
								if (Array.isArray(end) && list[num]) {
									e.target.value = e.target.value.replace(re, `${list[num]} `)
									clearCompBox()
								}
							}
						}
						break;

					case 'insertLineBreak':
						clearCompBox()
						if (composing.is) e.target.value = e.target.value.replace(/\r?\n$/, '')
						composing.is = false
						break;

					case 'deleteContentBackward':
						if (composing.is) {
							if (e.target.value.length <= composing.start) {
								composing.is = false
								clearCompBox()
							} else {
								updateCompBox(lastWord)
							}
						}
						break;

					default:
						console.log(e)
					}

				}, false)
			})

			// angular.element('[ng-view]').append('<pre style="white-space: pre-line">' + JSON.stringify(dict))
		},
	})
	.otherwise({redirectTo: '/'})
}])

function isLetter(c) {
	return c.toLowerCase() !== c.toUpperCase()
}
function isNumeric(c) {
	return isFinite(c)
}

function dictStartWith(word) {
	word = word.toLowerCase()
	let list = []
	for (let i in dict) {
		if (i.startsWith(word)) {
			if (typeof dict[i] === 'string') list.push(dict[i])
			if (Array.isArray(dict[i])) list = list.concat(dict[i])
		}
	}
	return list.unique()
}

Array.prototype.unique = function() {
	return this.filter((val, i) => {
		return this.indexOf(val) === i
	})
}
