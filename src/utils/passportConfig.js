"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_github2_1 = require("passport-github2");
const supabase_1 = require("./supabase");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';
const createJwtToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};
const handleOAuthUser = (profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const email = ((_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) || `${profile.id}@${profile.provider}.com`;
        if (!email)
            return done(new Error('Không tìm thấy email từ OAuth'));
        const { data: existingUser, error } = yield supabase_1.supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        if (error && error.code !== 'PGRST116')
            return done(error);
        let user;
        if (!existingUser) {
            const { data, error: insertError } = yield supabase_1.supabase
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
            if (insertError)
                return done(insertError);
            user = data;
        }
        else {
            const { data, error: updateError } = yield supabase_1.supabase
                .from('users')
                .update({
                last_login: new Date().toISOString(),
                login_count: existingUser.login_count + 1,
            })
                .eq('id', existingUser.id)
                .select()
                .single();
            if (updateError)
                return done(updateError);
            user = data;
        }
        const token = createJwtToken({ id: user.id, email: user.email, role: user.role });
        return done(null, { token, profile: user });
    }
    catch (error) {
        return done(error);
    }
});
// Google OAuth Strategy
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/authSocial/google/callback',
    scope: ['profile', 'email'],
}, (accessToken, refreshToken, profile, done) => {
    handleOAuthUser(profile, done);
}));
// GitHub OAuth Strategy
passport_1.default.use(new passport_github2_1.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/api/authSocial/github/callback',
    scope: ['user:email'],
}, (accessToken, refreshToken, profile, done) => {
    handleOAuthUser(profile, done);
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((obj, done) => {
    done(null, obj);
});
exports.default = passport_1.default;
