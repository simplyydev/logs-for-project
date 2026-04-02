import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

type Cookie = {
  name: string;
  value: string;
  options?: Record<string, any>;
};

export const updateSession = (request: NextRequest) => {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },

      setAll(cookiesToSet: Cookie[]) {
        // Set cookies on request
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );

        // Recreate response so cookies propagate
        response = NextResponse.next({ request });

        // Set cookies on response
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Important: refresh session
  void supabase.auth.getUser();

  return response;
};