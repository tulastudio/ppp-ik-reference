const selectedList = document.querySelector<HTMLElement>('[data-selected]');
const fundListEl = document.querySelector<HTMLElement>('[data-fund-list]');

try {
	const fundList = window.initializeFundList(fundListEl, {
		initialFunds: ['0P00000K9D', 'F0GBR05TYW'],
		maxFunds: 3,
	});

	fundList.on('setFunds', (funds: string[]) => {
		const nodes = funds.map((fund) => {
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
	});

	selectedList.addEventListener('click', (event) => {
		if (!(event.target instanceof HTMLElement)) return;

		if (event.target.hasAttribute('data-remove')) {
			event.stopPropagation();
			const fundId = event.target.getAttribute('data-remove');
			fundList.removeFund(fundId);
		}
	});
} catch (error) {
	fundListEl.innerHTML = 'Ett fel inträffade när listan skulle laddas.';
}
