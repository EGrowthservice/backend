src/
├── config/
│   ├── supabase.config.ts
│   └── jwt.config.ts
├── core/
│   ├── errors/
│   │   ├── api.error.ts
│   │   └── handler.error.ts
│   ├── interfaces/
│   │   └── response.interface.ts
│   └── middleware/
│       ├── auth.middleware.ts
│       ├── error.middleware.ts
│       └── validate.middleware.ts
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.route.ts
│   │   ├── auth.validation.ts
│   │   └── auth.interface.ts
│   └── category/
│       ├── category.controller.ts
│       ├── category.service.ts
│       ├── category.route.ts
│       ├── category.validation.ts
│       └── category.interface.ts
├── utils/
│   ├── email.util.ts
│   └── password.util.ts
├── app.ts
└── server.ts