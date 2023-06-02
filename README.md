![screenshot](./media/img.png)

# Dart Invalid Constant Quick Fix

This extension provides a quick fix for invalid constant errors in Dart code within Visual Studio Code.

## Features

-   Provides a quick fix to remove the `const` keyword from the invalid constant declaration.
-   Supports both quickFix and fixAll actions.

## Usage

1. Open a Dart file in Visual Studio Code.
2. If there are any invalid constant errors, a lightbulb icon will appear next to the problematic code.
3. Click on the lightbulb icon and select "Fix invalid constant" to apply the quick fix.
4. To apply the fix All invalid constants in the source code, execute Fix All from command palette.

## Auto fix all on save
```
  "editor.codeActionsOnSave": {
    "source.fixAll": true,
  },
```

## Installation

Download and install this extension from the Visual Studio Code marketplace.
