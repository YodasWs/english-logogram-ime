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

			function updateCompBox(word) {
				$list.empty()
				if (! word || typeof word !== 'string') return
				dictStartWith(word.toLowerCase()).forEach((word) => {
					$list.append(`<li>${word}`)
				})
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
							$list.empty()

							if (composing.is) {

								// TODO: Replace word
								re = new RegExp(`([a-z']+)${e.data}$`, 'i')
									console.log('re:', re)
								end = re.exec(e.target.value)
									console.log(`'${e.target.value}'`)
									console.log('end:', end)
								if (Array.isArray(end)) {
									lastWord = end[1].toLowerCase()
									console.log(lastWord)
									if (dict[lastWord]) {
										console.log('dict:', dict[lastWord])
										e.target.value = e.target.value.replace(re, `${dict[lastWord]}${e.data}`)
									}
								}
							}
							composing.is = false

						} else if (isLetter(e.data) || e.data === "'") {
							// TODO: Open Composition Box if unopen
							// TODO: Update Composition Box
							if (!composing.is) {
								composing.start = end.index
							}
							composing.is = true
							updateCompBox(lastWord)
						} else if (isNumeric(e.data)) {
						}
						break;

					case 'insertLineBreak':
						composing.is = false
						break;

					case 'deleteContentBackward':
						if (composing.is) {
							if (e.target.value.length <= composing.start) {
								$list.empty()
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
		if (i.startsWith(word)) list.push(dict[i])
	}
	return list.unique()
}

Array.prototype.unique = function() {
	return this.filter((val, i) => {
		return this.indexOf(val) === i
	})
}
