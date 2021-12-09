module.exports = {
	plugins: {
		"posthtml-expressions": {
			locals: {
				EMBED_URL: process.env.EMBED_URL
			}
		}
	}
};
