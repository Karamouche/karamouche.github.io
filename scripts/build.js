const fs = require("fs-extra");
const jsonlines = require("jsonlines");
const path = require("path");
const { marked } = require("marked");

// Define the paths
const markdownDir = path.join(__dirname, "..", "pages");
const htmlDir = path.join(__dirname, "..", "site");
const mergeOnTemplate = (page, filename) => {
	const templatePath = path.join(__dirname, "template.html");
	const pageInfo = getPageInfo(filename);
	let template = fs.readFileSync(templatePath, "utf8");
	template = template.replace("<!-- title -->", pageInfo.title);
	template = template.replace("<!-- body -->", page);
	// add at line two the date
	const date = getPageDateFormated(filename);
	if (filename !== "index") {
		template = template.replace(
			"</h1>",
			`</h1><p class="date">- ${date} • Karamouche</p>`
		);
	} else {
		template = template.replace("</h1>", `</h1><p class="date"></p>`);
	}
	return template;
};

const getPageInfo = (filename) => {
	console.log(`Fetching page info for ${filename}`);
	if (filename === "index") {
		return {
			title: "Karamouche's blog",
		};
	}
	const parser = jsonlines.parse();
	const pages = fs.readFileSync(path.join(__dirname, "pages.jsonl"), "utf8");
	const pageInfo = {};
	parser.on("data", (data) => {
		if (data.filename === filename) {
			pageInfo.title = data.title;
			pageInfo.publishing_date = data.publishing_date;
		}
	});
	parser.write(pages);
	parser.end();
	return pageInfo;
};

const getPageDateFormated = (filename) => {
	const pageInfo = getPageInfo(filename);
	const date = new Date(pageInfo.publishing_date);
	// date formatted like "Aug 31, 2021"
	return date.toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
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
				const fileName = file.split(".")[0];
				// Convert the markdown to HTML
				const html = mergeOnTemplate(marked(data), fileName);

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

// build blog.html following the template
// blog.html will index all blog posts listed in pages.jsonl
const makeBlog = () => {
	console.log("Creating blog.html");
	const parser = jsonlines.parse();
	const pages = fs.readFileSync(path.join(__dirname, "pages.jsonl"), "utf8");
	const blog = [];
	parser.on("data", (data) => {
		if (data.filename !== "index") {
			const date = getPageDateFormated(data.filename);
			blog.push([
				date,
				`<div><a href="/${data.filename}.html">${data.title}</a><p> - ${date}</p></div>`,
			]);
		}
	});
	parser.write(pages);
	parser.end();
	const templatePath = path.join(__dirname, "template.html");
	let template = fs.readFileSync(templatePath, "utf8");
	// sort items in blog by date
	blog.sort((a, b) => b[0] - a[0]);
	template = template.replace("<!-- title -->", "Blog");
	return template.replace(
		"<!-- body -->",
		`<h1>Karamouche's blogposts</h1><div class="blogposts">${blog
			.map((item) => item[1])
			.join("")}</div>`
	);
};

fs.writeFile(path.join(htmlDir, `blog.html`), makeBlog(), (err) => {
	if (err) throw err;
	console.log(`blog.html created`);
});
