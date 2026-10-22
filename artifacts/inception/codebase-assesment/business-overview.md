# Business Overview

## Business Context

A browser user enters contact details and a message. The React client submits them to the API, which saves an entry in a local JSON file. The client also retrieves and displays saved entries.

## Business Transactions

- Submit entry: provide name, email, and message; receive the saved entry.
- View collection: retrieve saved entries on initial load or refresh.

## Business Dictionary

- Entry: ID, name, email, message, and UTC creation timestamp.
- Collection: all stored entries returned by the API.

## Components

- Fieldnotes frontend: form, validation affordances, collection, loading/error/success feedback.
- UserInputApi: server-side validation, entry creation, JSON persistence, and collection retrieval.

No login, ownership, update, or delete workflow is implemented in the inspected API/client. Intended audience and migration acceptance criteria still require confirmation.
