# Rocket Builder

Open-source page/website builder. 

> Features

- Editor
  - Top bar: Save, Load, Add Page
  - Left Column: Components
  - Right Column: Component props
  - Middle Section:
    - the page under build 
- Multiple Layouts Supported
  - One column with horizontal sections
  - Dashboard view
    - left sidebar
    - right sidebar
- Editor `LEFT Column`
  - Component grouped by categories
  - Categories are foldable 
    - Navigation `category`
    - HERO sections
    - Features
    - Footers
- Editor `Middle Section`
  - The user can drag & drop components
  - change the order 
  - edit props (when the component is selected)
    - associated props available on right 
- Editor `RIGHT Column`
  - Shows the props for the active component 
- Editor `TOP Bar`
  - Save: provides the current project in ZIP format
  - Load: loads an exiting project 
  - Delete: delete all data from current project

<br />

## Design 

- The project will have a JSON associated that saves the project structure. A possible structure:

```json
{
    "info": "Project info",
    "demo": "#",
    "layout": "page",
    "pages": {
        "index.html": {
            "component1":"",
            "component2":""
        },
        "about.html": {
            "component1":"",
            "component2":""
        }
    }
}
```
 
<br />

---
Rocket Builder - open-source page builder provide by AppSeed. 
