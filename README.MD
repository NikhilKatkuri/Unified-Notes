# Unified Notes (in development)

Unified Notes is an offline-first, multi-device note synchronization system built with version-based conflict resolution and deterministic backend validation.

It is designed to simulate real-world sync architecture where data consistency, reliability, and fail-safe behavior matter more than basic CRUD functionality.

- Offline-first: Users can create, edit, and delete notes without an internet connection. Changes are stored locally and synchronized when connectivity is restored.
- Version-based conflict resolution: Each note has a version number that increments with every change. When synchronizing, the system compares version numbers to determine which changes to apply, ensuring that the most recent updates are preserved.

- Deterministic backend validation: The backend validates incoming changes based on predefined rules (e.g., version numbers, timestamps) to ensure data integrity and prevent conflicts.

## Techinal and Dependency Stack

### Frontend

### backend

...

## File Structure

```
├── app
│   ├── client
│   └── server
├── packages
├── README.MD
└── package.json
```

## author

Nikhil Katuri
