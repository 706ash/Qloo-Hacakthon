// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://sxfvomucqfmlzhwumiem.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4ZnZvbXVjcWZtbHpod3VtaWVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5ODg0OTUsImV4cCI6MjA2OTU2NDQ5NX0.uuOoYcMoAFbwl_UewygbjdsTLzRGdcjvD063zI_bhRM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
