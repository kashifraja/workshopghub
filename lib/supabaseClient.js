import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dnunrkkrsltywmtoyirj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRudW5ya2tyc2x0eXdtdG95aXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MDI5MDEsImV4cCI6MjA1ODE3ODkwMX0.a0zK7-4exPuoc1b9ykrMX0GeqsUwx1qATAOXiImrUqc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
