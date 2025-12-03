public with sharing class SwaggerController {

    @AuraEnabled(cacheable=true)
    public static String getSwaggerJson() {
        // NOTE: Replace 'Your_External_API_Endpoint' with the actual URL
        // where your swagger.json/openapi.json is hosted.
        String endpoint = 'https://petstore.swagger.io/v2/swagger.json';
        
        // Ensure you have a Remote Site Setting or Named Credential configured
        // for the domain you are calling out to.
        
        HttpRequest req = new HttpRequest();
        req.setEndpoint(endpoint);
        req.setMethod('GET');
        req.setTimeout(10000); // Set timeout as needed (in milliseconds)

        try {
            Http http = new Http();
            HttpResponse res = http.send(req);

            if (res.getStatusCode() == 200) {
                // Return the raw JSON string
                return res.getBody();
            } else {
                // Handle non-200 responses
                System.debug('HTTP Error: ' + res.getStatusCode() + ' - ' + res.getStatus());
                throw new AuraHandledException('Failed to retrieve Swagger JSON. Status: ' + res.getStatusCode());
            }
        } catch (Exception e) {
            System.debug('Callout Error: ' + e.getMessage());
            throw new AuraHandledException('An error occurred during callout: ' + e.getMessage());
        }
    }
}