```
To add new projects to `projects.json`, follow the JSON array format.
Each project is an object with the following fields:

*   **`id`**: (Number, required) Unique identifier for the project.
*   **`title`**: (String, required) The title of the project.
*   **`type`**: (String, required) The type or nature of the project (e.g., "Luxury Villa", "Office Building").
*   **`category`**: (String, required) The filter category. Must be one of: `"residential"`, `"commercial"`, `"infrastructure"`.
*   **`location`**: (String, required) The location of the project.
*   **`image`**: (String, required) Path to the project image (e.g., `"assets/img/project_image.jpg"`).
*   **`description`**: (String, optional) A brief description of the project.
*   **`featured`**: (Boolean, optional) Set to `true` if the project should be highlighted (e.g., on a homepage preview). Defaults to `false` if omitted.
*   **`mapLink`**: (String, optional) A URL to Google Maps or similar for the project location.

Example of a single project entry:
```json
{
  "id": 1,
  "title": "Modern Residence One",
  "type": "Luxury Villa",
  "category": "residential",
  "location": "Chennai, TN",
  "image": "assets/img/Residential.png",
  "description": "A beautiful modern residential project.",
  "featured": true,
  "mapLink": "https://maps.google.com"
}
```

**Important:**
*   The entire content of `projects.json` must be a valid JSON array (starts with `[` and ends with `]`).
*   Ensure that there are no trailing commas after the last project in the array, or after the last property in an object.
*   Validate your `projects.json` file using a JSON validator before using it in the application.
```
