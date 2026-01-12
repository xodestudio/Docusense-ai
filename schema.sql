-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (Updated for Clerk ID which is a String, not UUID)
CREATE TABLE users (
    id TEXT PRIMARY KEY, -- Clerk ID (e.g., user_2b...)
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    stripe_customer_id VARCHAR(255) UNIQUE,
    price_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'inactive',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PDF Summaries table
CREATE TABLE pdf_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL, -- Linked to Clerk User ID
    original_file_url TEXT NOT NULL,
    summary_text TEXT NOT NULL,
    title TEXT,
    file_name TEXT,
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payments table (Updated with new Billing Columns)
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    amount INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL,
    stripe_payment_id VARCHAR(255) UNIQUE NOT NULL,
    price_id VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL, -- Email reference (Foreign key optional based on logic)
    customer_name TEXT,
    billing_country TEXT,
    billing_address TEXT,
    save_info BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to update updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pdf_summaries_updated_at
    BEFORE UPDATE ON pdf_summaries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();