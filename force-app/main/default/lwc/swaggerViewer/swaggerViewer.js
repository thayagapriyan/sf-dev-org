import { LightningElement, api } from 'lwc';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import SWAGGER_UI_RESOURCE from '@salesforce/resourceUrl/swagger';
import getSwaggerJson from '@salesforce/apex/SwaggerController.getSwaggerJson';

// Array of files to load from the static resource
const SWAGGER_FILES = [
    { type: 'style', path: '/swagger/swagger-ui.css' },
    { type: 'script', path: '/swagger/swagger-ui-bundle.js' },
    // Optional, uncomment if using standalone preset
    // { type: 'script', path: 'swagger-ui-standalone-preset.js' }
];

export default class SwaggerViewer extends LightningElement {
    isUILoaded = false;

    // Called after the component is inserted into the DOM
    connectedCallback() {
        this.loadSwaggerFiles();
    }

    // Loads the CSS and JS files from the static resource
    loadSwaggerFiles() {
        const promises = SWAGGER_FILES.map(file => {
            const url = SWAGGER_UI_RESOURCE + '/' + file.path;
            return file.type === 'style' 
                ? loadStyle(this, url) 
                : loadScript(this, url);
        });

        Promise.all(promises)
            .then(() => {
                console.log('Swagger UI files loaded successfully.');
                this.isUILoaded = true; // Mark as loaded
                this.fetchAndRenderSwagger();
            })
            .catch(error => {
                console.error('Error loading Swagger UI files:', error);
                // Display error to user if necessary
            });
    }

    // Fetches the JSON and renders the UI
    async fetchAndRenderSwagger() {
        try {
            // 1. Fetch JSON from Apex
            const swaggerJsonString = await getSwaggerJson();
            const swaggerJson = JSON.parse(swaggerJsonString);
            
            // The Swagger UI needs a DOM element to attach to
            const container = this.template.querySelector('.swagger-container');
            
            if (container && window.SwaggerUIBundle) {
                // 2. Render the UI
                window.SwaggerUIBundle({
                    spec: swaggerJson, // Pass the parsed JSON object directly
                    domNode: container,
                    // Additional configuration options (optional):
                    deepLinking: true,
                    presets: [
                        window.SwaggerUIBundle.presets.apis,
                        // window.SwaggerUIStandalonePreset // Uncomment if loading standalone preset
                    ],
                    plugins: [
                        window.SwaggerUIBundle.plugins.DownloadUrl
                    ],
                    layout: "BaseLayout" 
                });
                console.log('Swagger UI rendered successfully.');
            } else {
                console.error('Swagger container or SwaggerUIBundle not found.');
            }

        } catch (error) {
            console.error('Error fetching or rendering Swagger JSON:', error);
            // Display error to user
        }
    }
}