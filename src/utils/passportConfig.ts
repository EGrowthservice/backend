import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { supabase } from '../config/supabase';
import jwt, { SignOptions } from 'jsonwebtoken';
import ms from 'ms';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';

const createJwtToken = (payload: object): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN as ms.StringValue || '7d' });
};


type OAuthProfile = any;

const handleOAuthUser = async (profile: OAuthProfile, done: (error: any, user?: any) => void) => {
    try {
        const email = profile.emails?.[0]?.value || `${profile.id}@${profile.provider}.com`;
        if (!email) return done(new Error('Không tìm thấy email từ OAuth'));

        const { data: existingUser, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error && error.code !== 'PGRST116') return done(error);

        let user;

        if (!existingUser) {
            const { data, error: insertError } = await supabase
                .from('users')
                .insert([
                    {
                        email,
                        name: profile.displayName || email,
                        role: 'user',
                        is_verified: true,
                        oauth_provider: profile.provider,
                        oauth_id: profile.id,
                        last_login: new Date().toISOString(),
                        login_count: 1,
                    },
                ])
                .select()
                .single();

            if (insertError) return done(insertError);
            user = data;
        } else {
            const { data, error: updateError } = await supabase
                .from('users')
                .update({
                    last_login: new Date().toISOString(),
                    login_count: existingUser.login_count + 1,
                })
                .eq('id', existingUser.id)
                .select()
                .single();

            if (updateError) return done(updateError);
            user = data;
        }

        const token = createJwtToken({ id: user.id, email: user.email, role: user.role });
        return done(null, { token, profile: user });
    } catch (error) {
        return done(error);
    }
};

// Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/authSocial/google/callback',
            scope: ['profile', 'email'],
        },
        (accessToken: string, refreshToken: string, profile: any, done: any) => {
            handleOAuthUser(profile, done);
        }
    )
);



// GitHub OAuth Strategy
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID || '',
            clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
            callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/api/authSocial/github/callback',
            scope: ['user:email'],
        },
        (accessToken: string, refreshToken: string, profile: any, done: any) => {
            handleOAuthUser(profile, done);
        }
    )
);

passport.serializeUser((user: any, done) => {
    done(null, user);
});

passport.deserializeUser((obj: any, done) => {
    done(null, obj);
});

export default passport;
