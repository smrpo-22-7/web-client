export interface OpenApiDefinition {
    components: {
        schemas: {
            [schemaName: string]: {
                enum: string[];
                type: string;
                [key: string]: any;
            }
        }
    };
    
    [key: string]: any;
}
