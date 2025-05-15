# Homni Dashboard Search Behavior

The Homni Dashboard features a robust search system designed to help users quickly find their services and servers.

## Search Logic

The search system follows a clear priority order to provide the most relevant results:

1. **Service Name Priority**: When you search for a term, Homni first tries to find services that match that term
   - If services are found, only servers hosting those matching services are displayed
   - Within those servers, only the services matching your search term are shown

2. **Server Name Fallback**: If no services match your search term, Homni falls back to searching server names
   - If a server name matches, that server is shown with all of its services

## Examples

### Searching for a Service

If you search for "plex":

- All servers that host a service named "plex" (or containing "plex") will be shown
- Within those servers, only the Plex service will be displayed
- Other services on those servers will be hidden
- Any server named "PlexServer" that doesn't have a Plex service won't appear in results

### Searching for a Server

If you search for "ds620slim" (assuming no service contains this term):

- The server named "ds620slim" will be shown with all of its services
- Other servers won't be displayed

### Conflict Resolution

If both a service and a server share a name (or part of a name):

- The service search takes priority
- For example, if you have a "plexpi" server and multiple servers running "plex" services:
  - Searching for "plex" will show all servers with Plex services, including potentially the "plexpi" server
  - The "plexpi" server will only appear if it has a Plex service
  - If "plexpi" doesn't have a "plex" service, it won't appear in the results even though its name contains "plex"

## Future Enhancements

A potential future enhancement would be to implement advanced search that can specifically target server names or service names, or combine them using search operators.

For example:
- `service:plex` - Search specifically for services named "plex"
- `server:plexpi` - Search specifically for servers named "plexpi"
- `port:32400` - Search for services on a specific port

This feature would allow for more precise searching when needed. 