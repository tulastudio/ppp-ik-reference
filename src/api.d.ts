type FundListMessage =
	| {
			type: 'setHeight';
			height: number;
	  }
	| { type: 'setFunds'; funds: string[] }
	| { type: 'setFundInfo'; fund: string | null };
