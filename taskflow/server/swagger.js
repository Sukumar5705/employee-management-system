    import swaggerJsdoc from 'swagger-jsdoc';

    const options = {
    definition: {
        openapi: '3.0.0',

        info: {
        title: 'TaskFlow API',
        version: '1.0.0',
        description:
            'Production-grade task management REST API with JWT authentication and role-based access control.',
        },

        servers: [
        {
            url:
            process.env.NODE_ENV === 'production'
                ? 'https://employee-management-system-4-ji3v.onrender.com/api/v1'
                : 'http://localhost:5000/api/v1',
        },
        ],

        tags: [
        {
            name: 'Authentication',
            description: 'Authentication APIs',
        },
        {
            name: 'Tasks',
            description: 'Task management APIs',
        },
        {
            name: 'Employees',
            description: 'Employee management APIs',
        },
        {
            name: 'Performance',
            description: 'Performance analytics APIs',
        },
        ],

        components: {
        securitySchemes: {
            bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            },
        },
        },

        security: [
        {
            bearerAuth: [],
        },
        ],
    },

    apis: ['./routes/*.js'],
    };

    const swaggerSpec = swaggerJsdoc(options);

    export default swaggerSpec;
