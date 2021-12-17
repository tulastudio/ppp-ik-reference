import { enableBodyScroll, disableBodyScroll } from 'body-scroll-lock';

const WEBSITE_URL = process.env.WEBSITE_URL || 'https://pppension.demo.tulastudio.se';

/**
 * Get elements
 */
const selectedList = document.querySelector<HTMLElement>('[data-selected]');
const fundListEl = document.querySelector<HTMLElement>('[data-fund-list]');

/**
 * A local copy of the selected funds
 */
let selectedFunds = [];
let maxFunds = 3;

/**
 * Get the URL to the list iframe
 */
const getListIframeURL = (initialFunds?: string[], maxFunds?: number) => {
	const fundListDocument =
		WEBSITE_URL + '/wp-content/themes/pppension/dist/fund-list.html';

	let queryParams: string[] = [];
	if (initialFunds) {
		queryParams.push('initialFunds=' + initialFunds.join(','));
	}
	if (maxFunds) {
		queryParams.push('maxFunds=' + maxFunds);
	}

	const queryJoin = fundListDocument.includes('?') ? '&' : '?';
	return fundListDocument + queryJoin + queryParams.join('&');
};

/**
 * get the URL to the info iframe
 */
const getInfoIframeURL = (fundId: string) => {
	const fundInfoDocument =
		WEBSITE_URL + '/wp-content/themes/pppension/dist/fund-info.html';

	const queryJoin = fundInfoDocument.includes('?') ? '&' : '?';
	return fundInfoDocument + queryJoin + `fundId=${fundId}`;
};

/**
 * Get or create the list iframe element
 */
const getFundListIframe = () => {
	let fundListIframe =
		document.querySelector<HTMLIFrameElement>('iframe.fli-list');

	if (!fundListIframe) {
		fundListIframe = document.createElement('iframe');
		fundListIframe.classList.add('fli-list');
		fundListIframe.src = getListIframeURL(selectedFunds, maxFunds);
		fundListEl.appendChild(fundListIframe);
	}

	return fundListIframe;
};

/**
 * Get or create the info iframe element
 */
const getFundInfoIframe = () => {
	let fundInfoIframe =
		document.querySelector<HTMLIFrameElement>('iframe.fli-info');

	if (!fundInfoIframe) {
		fundInfoIframe = document.createElement('iframe');
		fundInfoIframe.classList.add('fli-info');
		fundInfoIframe.style.display = 'none';
		fundInfoIframe.src = 'about:blank';
		document.body.appendChild(fundInfoIframe);
	}

	return fundInfoIframe;
};

/**
 * Create the iframe
 */
getFundListIframe();


/**
 * Show info iframe
 */
const showInfo = (fundId: string) => {
	const fundInfoIframe = getFundInfoIframe();
	fundInfoIframe.src = getInfoIframeURL(fundId);
	fundInfoIframe.style.display = 'block';
	disableBodyScroll(fundInfoIframe);
};

/**
 * Hide info iframe
 */
const hideInfo = () => {
	const fundInfoIframe = getFundInfoIframe();
	fundInfoIframe.style.display = 'none';
	fundInfoIframe.src = 'about:blank';
	enableBodyScroll(fundInfoIframe);
};

/**
 * Set the funds in the list
 */
const setFunds = (funds: string[]) => {
	selectedFunds = funds;

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
};

/**
 * Listen for messages
 */
window.addEventListener('message', (event: MessageEvent<FundListMessage>) => {
	const fundListIframe = getFundListIframe();

	if (event.origin !== WEBSITE_URL) {
		console.warn('Received message from unknown origin', event.origin);
		return;
	};

	if (event.data.type === 'setHeight') {
		fundListIframe.style.height = event.data.height + 'px';
	}

	if (event.data.type === 'setFunds') {
		setFunds(event.data.funds);
	}

	if (event.data.type === 'setFundInfo') {
		if (event.data.fund) {
			showInfo(event.data.fund);
		} else {
			hideInfo();
		}
	}

	if (event.data.type === 'disabledClick') {
		console.log('Clicked a disable fund checkbox');
	}
});

/**
 * Remove a fund from the list
 */
selectedList.addEventListener('click', (event) => {
	if (!(event.target instanceof HTMLElement)) return;

	if (event.target.hasAttribute('data-remove')) {
		event.stopPropagation();

		const fundListIframe = getFundListIframe();
		const fundId = event.target.getAttribute('data-remove');

		selectedFunds = selectedFunds.filter((f) => f !== fundId);

		const message: FundListMessage = {
			type: 'setFunds',
			funds: selectedFunds,
		};
		fundListIframe.contentWindow.postMessage(message, WEBSITE_URL);
	}
});
