/// <reference types="cypress" />

// Import commands from each feature module
import './commands/auth';
import './commands/owners';

export {}; // NOSONAR - Required for TypeScript to treat file as module for global augmentation
