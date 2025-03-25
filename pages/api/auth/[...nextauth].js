import NextAuth from "next-auth";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export default NextAuth({
  adapter: SupabaseAdapter(supabase),
  providers: [
    // You can add other providers if needed
  ],
  callbacks: {
    async session(session, user) {
      session.user.id = user.id; // Add user ID to session
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',  // Custom sign-in page
  },
});
