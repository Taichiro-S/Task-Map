jest.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    // auth: (path: string) => ({
    //   signUp: jest.fn().mockResolvedValue({
    //     data: { path },
    //     error: null,
    //   }),
    //   signInWithPassword: jest.fn().mockResolvedValue({
    //     data: { path },
    //     error: null,
    //   }),
    //   signOut: jest.fn().mockResolvedValue({
    //     data: { path },
    //     error: null,
    //   }),
    //   getUser: jest.fn().mockResolvedValue({
    //     data: { path },
    //     error: null,
    //   }),
    // }),
  }),
}))
