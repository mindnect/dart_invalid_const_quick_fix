import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
    // console.log("Extension is now active!");
    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider(
            { language: "dart", scheme: "file" },
            new InvalidConstantFixProvider(),
            {
                providedCodeActionKinds: [
                    vscode.CodeActionKind.QuickFix,
                    vscode.CodeActionKind.SourceFixAll,
                ],
            }
        )
    );
}

class InvalidConstantFixProvider implements vscode.CodeActionProvider {
    provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<(vscode.Command | vscode.CodeAction)[]> {
        const invalidConstantDiagnostics = context.diagnostics.filter((diagnostic) => {
            if (typeof diagnostic.code === "object" && "value" in diagnostic.code) {
                return (
                    diagnostic.code.value === "const_with_non_const" ||
                    diagnostic.code.value === "const_with_non_constant_argument"
                );
            } else {
                return diagnostic.code === "invalid_constant";
            }
        });

        const quickFixActions = invalidConstantDiagnostics
            .filter((diagnostic) => {
                if (typeof diagnostic.code === "object" && "value" in diagnostic.code) {
                    return diagnostic.code.value === "const_with_non_constant_argument";
                } else {
                    return diagnostic.code === "invalid_constant";
                }
            })
            .map((diagnostic) =>
                this.createFix(document, diagnostic, vscode.CodeActionKind.QuickFix)
            );

        const sourceFixAllActions = invalidConstantDiagnostics.map((diagnostic) =>
            this.createFix(document, diagnostic, vscode.CodeActionKind.SourceFixAll)
        );

        return [...quickFixActions, ...sourceFixAllActions];
    }

    private createFix(
        document: vscode.TextDocument,
        diagnostic: vscode.Diagnostic,
        kind: vscode.CodeActionKind
    ): vscode.CodeAction {
        const edit = new vscode.WorkspaceEdit();
        const action = new vscode.CodeAction("Fix invalid constant", kind);

        action.diagnostics = [diagnostic];
        const errorRange = diagnostic.range;
        const errorStartPosition = errorRange.start;
        const documentText = document.getText();

        // Find the closest 'const' keyword before the error range
        const constKeyword = "const ";
        const constIndex = documentText.lastIndexOf(
            constKeyword,
            document.offsetAt(errorStartPosition)
        );

        if (constIndex !== -1) {
            // Get the text from 'const' to the end of the error range
            const constRange = new vscode.Range(
                document.positionAt(constIndex),
                errorRange.end.translate(0, 1)
            );

            const constText = document.getText(constRange);
            // console.log(`Error phrase: ${constText}`);

            // Replace constKeyword of the text with the fixed text
            const fixedText = constText.replace(constKeyword, "");
            edit.replace(document.uri, constRange, fixedText);
        }
        action.edit = edit;
        return action;
    }
}
