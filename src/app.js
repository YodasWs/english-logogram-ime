/* app.json */

// Expand dictionary entries with HTML to display
Object.entries(dict).forEach(([originalEnglish, logograms]) => {
	// Convert to Array for looping
	if (typeof logograms === 'string') {
		logograms = [logograms];
	}
	dict[originalEnglish] = logograms.map((character) => {
		// Convert to basic object
		if (typeof character === 'string') {
			character = {
				logo: character,
			};
		}
		const section = ((file) => {
			switch (file) {
				case 'pronouns.json':
					return 'pronoun';
				case 'kyoiku-kanji-1.json':
					return '1st grade';
				case 'kyoiku-kanji-2.json':
					return '2nd grade';
				case 'kyoiku-kanji-3.json':
					return '3rd grade';
				case 'kyoiku-kanji-4.json':
					return '4th grade';
				case 'kyoiku-kanji-5.json':
					return '5th grade';
				case 'kyoiku-kanji-6.json':
					return '6th grade';
				case 'silent-e.json':
					return 'remove magic e';
				case 'sh.json':
					return 'Ʃ/ʃ';
				case 'th.json':
					return 'Ð/ð';
				default:
					return file;
			}
		})(character.file);
		return {
			html: `<strong>${character.logo}</strong>, ${originalEnglish}${
				typeof section === 'string' ? ` <small>${section}</small>` : ''
			}`,
			section,
			...character,
		};
	});
});

console.log('Sam, dict:', dict);

let $list;
let list = [];
// TODO: Accept multiple words
const regexLastWord = /\b[a-z']+$/i;

(function onReady(fn) {
	let readied = false;
	document.addEventListener('readystatechange', (e) => {
		if (readied) return;
		if (['interactive', 'complete'].includes(document.readyState)) {
			readied = true;
			fn(e);
		}
	});
})(() => {
	$list = document.querySelector('#composition');
	[...document.querySelectorAll('textarea')].forEach((textarea) => {
		const composing = {
			// Keep track of where the current composition text starts
			// TODO: Update to cursor/selectionEnd when the cursor/selection is moved
			start: 0,
		};

		textarea.addEventListener('keydown', (e) => {
			if (e.key === 'ArrowRight') {
				composing.start = e.target.selectionEnd;
				clearCompositionBox();
			}
		});

		// TODO: Can we get this to work on a touchscreen keyboard?
		textarea.addEventListener('input', (e) => {

			const txtarea = e.target;

			let replacement = null;

			// First, get the English string in which we will be making our replacement
			let strSearch = txtarea.value;
			if (txtarea.selectionStart === txtarea.selectionEnd) {
				strSearch = strSearch.substring(composing.start, txtarea.selectionEnd);
			} else {
				strSearch = strSearch.substring(txtarea.selectionStart, txtarea.selectionEnd);
			}

			// Check inputType
			switch (e.inputType) {
			case 'insertText':
				if (!(typeof e.data === 'string')) {
					break;
				}
				// Whitespace and punctuation, replace English
				if (e.data.match(/[\!\?:;,'"\)\*\.\s]/)) {
					// Grab composition entered, not including last character
					const composition = new RegExp(`(.+)${e.data === '?' ? '\\?' : e.data}$`, 'i').exec(strSearch);
					const lastWord = Array.isArray(composition) && composition.length > 1 ? composition[1].toLowerCase() : null;
					// If exact match or only one choice, use the match for replacement
					if (dict[lastWord] || list.length === 1) {
						const word = list.length === 1 ? list[0] : dict[lastWord][0];
						// Grab replacement text
						replacement = `${word.logo}${e.data}`;
						break;
					}

					// Continuing the composition
					updateCompositionBox(strSearch);

					// If no results, we're starting a new composition
					if (list.length === 0) {
						composing.start = txtarea.selectionEnd;
						console.log('Sam, no results, composing.start:', composing.start);
						break;
					}
				} else if (isLetter(e.data)) {
					// Now update composition box
					updateCompositionBox(strSearch);
				} else if (Number.isFinite(Number.parseInt(e.data))) {
					// Replace Text with Selected Composition Box Entry
					const composition = new RegExp(`(.+)${e.data === '?' ? '\\?' : e.data}$`, 'i').exec(strSearch);
					if (Array.isArray(composition) && composition.length > 1) {
						replacement = list[Number.parseInt(e.data) - 1].logo;
						break;
					}
				}
				break;

			case 'deleteContentBackward':
				// User hit backspace, update composition box
					console.log('Sam, composing.start:', composing.start);
				composing.start = Math.min(composing.start, txtarea.selectionEnd);
					console.log('Sam, composing.start:', composing.start);
				updateCompositionBox(strSearch);
				break;

			case 'deleteWordBackward':
				// Deleted last word, update composition box
				composing.start = Math.min(composing.start, txtarea.selectionEnd);
				updateCompositionBox(strSearch);
				break;

			case 'insertLineBreak':
				// Moved to next line, clear box and do not replace text
				composing.start = txtarea.selectionEnd;
				clearCompositionBox();
				break;

			default:
				console.log(e);
			}

			// Now replace text in textarea
			if (typeof replacement === 'string') {
				txtarea.value = txtarea.value.substring(0, composing.start) + replacement + txtarea.value.substring(txtarea.selectionEnd);
				txtarea.setSelectionRange(composing.start + replacement.length, composing.start + replacement.length);
				// Mark start of next composition
				composing.start = txtarea.selectionEnd;
				clearCompositionBox();
			}
		});
	});
});

// Find all entries in dictionary starting with `word`
function dictStartWith(word) {
	word = word.toLowerCase();
	const checkList = [];
	Object.entries(dict).forEach(([originalEnglish, logograms]) => {
		if (!originalEnglish.startsWith(word)) return;
		checkList.push(...logograms);
	});
	return checkList;
}

function clearCompositionBox() {
	$list.innerHTML = '';
	list = [];
}

function updateCompositionBox(word) {
	clearCompositionBox();
	if (!word || typeof word !== 'string') return;
	dictStartWith(word.toLowerCase()).forEach((word) => {
		const li = document.createElement('li');
		$list.appendChild(li);
		li.innerHTML = word.html;
		list.push(word);
	});
}

function isLetter(c) {
	return c.toLowerCase() !== c.toUpperCase();
}
