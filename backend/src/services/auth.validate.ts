import validator from "validator";
import {
    RegExpMatcher,
    englishDataset,
    englishRecommendedTransformers
} from "obscenity";

const profanityMatcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
});

export function validateEmail(email: string): string | null {
    if (!validator.isEmail(email)) {
        return "Please provide a valid email address.";
    }

    return null;
}

export function validateUsername(username: string): string | null {

    if (username.trim().length < 3) {
        return "Username must be at least 3 characters long.";
    }

    if (/\s/.test(username)) {
        return "Username cannot contain spaces.";
    }

    if (!/^[a-zA-Z0-9-]+$/.test(username)) {
        return "Username can only contain letters, numbers, and hyphens.";
    }

    if (username.startsWith("-")) {
        return "Username cannot start with a hyphen.";
    }

    if (username.endsWith("-")) {
        return "Username cannot end with a hyphen.";
    }

    if (!/[a-zA-Z]/.test(username)) {
        return "Username must contain at least one letter.";
    }

    if (profanityMatcher.hasMatch(username)) {
        return "Username contains inappropriate language.";
    }

    return null;
}

export function validatePassword(password: string): string | null {

    if (password.trim().length < 8) {
        return "Password must be at least 8 characters long.";
    }

    if (/\s/.test(password)) {
        return "Password cannot contain spaces.";
    }

    if (!/[A-Z]/.test(password)) {
        return "Password must contain at least one capital letter.";
    }

    if (!/[0-9!@#$%^&*(),.?":{}|<>[\]\\/'`~_+=;:-]/.test(password)) {
        return "Password must contain at least one number or special character.";
    }

    return null;
}