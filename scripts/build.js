const fs = require("fs-extra");
const path = require("path");
const { marked } = require("marked");

// Define the paths
const markdownDir = path.join(__dirname, "..", "pages");
const htmlDir = path.join(__dirname, "..", "site");
const mergeOnTemplate = (page) => {
	const templatePath = path.join(__dirname, "template.html");
	const template = fs.readFileSync(templatePath, "utf8");
	return template.replace("<!-- body -->", page);
};

// Read all markdown files from the markdown directory
fs.readdir(markdownDir, (err, files) => {
	if (err) throw err;

	// Loop through each markdown file
	files.forEach((file) => {
		// Check if the file is a markdown file
		if (path.extname(file) === ".md") {
			// Read the markdown file
			fs.readFile(path.join(markdownDir, file), "utf8", (err, data) => {
				if (err) throw err;

				// Convert the markdown to HTML
				const html = mergeOnTemplate(marked(data));

				// Write the HTML to a new file in the HTML directory
				fs.writeFile(
					path.join(htmlDir, `${path.parse(file).name}.html`),
					html,
					(err) => {
						if (err) throw err;
						console.log(`${file} converted to HTML`);
					}
				);
			});
		}
	});
});

// copy assets to site/assets/ directory
if (!fs.existsSync(path.join(__dirname, "..", "site", "assets"))) {
	fs.mkdirSync(path.join(__dirname, "..", "site", "assets"));
}

fs.copy(
	path.join(__dirname, "..", "assets"),
	path.join(__dirname, "..", "site", "assets"),
	(err) => {
		if (err) throw err;
		console.log("assets/ copied to site/assets/ directory");
	}
);

// copy pages.json to site directory
// Disable when building /blog pages and put published date on pages
fs.copyFile(
	path.join(__dirname, "pages.json"),
	path.join(__dirname, "..", "site", "pages.json"),
	(err) => {
		if (err) throw err;
		console.log("pages.json copied to site directory");
	}
);
