//Función para invocar el modelo Claude3 Sonnet 
export function request(ctx) {
    try {
        const { ingredients = [] } = ctx.args;

        // Construct the prompt with the provided ingredients
        const prompt = `Suggest a recipe idea using these ingredients: ${ingredients.join(", ")}.`;

        // Return the request configuration
        return {
            resourcePath: `/model/anthropic.claude-3-sonnet-20240229-v1:0/invoke`,
            method: "POST",
            params: {
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    anthropic_version: "bedrock-2023-05-31",
                    max_tokens: 1000,
                    messages: [
                        {
                            role: "user",
                            content: [
                                {
                                    type: "text",
                                    text: `\n\nHuman: ${prompt}\n\nAssistant:`,
                                },
                            ],
                        },
                    ],
                }),
            },
        };
    } catch (error) {
        // Log the error message
        console.error('Error creating the request configuration:', error);

        // Return a fallback configuration or an error response
        return {
            resourcePath: '',
            method: '',
            params: {
                headers: {},
                body: JSON.stringify({
                    error: 'Failed to create request configuration.',
                }),
            },
        };
    }
}


//Función para parsear la respuesta y retornar la receta  
export function response(ctx) {
    try {
        // Parse the response body
        const parsedBody = JSON.parse(ctx.result.body);

        // Ensure the content exists and has the expected structure
        if (!parsedBody.content || !parsedBody.content[0] || !parsedBody.content[0].text) {
            throw new Error('Unexpected response structure');
        }

        // Extract the text content from the response
        const res = {
            body: parsedBody.content[0].text,
        };

        // Return the response
        return res;
    } catch (error) {
        // Log the error message
        console.error('Error processing the response:', error);

        // Return a fallback response to avoid breaking the system
        return {
            body: 'An error occurred while processing the response.',
        };
    }
}
