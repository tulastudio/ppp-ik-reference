const selectedList = document.querySelector<HTMLElement>('[data-selected]');
const fundList = document.querySelector<HTMLIFrameElement>('iframe[data-fund-list]');

const updateList = (funds: string[]) => {
	const nodes = funds.map(fund => {
		const node = document.createElement('li');
		const name = document.createTextNode(fund);
		const button = document.createElement('button');
		button.setAttribute('data-remove', fund);
		button.textContent = '×';
		node.appendChild(name);
		node.appendChild(button);
		return node;
	});

	while (selectedList.firstChild) {
		selectedList.removeChild(selectedList.firstChild);
	}

	for (const node of nodes) {
		selectedList.appendChild(node);
	}
};

type BroadcastMessage =
	| {
			type: 'setHeight';
			height: number;
	  }
	| { type: 'setFunds'; funds: string[] };

window.addEventListener('message', (event: MessageEvent<BroadcastMessage>) => {
	if (event.data.type === 'setHeight') {
		fundList.style.height = event.data.height + 'px';
	}

	if (event.data.type === 'setFunds') {
		updateList(event.data.funds);
	}
});

selectedList.addEventListener('click', (event) => {
	if (!(event.target instanceof HTMLElement)) return;

	if (event.target.hasAttribute('data-remove')) {
		event.stopPropagation();
		const fundId = event.target.getAttribute('data-remove');

		fundList.contentWindow.postMessage({type: 'removeFund', fundId }, '*');
	}
});
