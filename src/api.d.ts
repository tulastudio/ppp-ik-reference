type FundListMessage =
	| {
			type: 'setHeight';
			height: number;
	  }
	| { type: 'setFunds'; funds: string[] }
	| { type: 'setDisabledFunds'; funds: string[] }
	| { type: 'setFundInfo'; fund: string | null }
	| { type: 'disabledUnselectedClick' }
	| { type: 'disabledSelectedClick' };
