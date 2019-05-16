/* app.json */

let $list;
let list = [];

function updateCompBox(word) {
	clearCompBox();
	if (! word || typeof word !== 'string') return;
	dictStartWith(word.toLowerCase()).forEach((word) => {
		const li = document.createElement('li');
		li.innerHTML = word;
		$list.appendChild(li);
		list.push(word);
	});
}
function clearCompBox() {
	$list.innerHTML = '';
	list = [];
}

function onReady(fn) {
	let c = false;
	document.addEventListener('readystatechange', (e) => {
		if (c) return;
		if (['interactive', 'complete'].includes(document.readyState)) {
			c = true;
			fn(e);
		}
	});
}

onReady(() => {
	$list = document.querySelector('#composition');
	console.log('Sam, DOM ready :)');
	const boxes = [...document.querySelectorAll('textarea')];
	console.log(`Sam, ${boxes.length} box${boxes.length != 1 ? 'es' : ''}`);
	boxes.forEach((textarea) => {
		let composing = {
			start: false,
			is: false,
		};

		textarea.addEventListener('input', (e) => {
			if (e.isComposing) composing.is = e.isComposing;

			const txtarea = e.target;

			let strSearch = txtarea.value;
			let replacement = null;

			if (txtarea.selectionStart === txtarea.selectionEnd) {
				strSearch = strSearch.substr(0, txtarea.selectionEnd);
			} else {
				strSearch = strSearch.substr(txtarea.selectionStart, txtarea.selectionEnd);
			}

			let re = /\b[a-z']+$/i, lastWord;
			let end = re.exec(strSearch);
			if (Array.isArray(end)) {
				lastWord = end[0].toLowerCase();
			}

			switch (e.inputType) {
				case 'insertText':
					if (e.data.match(/\s/)) { // Whitespace

						if (composing.is) {
							re = new RegExp(`([a-z']+)${e.data}$`, 'i');
								end = re.exec(strSearch);
								if (Array.isArray(end)) {
									lastWord = end[1].toLowerCase();
									if (dict[lastWord] || list.length === 1) {
										const word = list.length === 1 ? list[0] : Array.isArray(dict[lastWord]) ? dict[lastWord][0] : dict[lastWord];
										replacement = `${word}${e.data}`;
									}
								}
						}
						composing.is = false;
						clearCompBox();

					} else if (isLetter(e.data) || e.data === "'") {
						// TODO: Open Composition Box if unopen
						if (!composing.is) {
							composing.start = end.index;
						}
						composing.is = true;
						updateCompBox(lastWord);

					} else if (isNumeric(e.data)) {
						if (composing.is) {
							// Replace Text with Selected Composition Box Entry
							const num = Number.parseInt(e.data, 10) - 1;
							re = new RegExp(`([a-z']+)${e.data}$`, 'i');
								end = re.exec(strSearch);
								if (Array.isArray(end) && list[num]) {
									replacement = `${list[num]} `;
									composing.is = false;
									clearCompBox();
								}
						}
					}
					break;

				case 'insertLineBreak':
					composing.is = false;
					clearCompBox();
					break;

				case 'deleteContentBackward':
					if (composing.is) {
						if (strSearch.length <= composing.start) {
							composing.is = false;
							clearCompBox();
						} else {
							updateCompBox(lastWord);
						}
					}
					break;

				default:
					console.log(e);
			}

			if (typeof replacement === 'string') {
				txtarea.value = txtarea.value.substr(0, composing.start) + replacement + txtarea.value.substr(txtarea.selectionEnd);
				txtarea.setSelectionRange(composing.start + replacement.length, composing.start + replacement.length);
			}

		}, false);
	})
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
