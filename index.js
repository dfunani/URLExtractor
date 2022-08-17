const input_box = document.getElementById('input-el');
const save_input = document.getElementById('save-btn');
const url_list = document.getElementById('url-list');
const invalid_url = document.getElementById('Invalid-URL');
const get_tab = document.getElementById('tab-btn');
let stored_urls = JSON.parse(localStorage.getItem('Urls'));

const delete_all_btn = document.getElementById('delete-btn');
invalid_url.style.display = 'none';

if (!stored_urls) {
	stored_urls = [];
}
let url_regex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig;

window.addEventListener('load', () => { Extract_Stored_URL(stored_urls); });
save_input.addEventListener('click', function () {
	store_url(input_box.value);
	input_box.value = '';
});
get_tab.addEventListener('click', get_current_tab);
delete_all_btn.addEventListener('click', delete_all);

// Chrome API for Get Active WIndows Current Tab
function get_current_tab(callback) {
	let queryOptions = { active: true, lastFocusedWindow: true };
	chrome.tabs.query(queryOptions, ([tab]) => {
		if (chrome.runtime.lastError)
			console.error(chrome.runtime.lastError);
		// `tab` will either be a `tabs.Tab` instance or `undefined`.
		console.log(tab);
		store_url(tab.url);
		callback(tab);
	});

}

function delete_all() {
	localStorage.clear();
	stored_urls = [];
}

function store_url(url_to_store) {
	if (!url_regex.test(url_to_store) || url_to_store === '') {
		invalid_url.style.display = 'block';
		return;
	}
	console.log(url_to_store);
	stored_urls.push(url_to_store);
	persist_url(stored_urls);
	Extract_Stored_URL(stored_urls);
}

function persist_url(url) {
	localStorage.setItem('Urls', JSON.stringify(url));
}

function Extract_Stored_URL(urls) {
	url_list.innerHTML = '';
	invalid_url.style.display = 'none';
	urls.forEach(element => {
		render(element);
	});
}

// Saves the input fields saved url
function render(url) {
	let list_item = document.createElement('li');
	let anchor = document.createElement('a');
	anchor.setAttribute('href', url)
	anchor.classList.add('text-success')
	let delete_btn = document.createElement('button')
	delete_btn.classList.add('btn-close');
	delete_btn.classList.add('btn-success');

	list_item.classList.add('alert');
	list_item.classList.add('alert-success');
	list_item.classList.add('alert-dismissible');
	list_item.classList.add('d-flex');
	list_item.classList.add('fade');
	list_item.classList.add('show');
	list_item.classList.add('bg-outline-success');
	anchor.append(url);
	list_item.append(anchor);
	list_item.append(delete_btn);
	url_list.append(list_item);
}

