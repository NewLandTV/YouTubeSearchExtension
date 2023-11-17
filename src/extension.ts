import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('youtube-search.search', () => {
		const searchQueryWindow = vscode.window.createInputBox();

		searchQueryWindow.title = "YouTube";
		searchQueryWindow.placeholder = "Search";
		searchQueryWindow.prompt = "Press Enter key to search or Esc key to cancel.";

		searchQueryWindow.onDidAccept(() => {
			searchQueryWindow.hide();
			YouTubePanel.CreateAndShow(context.extensionUri, `https://www.youtube.com/results?search_query=${searchQueryWindow.value}`);
		});

		searchQueryWindow.show();
	}));
}

export function deactivate() {}

// Classes
class YouTubePanel {
	public static currentPanel: YouTubePanel | undefined;

	public static readonly viewType = "YouTube Panel";
	public static readonly title = "YouTube";

	private readonly panel: vscode.WebviewPanel;
	private readonly extensionUri: vscode.Uri;

	private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, url: string) {
		this.panel = panel;
		this.extensionUri = extensionUri;
		this.panel.title = YouTubePanel.title;
		this.panel.webview.html = this.GetHtmlForWebview(panel.webview, url);
	}

	public static CreateAndShow(extensionUri: vscode.Uri, url: string) {
		const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
		const panel = vscode.window.createWebviewPanel(
			YouTubePanel.viewType,
			YouTubePanel.title,
			column || vscode.ViewColumn.One,
			{
				enableScripts: true,
				localResourceRoots: [extensionUri]
			}
		);

		YouTubePanel.currentPanel = new YouTubePanel(panel, extensionUri, url);
	}

	private GetHtmlForWebview(webview: vscode.Webview, url: string) {
		return `<!DOCTYPE html>
				<html>
				<head>
					<meta charset="UTF-8">
					<title>YouTube</title>
				</head>
				<body>
					<a href="${url}">Result</a>
				</body>
				</heml>`;
	}
}