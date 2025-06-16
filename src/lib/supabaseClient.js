import { createClient } from '@supabase/supabase-js';

const supabaseUrl =  'https://nsvkkmyvpamqpqxjodaj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zdmtrbXl2cGFtcXBxeGpvZGFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NjY0ODIsImV4cCI6MjA2MTE0MjQ4Mn0.xf4UNb9frIr4uOkUFM0Mf7DzlqaxWyHACMLXhseOJH4';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
